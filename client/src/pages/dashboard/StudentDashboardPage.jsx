import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import PageMeta from '../../components/common/PageMeta';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageMeta title="Dashboard" description="Your Vignak project assistance dashboard." path="/dashboard" />
      <p className="eyebrow">Welcome</p>
      <h1 className="!text-3xl">Hi {user?.name?.split(' ')[0] || 'there'}</h1>
      <p className="lead mb-8">Track project assistance requests and keep your profile up to date.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
          <h2 className="!font-sans !text-xl !font-semibold">Start a new request</h2>
          <p className="mb-4 text-sm">Share your project idea, category, and timeline.</p>
          <Button as={Link} to="/dashboard/requests/new">New project request</Button>
        </div>
        <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
          <h2 className="!font-sans !text-xl !font-semibold">Your requests</h2>
          <p className="mb-4 text-sm">See status updates for submitted requirements.</p>
          <Button as={Link} to="/dashboard/requests" variant="secondary">View my requests</Button>
        </div>
        <div className="rounded-2xl border border-line-soft bg-white p-6 shadow-soft sm:col-span-2">
          <h2 className="!font-sans !text-xl !font-semibold">Profile</h2>
          <p className="mb-1 text-sm text-muted">{user?.email}</p>
          <p className="mb-4 text-sm">{[user?.course, user?.year, user?.institution].filter(Boolean).join(' · ') || 'Add your college details for faster assistance.'}</p>
          <Button as={Link} to="/dashboard/profile" variant="outline">Update profile</Button>
        </div>
      </div>
    </div>
  );
}
