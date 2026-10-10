import { business, contact, location } from './config';

const suffix = `| ${business.name}`;

export const estimateCopy = {
  title: `Free Estimate ${suffix}`,
  description: `Ask for a free estimate on a remodel, addition, deck or siding job around Sioux Falls. ${business.owner} reads every request.`,
  h1: 'Get a free estimate',
  intro: `Tell me a little about the job. I read every one of these myself and get back to you ${contact.callbackPromise}.`,
  invalid: 'Some details were missing or not quite right. Please check the form and send it again.',
  serverError: `Something went wrong on my end and your request did not send. Please call or text me at`,
  sideHeading: `What happens next`,
  sideSteps: [
    `I call you back ${contact.callbackPromise}.`,
    `We set a time for me to come look at the space.`,
    `You get a written price. No pressure, no follow-up calls you did not ask for.`,
  ],
  sideCall: `Rather talk now?`,
};

export const thanksCopy = {
  title: `Thanks ${suffix}`,
  description: `Your estimate request was sent to ${business.owner}.`,
  h1: `Thanks, I got it.`,
  body: `I will call you back ${contact.callbackPromise}. If it is urgent, call or text me.`,
  home: 'Back to the home page',
};

export const notFoundCopy = {
  title: `Page not found ${suffix}`,
  description: `That page is not here.`,
  h1: `That page is not here.`,
  body: `It may have moved. Call me or head back to the home page.`,
  home: 'Go to the home page',
};

export const aboutCopy = {
  title: `About ${business.owner}, ${business.name} ${suffix}`,
  description: `Meet ${business.owner}, the contractor who bids and builds every ${business.name} job in ${location.city} and around Sioux Falls.`,
  h1: `About ${business.owner}`,
  story: [
    `I started ${business.name} in ${business.foundingYear} so the person you meet at the estimate is the person who builds your job.`,
    `I live in ${location.city} and most of my work is within a half hour of home. That means I am around after the job is done, too.`,
  ],
  runHeading: 'How I run a job',
  run: [
    `I give you a written price before work starts.`,
    `I tell you when I will be there, and I show up.`,
    `If I find a problem behind a wall, you hear about it before I fix it.`,
    `The job site gets cleaned up at the end of every day.`,
  ],
  paperworkHeading: 'The paperwork',
};

export const serviceAreaCopy = {
  title: `Service Area: ${location.city}, Sioux Falls and Nearby Towns ${suffix}`,
  description: `${business.name} works in ${location.serviceTowns.join(', ')}.`,
  h1: `Where I work`,
  intro: `I am based in ${location.city} and work within about ${location.radiusMiles} miles. Not sure if you are in range? Call and ask.`,
};

export const privacyCopy = {
  title: `Privacy ${suffix}`,
  description: `How ${business.name} handles the information you send through this website.`,
  h1: 'Privacy',
  sections: [
    {
      heading: 'What I collect',
      body: `When you ask for an estimate, the form sends me your name, phone number, email if you give it, town, the type of job, your notes and any photos you attach. Nothing else is collected through the form.`,
    },
    {
      heading: 'How it is used',
      body: `I use it to contact you about your project and to price the job. It is sent to me by email and is not stored on this website.`,
    },
    {
      heading: 'Who sees it',
      body: `Only me. I do not sell or share your information. Your photos are kept only as long as I need them for the estimate.`,
    },
    {
      heading: 'Analytics',
      body: `This site may count visits and button taps to see what is working. It does not collect your name or contact details.`,
    },
    {
      heading: 'Questions',
      body: `Email ${contact.email} or call ${contact.phoneDisplay} and I will tell you what I have and delete it if you ask.`,
    },
  ],
};
