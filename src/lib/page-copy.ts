import { business, contact, location } from './config';

const P = '[CONFIRM: plan]';
const suffix = `| ${business.name}`;

export const estimateCopy = {
  title: `${P} Free Estimate ${suffix}`,
  description: `${P} Ask for a free estimate on a remodel, addition, deck or siding job around Sioux Falls. ${business.owner} reads every request.`,
  h1: 'Get a free estimate',
  intro: `${P} Tell me a little about the job. I read every one of these myself and get back to you ${contact.callbackPromise}.`,
  invalid: 'Some details were missing or not quite right. Please check the form and send it again.',
  serverError: `${P} Something went wrong on my end and your request did not send. Please call or text me at`,
  sideHeading: `${P} What happens next`,
  sideSteps: [
    `${P} I call you back ${contact.callbackPromise}.`,
    `${P} We set a time for me to come look at the space.`,
    `${P} You get a written price. No pressure, no follow-up calls you did not ask for.`,
  ],
  sideCall: `${P} Rather talk now?`,
};

export const thanksCopy = {
  title: `Thanks ${suffix}`,
  description: `${P} Your estimate request was sent to ${business.owner}.`,
  h1: `${P} Thanks, I got it.`,
  body: `${P} I will call you back ${contact.callbackPromise}. If it is urgent, call or text me.`,
  home: 'Back to the home page',
};

export const notFoundCopy = {
  title: `Page not found ${suffix}`,
  description: `${P} That page is not here.`,
  h1: `${P} That page is not here.`,
  body: `${P} It may have moved. Call me or head back to the home page.`,
  home: 'Go to the home page',
};

export const aboutCopy = {
  title: `${P} About ${business.owner}, ${business.name} ${suffix}`,
  description: `${P} Meet ${business.owner}, the contractor who bids and builds every ${business.name} job in ${location.city} and around Sioux Falls.`,
  h1: `${P} About ${business.owner}`,
  photoAlt: `[CONFIRM: real photo] Placeholder for a photo of ${business.owner} on a job site`,
  story: [
    `${P} I started ${business.name} in ${business.foundingYear} so the person you meet at the estimate is the person who builds your job.`,
    `${P} I live in ${location.city} and most of my work is within a half hour of home. That means I am around after the job is done, too.`,
  ],
  runHeading: 'How I run a job',
  run: [
    `${P} I give you a written price before work starts.`,
    `${P} I tell you when I will be there, and I show up.`,
    `${P} If I find a problem behind a wall, you hear about it before I fix it.`,
    `${P} The job site gets cleaned up at the end of every day.`,
  ],
  paperworkHeading: 'The paperwork',
};

export const serviceAreaCopy = {
  title: `${P} Service Area: ${location.city}, Sioux Falls and Nearby Towns ${suffix}`,
  description: `${P} ${business.name} works in ${location.serviceTowns.join(', ')}.`,
  h1: `${P} Where I work`,
  intro: `${P} I am based in ${location.city} and work within about ${location.radiusMiles} miles. Not sure if you are in range? Call and ask.`,
  townLead: P,
};

export const privacyCopy = {
  title: `${P} Privacy ${suffix}`,
  description: `${P} How ${business.name} handles the information you send through this website.`,
  h1: 'Privacy',
  banner: '[CLIENT TO VERIFY] This privacy text needs to be checked by the client before launch.',
  sections: [
    {
      heading: 'What I collect',
      body: `${P} When you ask for an estimate, the form sends me your name, phone number, email if you give it, town, the type of job, your notes and any photos you attach. Nothing else is collected through the form.`,
    },
    {
      heading: 'How it is used',
      body: `${P} I use it to contact you about your project and to price the job. It is sent to me by email and is not stored on this website.`,
    },
    {
      heading: 'Who sees it',
      body: `${P} Only me. I do not sell or share your information. Your photos are kept only as long as I need them for the estimate.`,
    },
    {
      heading: 'Analytics',
      body: `${P} This site may count visits and button taps to see what is working. It does not collect your name or contact details.`,
    },
    {
      heading: 'Questions',
      body: `${P} Email ${contact.email} or call ${contact.phoneDisplay} and I will tell you what I have and delete it if you ask.`,
    },
  ],
};
