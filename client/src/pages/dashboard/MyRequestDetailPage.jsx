import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SERVICE_REQUEST_STATUS_LABELS, PA_DOMAIN_LABELS } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';

export default function MyRequestDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyServiceRequest(id)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.message || 'Request not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} />;
  if (!item) return null;

  const statusLabel = SERVICE_REQUEST_STATUS_LABELS[item.status] || item.status;
  const hasProject = Boolean(item.workProject);
  const shortId = String(item._id || id).slice(-8).toUpperCase();

  return (
    <div>
      <PageMeta title={item.title} path={`/dashboard/requests/${id}`} />
      <Link className="text-sm font-semibold text-accent" to="/dashboard/requests">← Back to requests</Link>

      {!hasProject && (
        <div className="mt-4 rounded-2xl border border-accent/25 bg-accent-soft/70 p-5">
          <p className="m-0 text-sm font-semibold text-accent-hover">Request received</p>
          <p className="mt-1 text-xs text-muted">Reference: VGN-{shortId}</p>
          <p className="mt-3 mb-1 text-sm font-semibold">What happens next?</p>
          <ol className="m-0 list-decimal space-y-1 pl-5 text-sm text-slate-vignak">
            <li>Vignak reviews your request.</li>
            <li>Our team may contact you if clarification is needed.</li>
            <li>Once accepted, your project workspace appears under Projects.</li>
          </ol>
          <p className="mt-3 mb-0 text-sm">
            Current status: <strong>{statusLabel}</strong>
            {' — '}
            your project has not started yet.
          </p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="!m-0 !text-3xl">{item.title}</h1>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-hover">
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-muted">
          {item.serviceSlug || 'project-assistance'}
          {item.domain ? ` · ${PA_DOMAIN_LABELS[item.domain] || item.domain}` : ''}
        </p>
        <p className="mt-4 whitespace-pre-wrap">{item.description}</p>
        {item.requirements && (
          <>
            <h2 className="mt-6 !font-sans !text-lg">Additional requirements</h2>
            <p className="whitespace-pre-wrap text-sm">{item.requirements}</p>
          </>
        )}
        {item.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-line px-3 py-1 text-xs font-medium">{tech}</span>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {hasProject && (
            <Button as={Link} to={`/dashboard/projects/${item.workProject}`}>Open project</Button>
          )}
          {!hasProject && (
            <Button as={Link} to="/dashboard" variant="secondary">Back to overview</Button>
          )}
          <Button as={Link} to="/dashboard/support" variant="secondary">Get help</Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          Documents and messages appear on your project after Vignak accepts this request.
        </p>
      </div>
    </div>
  );
}
