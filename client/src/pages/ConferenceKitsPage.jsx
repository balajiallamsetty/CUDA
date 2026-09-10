import ServiceDetail from '../components/common/ServiceDetail';
import PageMeta from '../components/common/PageMeta';

export default function ConferenceKitsPage() {
  return (
    <>
      <PageMeta
        title="Conference Kits"
        description="Cohesive conference kits for institutions and organizers — badges, notebooks, certificates and more."
        path="/customized/conference-kits" />
    <ServiceDetail
      eyebrow="Conference Kits"
      title="Conference kits that feel like one experience."
      problem="Conference materials often arrive from multiple vendors with inconsistent quality, timing and design."
      solution="Vignak coordinates conference kits as a unified system — badges, notebooks, certificates, inserts and welcome materials with shared craft standards."
      services={[
        'Complete conference kits',
        'Badge and ID systems',
        'Delegate notebooks and inserts',
        'Certificates and recognition materials',
        'On-brand packaging and staging support',
      ]}
      audience={['Conference organizers', 'Institutions', 'Corporate event teams', 'Professional associations']}
      benefits={[
        'One accountable partner for kit quality',
        'Cohesive guest first impression',
        'Fewer last-minute production surprises',
        'Design language that matches your event story',
      ]}
      process={[
        'Define kit contents and guest journeys',
        'Create brand-aligned templates',
        'Produce, assemble and quality-check',
        'Deliver to venue or logistics partner',
      ]}
      ctaTo="/start-project"
      ctaLabel="Plan a conference kit"
    />
    </>
  );
}
