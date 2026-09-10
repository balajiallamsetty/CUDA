import ServiceDetail from '../components/common/ServiceDetail';

export default function WebServicesPage() {
  return (
    <ServiceDetail
      eyebrow="Web Services"
      title="Websites and applications that represent you accurately."
      problem="Many organizations outgrow outdated sites, unclear messaging, or fragile tools that cannot support enquiries and operations."
      solution="Vignak designs and builds modern web experiences — from marketing sites to applications — with clear information architecture and maintainable engineering."
      services={[
        'Business websites',
        'College websites',
        'Startup websites',
        'Portfolio websites',
        'Landing pages',
        'Web applications',
        'Digital solutions',
      ]}
      audience={['Businesses', 'Colleges', 'Startups', 'Professionals', 'Institutions']}
      benefits={[
        'A credible first impression for visitors and partners',
        'Faster publishing and clearer content structure',
        'Enquiry and lead capture wired into your operations',
        'A stack ready for future product expansion',
      ]}
      process={[
        'Discover goals, audience and constraints',
        'Shape structure, content and visual direction',
        'Build, review and harden the experience',
        'Launch, hand over and plan iteration',
      ]}
      ctaTo="/start-project"
      ctaLabel="Start a web project"
    />
  );
}
