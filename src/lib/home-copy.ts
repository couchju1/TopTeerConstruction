import { business, contact, location } from './config';

const towns = location.serviceTowns.filter((t) => t !== location.city);
const townList = `${towns.slice(0, -1).join(', ')} and ${towns[towns.length - 1]}`;

export const homeCopy = {
  title: `[CONFIRM: plan Home] Remodeling Contractor in ${location.city}, ${location.region} | ${business.name}`,
  description: `[CONFIRM: plan Home] Kitchens, bathrooms, basements, additions and decks around Sioux Falls. ${business.owner} bids the job and builds it. Free estimates.`,
  stamp: `Based in ${location.city}, ${location.region}`,
  sub: `[CONFIRM: plan Home] Kitchens, baths, basements, additions and decks in ${location.city}, Sioux Falls and the towns around them. You deal with me from the first walk-through to the last screw.`,
  primaryCta: 'Get a free estimate',
  heroAlt: '[CONFIRM: real photo and alt text] Placeholder for the hero photo',
  proof: [
    'Free estimates',
    `Callbacks ${contact.callbackPromise}`,
    `[CONFIRM: plan Home] The guy who bids it builds it`,
  ] as [string, string, string],
  servicesHeading: 'What I build',
  beforeAfterHeading: 'One job, start to finish',
  processHeading: 'How a job goes',
  steps: [
    {
      title: '[CONFIRM: plan Home] Walk-through',
      body: '[CONFIRM: plan Home] I come out, look at the space and listen to what you want.',
    },
    {
      title: '[CONFIRM: plan Home] Written bid',
      body: '[CONFIRM: plan Home] You get a written price that spells out what is and is not included.',
    },
    {
      title: '[CONFIRM: plan Home] The build',
      body: '[CONFIRM: plan Home] I run the job myself and keep you posted on what is happening each day.',
    },
    {
      title: '[CONFIRM: plan Home] Final walk',
      body: '[CONFIRM: plan Home] We walk it together and I fix anything you are not happy with before I call it done.',
    },
  ],
  introHeading: `[CONFIRM: plan Home] Hi, I'm ${business.owner}.`,
  introBody: `[CONFIRM: plan Home] I started ${business.name} so the person who bids your job is the person who builds it. No salesman, no hand-off to a crew you never met.`,
  introAlt: `[CONFIRM: real photo and alt text] Placeholder for a photo of ${business.owner}`,
  introLink: 'More about me',
  areaHeading: '[CONFIRM: plan Home] Where I work',
  areaLink: 'See every town I work in',
  areaBody: `[CONFIRM: plan Home] I work within about ${location.radiusMiles} miles of ${location.city}: ${townList}. A little farther out? Call and ask.`,
};
