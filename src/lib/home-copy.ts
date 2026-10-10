import { business, contact, location } from './config';

const towns = location.serviceTowns.filter((t) => t !== location.city);
const townList = `${towns.slice(0, -1).join(', ')} and ${towns[towns.length - 1]}`;

export const homeCopy = {
  title: `Remodeling Contractor in ${location.city}, ${location.region} | ${business.name}`,
  description: `Kitchens, bathrooms, basements, additions and decks around Sioux Falls. ${business.owner} bids the job and builds it. Free estimates.`,
  stamp: `Based in ${location.city}, ${location.region}`,
  sub: `Kitchens, baths, basements, additions and decks in ${location.city}, Sioux Falls and the towns around them. You deal with me from the first walk-through to the last screw.`,
  primaryCta: 'Get a free estimate',
  heroAlt: 'Finished kitchen with white upper cabinets, stained lower cabinets, stainless appliances and new plank flooring, with a laundry closet and barn door beyond',
  proof: [
    'Free estimates',
    `Callbacks ${contact.callbackPromise}`,
    `The guy who bids it builds it`,
  ] as [string, string, string],
  servicesHeading: 'What I build',
  beforeAfterHeading: 'One job, start to finish',
  processHeading: 'How a job goes',
  steps: [
    {
      title: 'Walk-through',
      body: 'I come out, look at the space and listen to what you want.',
    },
    {
      title: 'Written bid',
      body: 'You get a written price that spells out what is and is not included.',
    },
    {
      title: 'The build',
      body: 'I run the job myself and keep you posted on what is happening each day.',
    },
    {
      title: 'Final walk',
      body: 'We walk it together and I fix anything you are not happy with before I call it done.',
    },
  ],
  introHeading: `Hi, I'm ${business.owner}.`,
  introBody: `I started ${business.name} so the person who bids your job is the person who builds it. No salesman, no hand-off to a crew you never met.`,
  introLink: 'More about me',
  areaHeading: 'Where I work',
  areaLink: 'See every town I work in',
  areaBody: `I work within about ${location.radiusMiles} miles of ${location.city}: ${townList}. A little farther out? Call and ask.`,
};
