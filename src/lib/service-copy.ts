import { business, location } from './config';

const P = '[CONFIRM: plan]';
const where = `${location.city} and Sioux Falls`;
const suffix = `| ${business.name}`;

export const remodelingCopy = {
  title: `${P} Remodeling Contractor in ${where} ${suffix}`,
  description: `${P} Kitchen, bathroom, basement and flooring remodels around Sioux Falls. ${business.owner} bids it and builds it. Free estimates.`,
  h1: `${P} Remodeling in ${where}`,
  intro: `${P} Kitchens, bathrooms, basements, flooring and trim. One person runs your job from the first walk-through to the last piece of trim.`,
  ctaLabel: 'Get a free remodeling estimate',
  photoAlt: `${P} Placeholder for a finished remodel photo`,
  rooms: [
    {
      name: 'Kitchens',
      timeline: `${P} Usually 4 to 8 weeks`,
      body: `${P} Cabinets, counters, tile, lighting and layout changes. I line up the plumber and electrician and keep them on schedule.`,
    },
    {
      name: 'Bathrooms',
      timeline: `${P} Usually 2 to 4 weeks`,
      body: `${P} Tub-to-shower conversions, tile showers, vanities and the waterproofing behind them that nobody sees.`,
    },
    {
      name: 'Basements',
      timeline: `${P} Usually 4 to 8 weeks`,
      body: `${P} Framing, egress, bedrooms, a bathroom or a family room. Finished so it does not feel like a basement.`,
    },
    {
      name: 'Flooring & trim',
      timeline: `${P} Usually a few days to 2 weeks`,
      body: `${P} LVP, hardwood and tile, then base, casing and doors set straight so the room looks finished.`,
    },
  ],
  behindHeading: 'Behind the wall',
  behindBody: `${P} Once the drywall comes off, you see what the last guy did. I show you what I find, tell you what it costs to fix, and you decide before I keep going.`,
  galleryHeading: `${P} Recent remodels`,
  faqHeading: `${P} Remodeling questions`,
  faqs: [
    {
      question: `${P} Do you pull the permits?`,
      answer: `${P} Yes. If the job needs a permit, I pull it and schedule the inspections.`,
    },
    {
      question: `${P} Can we live in the house during the remodel?`,
      answer: `${P} Most people do. I set up dust walls and clean up at the end of each day.`,
    },
  ],
};

export const additionsCopy = {
  title: `${P} Home Additions in ${where} ${suffix}`,
  description: `${P} Room additions, bump-outs and main-floor suites around Sioux Falls. Planned, permitted and built by ${business.owner}.`,
  h1: `${P} Home additions in ${where}`,
  intro: `${P} More room without moving out of the neighborhood. I take an addition from a sketch on paper to keys in your hand.`,
  ctaLabel: 'Get a free addition estimate',
  photoAlt: `${P} Placeholder for a finished addition photo`,
  whyHeading: `${P} Add on or move?`,
  whyBody: `${P} If you like your lot, your neighbors and your school, adding on usually costs less than selling, buying and moving. I will tell you straight if it does not pencil out.`,
  stepsHeading: 'From sketch to keys',
  steps: [
    { title: `${P} Walk the lot`, body: `${P} We look at setbacks, the roofline and where the new room ties in.` },
    { title: `${P} Drawings and price`, body: `${P} You get plans and a written price before anything is signed.` },
    { title: `${P} Permits`, body: `${P} I handle the city or county permit and the inspections.` },
    { title: `${P} Build`, body: `${P} Foundation, framing, roof, mechanicals and finish, in that order.` },
    { title: `${P} Keys`, body: `${P} Final inspection, a walk-through together and a punch list I finish.` },
  ],
  galleryHeading: `${P} Additions I've built`,
  faqHeading: `${P} Addition questions`,
  faqs: [
    {
      question: `${P} How long does an addition take?`,
      answer: `${P} Most take a few months from permit to keys. I give you a schedule with the bid.`,
    },
    {
      question: `${P} Do I need an architect?`,
      answer: `${P} Not always. For many additions I can work with a drafter. I will tell you when an architect is needed.`,
    },
  ],
};

export const decksCopy = {
  title: `${P} Deck Builder in ${where} ${suffix}`,
  description: `${P} New decks, deck replacement, stairs and railings around Sioux Falls. Wood or composite, built solid by ${business.owner}.`,
  h1: `${P} Decks in ${where}`,
  intro: `${P} New builds, replacements and stairs that do not wobble. Footings below frost and framing that will outlast the boards on top.`,
  ctaLabel: 'Get a free deck estimate',
  photoAlt: `${P} Placeholder for a finished deck photo`,
  galleryHeading: `${P} Decks I've built`,
  tableHeading: `${P} Wood or composite?`,
  tableCaption: `${P} Pressure-treated wood compared with composite decking`,
  tableRows: [
    { label: 'Up-front cost', wood: `${P} Lower`, composite: `${P} Higher` },
    { label: 'Upkeep', wood: `${P} Stain or seal every 2 to 3 years`, composite: `${P} Wash once or twice a year` },
    { label: 'Life of the boards', wood: `${P} 10 to 15 years with care`, composite: `${P} 25 years or more` },
    { label: 'Summer sun', wood: `${P} Stays cooler`, composite: `${P} Gets hot, lighter colors help` },
    { label: 'Splinters', wood: `${P} Can splinter as it ages`, composite: `${P} No` },
  ],
  includedHeading: `${P} Every deck I build gets`,
  included: [
    `${P} Footings dug below frost depth`,
    `${P} Flashing where the ledger meets the house`,
    `${P} Stairs and railings built to code`,
    `${P} Hidden fasteners on composite`,
  ],
  faqHeading: `${P} Deck questions`,
  faqs: [
    {
      question: `${P} Can you build on my old deck frame?`,
      answer: `${P} Sometimes. I check the footings, ledger and joists first and tell you what is safe to reuse.`,
    },
    {
      question: `${P} Do I need a permit for a deck?`,
      answer: `${P} Usually, yes. I pull it and schedule the footing and final inspections.`,
    },
  ],
};

export const sidingCopy = {
  title: `${P} Siding and Exterior Trim in ${where} ${suffix}`,
  description: `${P} Siding, soffit, fascia and exterior trim around Sioux Falls. Straight lines and tight corners from ${business.owner}.`,
  h1: `${P} Siding and trim in ${where}`,
  intro: `${P} Siding, soffit, fascia and the trim that finishes it. The corners and window wraps are what people notice, so that is where I slow down.`,
  ctaLabel: 'Get a free siding estimate',
  photoAlt: `${P} Placeholder for a straight-on photo of a sided house`,
  detailsHeading: `${P} The details`,
  details: [
    { alt: `${P} Placeholder for an outside corner close-up`, label: `${P} Outside corners` },
    { alt: `${P} Placeholder for a window trim close-up`, label: `${P} Window wraps` },
    { alt: `${P} Placeholder for a soffit and fascia close-up`, label: `${P} Soffit and fascia` },
  ],
  includedHeading: `${P} What a siding job includes`,
  included: [
    `${P} Tear-off and haul-away of the old siding`,
    `${P} New house wrap and flashing at every window and door`,
    `${P} Siding, soffit, fascia and trim`,
    `${P} Magnet sweep of the yard when we're done`,
  ],
  galleryHeading: `${P} Siding jobs`,
  faqHeading: `${P} Siding questions`,
  faqs: [
    {
      question: `${P} Vinyl, LP or fiber cement?`,
      answer: `${P} It depends on budget and look. I bring samples and go over the trade-offs at the estimate.`,
    },
    {
      question: `${P} Can you just replace the trim?`,
      answer: `${P} Yes. Rotted or tired trim can be replaced without residing the whole house.`,
    },
  ],
};

export const newConstructionCopy = {
  title: `${P} New Construction in ${where} ${suffix}`,
  description: `${P} Homes, garages and shops built from the slab up around Sioux Falls by ${business.owner}.`,
  h1: `${P} New construction in ${where}`,
  intro: `${P} Homes, garages and shops from the slab up. Smaller in number, bigger in attention.`,
  ctaLabel: 'Talk to me about a new build',
  photoAlt: `${P} Placeholder for a new build photo`,
  howHeading: 'How I work with you',
  how: [
    { title: `${P} You talk to me`, body: `${P} Not a salesman, not an office. Me, from the first meeting to the walk-through.` },
    { title: `${P} A written price`, body: `${P} Allowances are spelled out so there are no surprises at the end.` },
    { title: `${P} Updates you can see`, body: `${P} Photos and a short note each week while we build.` },
  ],
  galleryHeading: `${P} New builds`,
};
