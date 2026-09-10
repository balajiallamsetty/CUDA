import ServiceDetail from '../components/common/ServiceDetail';

export default function GiftsPage() {
  return (
    <ServiceDetail
      eyebrow="Customized Gifts"
      title="Branded materials people keep and remember."
      problem="Generic merchandise feels disposable and often clashes with your brand or event narrative."
      solution="We produce customized gifts and campus materials that align with your identity — useful, well-finished and coherent across formats."
      services={[
        'Customized gifts',
        'Notebooks',
        'Certificates',
        'Badges',
        'ID cards',
        'Merchandise',
        'College event materials',
      ]}
      audience={['Colleges', 'Event organizers', 'Businesses', 'Student bodies']}
      benefits={[
        'Consistent branding across touchpoints',
        'Better guest and participant experience',
        'Reliable production coordination',
        'Materials that support your story, not distract from it',
      ]}
      process={[
        'Align on brand, quantities and use cases',
        'Design proofs and material options',
        'Produce with quality checks',
        'Deliver on schedule for your event or campaign',
      ]}
      ctaTo="/start-project"
      ctaLabel="Request customized gifts"
    />
  );
}
