import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';
import { STUDENT_STATUS_LABELS } from '../../data/projectAssistance';

export default function MyRequestDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMyLead(id)
      .then((res) => setItem(res.data))
      .catch((err) => setError(err.message || 'Request not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} />;
  if (!item) return null;

  return (
    <div>
      <PageMeta title={item.projectTitle || 'Request'} path={`/dashboard/requests/${id}`} />
      <Link className="text-sm font-semibold text-accent" to="/dashboard/requests">← Back</Link>
      <div className="mt-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="!m-0 !text-3xl">{item.projectTitle || item.service}</h1>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-hover">
            {STUDENT_STATUS_LABELS[item.status] || item.status}
          </span>
        </div>
        <p className="text-sm text-muted">{item.projectCategory || 'General'} · {item.service}</p>
        <p className="mt-4 whitespace-pre-wrap">{item.description}</p>
        {item.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-line px-3 py-1 text-xs font-medium">{tech}</span>
            ))}
          </div>
        )}
        <div className="mt-6">
          <Button as={Link} to="/contact" variant="secondary">Contact support</Button>
        </div>
      </div>
    </div>
  );
}
