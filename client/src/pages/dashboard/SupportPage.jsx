import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PageMeta from '../../components/common/PageMeta';

export default function SupportPage() {
  return (
    <div>
      <PageMeta title="Support" path="/dashboard/support" />
      <p className="eyebrow">Help</p>
      <h1 className="!text-3xl">Support</h1>
      <p className="lead mb-6">
        Prefer project-specific help? Open your project and use Messages. For general questions, use Contact.
      </p>
      <p className="mb-6 max-w-2xl text-sm text-slate-vignak">
        Documents appear on your project after it starts — open a project and use the Documents tab. Shared files for approval may also appear under Deliverables.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/dashboard/projects">My projects</Button>
        <Button as={Link} to="/dashboard/requests" variant="secondary">My requests</Button>
        <Button as={Link} to="/contact" variant="ghost">Contact form</Button>
      </div>
    </div>
  );
}
