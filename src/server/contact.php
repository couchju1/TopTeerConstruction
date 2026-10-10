<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

$settings = json_decode(base64_decode('__SETTINGS__'), true);
date_default_timezone_set($settings['timezone']);
$root = dirname(__DIR__);
$env = load_env($root . '/.env');
$logFile = $env['LOG_FILE'] ?? $root . '/logs/contact.log';
$rateDir = $env['RATE_LIMIT_DIR'] ?? $root . '/storage/rate-limit';
$autoload = $env['VENDOR_AUTOLOAD'] ?? $root . '/vendor/autoload.php';

const FORM_PATH = '/free-estimate/';
const THANKS_PATH = '/thanks/';
const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;

function load_env(string $path): array
{
    if (!is_readable($path)) {
        return [];
    }
    $values = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $values[$key] = trim($value, "\"'");
    }
    return $values;
}

function wants_json(): bool
{
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

function finish(bool $ok, string $location, array $errors = [], int $status = 200): never
{
    if (wants_json()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'redirect' => $location, 'errors' => (object) $errors]);
        exit;
    }
    header('Location: ' . $location, true, 303);
    exit;
}

function write_log(string $file, string $message): void
{
    $dir = dirname($file);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
    @file_put_contents($file, sprintf("[%s] %s ip=%s\n", date('c'), $message, substr($ip, 0, 12)), FILE_APPEND | LOCK_EX);
}

function clean_line(string $value, int $max): string
{
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
    return mb_substr($value, 0, $max + 1);
}

function clean_text(string $value): string
{
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $value) ?? '';
    return trim($value);
}

function over_rate_limit(string $dir): bool
{
    if (!is_dir($dir) && !@mkdir($dir, 0750, true)) {
        return false;
    }
    $file = $dir . '/' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown') . '.json';
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }
    flock($handle, LOCK_EX);
    $now = time();
    $hits = json_decode(stream_get_contents($handle) ?: '[]', true) ?: [];
    $hits = array_values(array_filter($hits, fn ($t) => is_int($t) && $t > $now - RATE_WINDOW));
    $limited = count($hits) >= RATE_LIMIT;
    if (!$limited) {
        $hits[] = $now;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($hits));
    flock($handle, LOCK_UN);
    fclose($handle);
    return $limited;
}

function uploaded_photos(): array
{
    $files = $_FILES['photos'] ?? null;
    if (!is_array($files) || !isset($files['error'])) {
        return [];
    }
    $list = [];
    foreach ((array) $files['error'] as $i => $error) {
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        $list[] = [
            'error' => $error,
            'tmp' => ((array) $files['tmp_name'])[$i] ?? '',
            'size' => (int) (((array) $files['size'])[$i] ?? 0),
        ];
    }
    return $list;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit;
}

$messages = $settings['messages'];
$limits = $settings['limits'];

if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    finish(false, FORM_PATH . '#estimate-error', ['photos' => $messages['photosSize']], 413);
}

if (trim((string) ($_POST[$settings['honeypot']] ?? '')) !== '') {
    finish(true, THANKS_PATH);
}

$elapsed = $_POST['elapsed'] ?? '';
if ($elapsed !== '' && (!ctype_digit((string) $elapsed) || (int) $elapsed < $settings['minSeconds'] * 1000)) {
    finish(true, THANKS_PATH);
}

if (over_rate_limit($rateDir)) {
    write_log($logFile, 'rate limited');
    finish(false, FORM_PATH . '#estimate-server-error', ['form' => 'rate'], 429);
}

$name = clean_line((string) ($_POST['name'] ?? ''), $limits['name']);
$phone = clean_line((string) ($_POST['phone'] ?? ''), 30);
$email = clean_line((string) ($_POST['email'] ?? ''), $limits['email']);
$town = clean_line((string) ($_POST['town'] ?? ''), $limits['town']);
$projectType = clean_line((string) ($_POST['projectType'] ?? ''), 60);
$details = clean_text((string) ($_POST['details'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > $limits['name']) {
    $errors['name'] = $messages['name'];
}
$digits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($digits) === 11 && $digits[0] === '1') {
    $digits = substr($digits, 1);
}
if (strlen($digits) !== 10) {
    $errors['phone'] = $messages['phone'];
}
if ($email !== '' && (mb_strlen($email) > $limits['email'] || filter_var($email, FILTER_VALIDATE_EMAIL) === false)) {
    $errors['email'] = $messages['email'];
}
if ($town === '' || mb_strlen($town) > $limits['town']) {
    $errors['town'] = $messages['town'];
}
if (!in_array($projectType, $settings['projectTypes'], true)) {
    $errors['projectType'] = $messages['projectType'];
}
if (mb_strlen($details) > $limits['details']) {
    $errors['details'] = $messages['details'];
}

$photos = uploaded_photos();
$attachments = [];
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/heic' => 'heic', 'image/webp' => 'webp'];
if (count($photos) > $settings['maxFiles']) {
    $errors['photos'] = $messages['photosCount'];
} else {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    foreach ($photos as $i => $photo) {
        if (in_array($photo['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $photo['size'] > $settings['maxFileBytes']) {
            $errors['photos'] = $messages['photosSize'];
            break;
        }
        if ($photo['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($photo['tmp'])) {
            $errors['photos'] = $messages['photosType'];
            break;
        }
        $mime = $finfo->file($photo['tmp']);
        if (!in_array($mime, $settings['acceptedTypes'], true)) {
            $errors['photos'] = $messages['photosType'];
            break;
        }
        $attachments[] = [$photo['tmp'], sprintf('photo-%d.%s', $i + 1, $extensions[$mime]), $mime];
    }
}

if ($errors) {
    finish(false, FORM_PATH . '#estimate-error', $errors, 422);
}

if (!is_readable($autoload)) {
    write_log($logFile, 'mailer autoload missing at ' . $autoload);
    finish(false, FORM_PATH . '#estimate-server-error', [], 500);
}
require $autoload;

$body = implode("\n", [
    'New estimate request from the website.',
    '',
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . ($email !== '' ? $email : '(not given)'),
    'Town: ' . $town,
    'Project: ' . $projectType,
    '',
    'Details:',
    $details !== '' ? $details : '(none)',
    '',
    'Photos attached: ' . count($attachments),
    'Sent: ' . date('D, M j, Y g:i a T'),
]);

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $env['SMTP_HOST'] ?? '';
    $mail->Port = (int) ($env['SMTP_PORT'] ?? 587);
    $secure = strtolower($env['SMTP_SECURE'] ?? 'tls');
    $mail->SMTPSecure = $secure === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : ($secure === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : '');
    $mail->SMTPAutoTLS = $secure !== 'none';
    $mail->SMTPAuth = ($env['SMTP_USER'] ?? '') !== '';
    $mail->Username = $env['SMTP_USER'] ?? '';
    $mail->Password = $env['SMTP_PASS'] ?? '';
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($env['MAIL_FROM'] ?? ($env['SMTP_USER'] ?? $settings['recipient']), $settings['businessName'] . ' website');
    $mail->addAddress($settings['recipient']);
    if ($email !== '') {
        $mail->addReplyTo($email, $name);
    }
    $mail->isHTML(false);
    $mail->Subject = sprintf('Estimate request: %s, %s', $projectType, $town);
    $mail->Body = $body;
    foreach ($attachments as [$tmp, $filename, $mime]) {
        $mail->addAttachment($tmp, $filename, PHPMailer::ENCODING_BASE64, $mime);
    }
    $mail->send();
} catch (MailException $e) {
    write_log($logFile, 'send failed: ' . $mail->ErrorInfo);
    finish(false, FORM_PATH . '#estimate-server-error', [], 502);
}

finish(true, THANKS_PATH . '?' . http_build_query(['sent' => '1', 'town' => $town, 'type' => $projectType]));
