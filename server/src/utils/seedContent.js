import { connectDatabase } from '../config/db.js';
import { Project } from '../models/Project.js';
import { Speaker } from '../models/Speaker.js';
import { Talk } from '../models/Talk.js';
import { ServiceOffering } from '../models/ServiceOffering.js';

const projects = [
  {
    title: 'Northline College Website',
    slug: 'northline-college-site',
    category: 'Web',
    client: 'Northline College',
    description: 'A modern institutional website that clarified admissions journeys and program discovery.',
    challenge: 'The previous site buried critical information and felt outdated for prospective students and parents.',
    solution: 'We redesigned information architecture, built responsive program pages, and streamlined enquiry flows.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    results: 'Clearer navigation, faster content updates, and a stronger first impression for campus visitors.',
    published: true,
    featured: true,
  },
  {
    title: 'Summit Tech Conference Kits',
    slug: 'summit-conference-kits',
    category: 'Conference Kits',
    client: 'Summit Collective',
    description: 'Cohesive conference kits spanning badges, notebooks, certificates and welcome materials.',
    challenge: 'Vendors delivered inconsistent quality and branding across event materials.',
    solution: 'A single production system with brand-aligned templates, quality checks and staged delivery.',
    technologies: ['Print production', 'Brand systems'],
    results: 'Unified on-site experience and reliable turnaround for a multi-day conference.',
    published: true,
    featured: true,
  },
  {
    title: 'Orbit Startup Digital Presence',
    slug: 'orbit-startup-presence',
    category: 'Digital Solutions',
    client: 'Orbit Labs',
    description: 'Landing experience and product narrative for an early-stage B2B startup.',
    challenge: 'The team needed credibility quickly without overbuilding product marketing.',
    solution: 'A focused landing system with clear value props, demos and lead capture.',
    technologies: ['React', 'Express'],
    results: 'Investor-ready narrative and a steady inbound enquiry channel.',
    published: true,
    featured: true,
  },
];

async function seedContent() {
  await connectDatabase();

  for (const project of projects) {
    await Project.updateOne({ slug: project.slug }, { $set: project }, { upsert: true });
  }

  let speaker = await Speaker.findOne({ name: 'Aanya Mehta' });
  if (!speaker) {
    speaker = await Speaker.create({
      name: 'Aanya Mehta',
      bio: 'Product strategist focused on education and civic technology.',
      designation: 'Product Strategist',
      title: 'Product Strategist',
      organization: 'Independent',
    });
  }

  await Talk.updateOne(
    { slug: 'building-with-purpose' },
    {
      $set: {
        title: 'Building with Purpose: Technology that Serves People',
        slug: 'building-with-purpose',
        description:
          'A conversation on designing digital products that respect users, institutions and long-term trust.',
        speaker: speaker._id,
        date: new Date('2026-10-18T10:00:00+05:30'),
        location: 'Hybrid — Bengaluru & Online',
        status: 'REGISTRATION_OPEN',
        registrationOpen: true,
        published: true,
        archived: false,
      },
    },
    { upsert: true },
  );

  await Talk.updateOne(
    { slug: 'from-campus-to-company' },
    {
      $set: {
        title: 'From Campus to Company: Bridging Learning and Work',
        slug: 'from-campus-to-company',
        description:
          'How colleges, startups and professionals can create better pathways for students entering technology careers.',
        date: new Date('2026-11-08T16:00:00+05:30'),
        location: 'Chennai',
        status: 'UPCOMING',
        registrationOpen: false,
        published: true,
        archived: false,
      },
    },
    { upsert: true },
  );

  const services = [
    {
      slug: 'web-digital',
      title: 'Web & Digital Solutions',
      summary: 'Business, college, startup and portfolio sites — plus applications that support real workflows.',
      order: 1,
      published: true,
    },
    {
      slug: 'customized-gifts-kits',
      title: 'Gifts & Conference Kits',
      summary: 'Notebooks, certificates, badges, ID cards, merchandise and complete conference kits.',
      order: 2,
      published: true,
    },
    {
      slug: 'vignak-talks',
      title: 'Vignak Talks',
      summary: 'Curated conversations with practitioners on technology, learning and building with purpose.',
      order: 3,
      published: true,
    },
  ];

  for (const service of services) {
    await ServiceOffering.updateOne({ slug: service.slug }, { $set: service }, { upsert: true });
  }

  console.log('Seeded Phase 2 content (projects, talks, services).');
  process.exit(0);
}

seedContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
