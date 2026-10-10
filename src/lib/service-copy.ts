import { business, location } from './config';
import kitchen from '../assets/photos/hero-kitchen.jpg';

const where = `${location.city} and Sioux Falls`;
const suffix = `| ${business.name}`;

export const remodelingCopy = {
  title: `Remodeling Contractor in ${where} ${suffix}`,
  description: `Kitchen, bathroom, basement and flooring remodels around Sioux Falls. ${business.owner} bids it and builds it. Free estimates.`,
  h1: `Remodeling in ${where}`,
  intro: `Kitchens, bathrooms, basements, flooring and trim. One person runs your job from the first walk-through to the last piece of trim.`,
  ctaLabel: 'Get a free remodeling estimate',
  photo: kitchen,
  photoAlt: 'Finished kitchen with white upper cabinets, stained lower cabinets, stainless appliances and new plank flooring',
  rooms: [
    {
      name: 'Kitchens',
      timeline: `Usually 4 to 8 weeks`,
      body: `Cabinets, counters, tile, lighting and layout changes. I line up the plumber and electrician and keep them on schedule.`,
    },
    {
      name: 'Bathrooms',
      timeline: `Usually 2 to 4 weeks`,
      body: `Tub-to-shower conversions, tile showers, vanities and the waterproofing behind them that nobody sees.`,
    },
    {
      name: 'Basements',
      timeline: `Usually 4 to 8 weeks`,
      body: `Framing, egress, bedrooms, a bathroom or a family room. Finished so it does not feel like a basement.`,
    },
    {
      name: 'Flooring & trim',
      timeline: `Usually a few days to 2 weeks`,
      body: `LVP, hardwood and tile, then base, casing and doors set straight so the room looks finished.`,
    },
  ],
  behindHeading: 'Behind the wall',
  behindBody: `Once the drywall comes off, you see what the last guy did. I show you what I find, tell you what it costs to fix, and you decide before I keep going.`,
  galleryHeading: `Recent remodels`,
  faqHeading: `Remodeling questions`,
  faqs: [
    {
      question: `Do you pull the permits?`,
      answer: `Yes. If the job needs a permit, I pull it and schedule the inspections.`,
    },
    {
      question: `Can we live in the house during the remodel?`,
      answer: `Most people do. I set up dust walls and clean up at the end of each day.`,
    },
  ],
};

export const additionsCopy = {
  title: `Home Additions in ${where} ${suffix}`,
  description: `Room additions, bump-outs and main-floor suites around Sioux Falls. Planned, permitted and built by ${business.owner}.`,
  h1: `Home additions in ${where}`,
  intro: `More room without moving out of the neighborhood. I take an addition from a sketch on paper to keys in your hand.`,
  ctaLabel: 'Get a free addition estimate',
  whyHeading: `Add on or move?`,
  whyBody: `If you like your lot, your neighbors and your school, adding on usually costs less than selling, buying and moving. I will tell you straight if it does not pencil out.`,
  stepsHeading: 'From sketch to keys',
  steps: [
    { title: `Walk the lot`, body: `We look at setbacks, the roofline and where the new room ties in.` },
    { title: `Drawings and price`, body: `You get plans and a written price before anything is signed.` },
    { title: `Permits`, body: `I handle the city or county permit and the inspections.` },
    { title: `Build`, body: `Foundation, framing, roof, mechanicals and finish, in that order.` },
    { title: `Keys`, body: `Final inspection, a walk-through together and a punch list I finish.` },
  ],
  galleryHeading: `Additions I've built`,
  faqHeading: `Addition questions`,
  faqs: [
    {
      question: `How long does an addition take?`,
      answer: `Most take a few months from permit to keys. I give you a schedule with the bid.`,
    },
    {
      question: `Do I need an architect?`,
      answer: `Not always. For many additions I can work with a drafter. I will tell you when an architect is needed.`,
    },
  ],
};

export const decksCopy = {
  title: `Deck Builder in ${where} ${suffix}`,
  description: `New decks, deck replacement, stairs and railings around Sioux Falls. Wood or composite, built solid by ${business.owner}.`,
  h1: `Decks in ${where}`,
  intro: `New builds, replacements and stairs that do not wobble. Footings below frost and framing that will outlast the boards on top.`,
  ctaLabel: 'Get a free deck estimate',
  galleryHeading: `Decks I've built`,
  tableHeading: `Wood or composite?`,
  tableCaption: `Pressure-treated wood compared with composite decking`,
  tableRows: [
    { label: 'Up-front cost', wood: `Lower`, composite: `Higher` },
    { label: 'Upkeep', wood: `Stain or seal every 2 to 3 years`, composite: `Wash once or twice a year` },
    { label: 'Life of the boards', wood: `10 to 15 years with care`, composite: `25 years or more` },
    { label: 'Summer sun', wood: `Stays cooler`, composite: `Gets hot, lighter colors help` },
    { label: 'Splinters', wood: `Can splinter as it ages`, composite: `No` },
  ],
  includedHeading: `Every deck I build gets`,
  included: [
    `Footings dug below frost depth`,
    `Flashing where the ledger meets the house`,
    `Stairs and railings built to code`,
    `Hidden fasteners on composite`,
  ],
  faqHeading: `Deck questions`,
  faqs: [
    {
      question: `Can you build on my old deck frame?`,
      answer: `Sometimes. I check the footings, ledger and joists first and tell you what is safe to reuse.`,
    },
    {
      question: `Do I need a permit for a deck?`,
      answer: `Usually, yes. I pull it and schedule the footing and final inspections.`,
    },
  ],
};

export const sidingCopy = {
  title: `Siding and Exterior Trim in ${where} ${suffix}`,
  description: `Siding, soffit, fascia and exterior trim around Sioux Falls. Straight lines and tight corners from ${business.owner}.`,
  h1: `Siding and trim in ${where}`,
  intro: `Siding, soffit, fascia and the trim that finishes it. The corners and window wraps are what people notice, so that is where I slow down.`,
  ctaLabel: 'Get a free siding estimate',
  includedHeading: `What a siding job includes`,
  included: [
    `Tear-off and haul-away of the old siding`,
    `New house wrap and flashing at every window and door`,
    `Siding, soffit, fascia and trim`,
    `Magnet sweep of the yard when we're done`,
  ],
  galleryHeading: `Siding jobs`,
  faqHeading: `Siding questions`,
  faqs: [
    {
      question: `Vinyl, LP or fiber cement?`,
      answer: `It depends on budget and look. I bring samples and go over the trade-offs at the estimate.`,
    },
    {
      question: `Can you just replace the trim?`,
      answer: `Yes. Rotted or tired trim can be replaced without residing the whole house.`,
    },
  ],
};

export const newConstructionCopy = {
  title: `New Construction in ${where} ${suffix}`,
  description: `Homes, garages and shops built from the slab up around Sioux Falls by ${business.owner}.`,
  h1: `New construction in ${where}`,
  intro: `Homes, garages and shops from the slab up. Smaller in number, bigger in attention.`,
  ctaLabel: 'Talk to me about a new build',
  howHeading: 'How I work with you',
  how: [
    { title: `You talk to me`, body: `Not a salesman, not an office. Me, from the first meeting to the walk-through.` },
    { title: `A written price`, body: `Allowances are spelled out so there are no surprises at the end.` },
    { title: `Updates you can see`, body: `Photos and a short note each week while we build.` },
  ],
  galleryHeading: `New builds`,
};
