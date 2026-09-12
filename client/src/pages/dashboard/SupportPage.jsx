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
        Prefer project-specific help? Open your work project and use Messages. For general questions, use Contact.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/dashboard/projects">My projects</Button>
        <Button as={Link} to="/contact" variant="secondary">Contact form</Button>
      </div>
    </div>
  );
}
