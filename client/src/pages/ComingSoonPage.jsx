import { Link, useSearchParams } from 'react-router-dom';
import { SERVICE_SLUGS } from '@vignak/shared';
import PageMeta from '../components/common/PageMeta';
import Button from '../components/ui/Button';

const SERVICE_TITLES = {
  [SERVICE_SLUGS.AI_SOLUTIONS]: 'AI Solutions',
  [SERVICE_SLUGS.AI_AUTOMATION]: 'AI Automation',
  [SERVICE_SLUGS.AI_CHATBOTS]: 'AI Chatbots',
  [SERVICE_SLUGS.AI_VOICE_AGENTS]: 'AI Voice / Calling Agents',
  [SERVICE_SLUGS.CRM_AUTOMATION]: 'CRM & Business Automation',
  [SERVICE_SLUGS.CAMPUS_SOLUTIONS]: 'Student / Campus Solutions',
  [SERVICE_SLUGS.EVENT_MANAGEMENT]: 'Event Management & Conferences',
  [SERVICE_SLUGS.TED_TALKS]: 'TED Talks / Speaking Events',
  [SERVICE_SLUGS.GIFTS_KITS]: 'Customized Gifts & Conference Kits',
  [SERVICE_SLUGS.JOY_BOX]: 'Joy Box',
  [SERVICE_SLUGS.BUSINESS_DIGITAL]: 'Business & Startup Digital Solutions',
};

export default function ComingSoonPage() {
  const [params] = useSearchParams();
  const serviceSlug = params.get('service') || '';
  const serviceTitle = SERVICE_TITLES[serviceSlug] || (serviceSlug ? serviceSlug.replace(/-/g, ' ') : '');

  return (
    <>
      <PageMeta
        title="Coming soon"
        description="This CUDA Solutions service is being prepared. Project Assistance and Web Development are available now."
        path="/services/coming-soon"
      />
      <section className="border-b border-line-soft bg-gradient-to-br from-accent-panel via-white to-cyan-50/40 py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <p className="eyebrow">Services</p>
          <h1 className="max-w-2xl">Coming soon</h1>
          <p className="lead mt-4 max-w-2xl">
            {serviceTitle
              ? `Our team is preparing ${serviceTitle}. We will open requests for this service when it is ready.`
              : 'Our team is preparing this service. We will open requests when it is ready.'}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-slate-vignak">
            Meanwhile, Project Assistance and Web Development &amp; Digital Solutions are available to start today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/services" size="lg">Browse services</Button>
            <Button as={Link} to="/services/project-assistance" variant="secondary" size="lg">
              Project Assistance
            </Button>
            <Button as={Link} to="/services/web-development" variant="ghost" size="lg">
              Web Development
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
