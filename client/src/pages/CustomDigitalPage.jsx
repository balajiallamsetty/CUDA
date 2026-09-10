import ServiceDetail from '../components/common/ServiceDetail';

export default function CustomDigitalPage() {
  return (
    <ServiceDetail
      eyebrow="Custom Digital Solutions"
      title="Digital systems shaped around how you actually work."
      problem="Off-the-shelf tools often force teams into awkward workflows, while custom builds can become bloated if they lack focus."
      solution="We build focused digital solutions — enquiry systems, operational interfaces and tailored web applications — that solve a defined problem well."
      services={[
        'Custom web applications',
        'Internal tools and portals',
        'Lead and enquiry workflows',
        'Integrations with your existing stack',
        'Digital experience layers for events and campuses',
      ]}
      audience={['Growing businesses', 'Institutions', 'Event organizers', 'Startup teams']}
      benefits={[
        'Software aligned to real processes',
        'Secure foundations with role-aware access paths',
        'Clear ownership of data and workflows',
        'Room to expand into future Vignak ecosystem products',
      ]}
      process={[
        'Map the problem and success criteria',
        'Prototype the critical journeys',
        'Implement with modular, maintainable services',
        'Validate, document and support launch',
      ]}
      ctaTo="/start-project"
      ctaLabel="Discuss a custom solution"
    />
  );
}
