import type { APIRoute } from 'astro';
import template from '../server/contact.php?raw';
import { formSettings } from '../lib/form';

export const GET: APIRoute = () => {
  const bytes = new TextEncoder().encode(JSON.stringify(formSettings));
  const encoded = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
  return new Response(template.replace('__SETTINGS__', encoded), {
    headers: { 'Content-Type': 'application/x-httpd-php' },
  });
};
