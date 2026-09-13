import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SERVICE_SLUGS } from '@vignak/shared';
import * as api from '../../services/api';
import PageMeta from '../../components/common/PageMeta';
import ServiceRequestForm from '../../components/forms/ServiceRequestForm';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export default function NewRequestPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const serviceSlug = params.get('service') || SERVICE_SLUGS.PROJECT_ASSISTANCE;
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getCatalogService(serviceSlug)
      .then((res) => setSvc(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [serviceSlug]);

  const fields = svc?.workflowConfig?.requestFields || [];
  const initialValues = useMemo(
    () => ({
      course: user?.course || '',
      year: user?.year || '',
      phone: user?.phone || '',
      organization: user?.institution || '',
    }),
    [user],
  );

  async function onSubmit(body) {
    setSubmitting(true);
    try {
      const res = await api.createMyServiceRequest({
        ...body,
        serviceSlug,
        customerType: user?.customerType,
      });
      const id = res.data?._id || res.data?.id;
      push('Request submitted. We will review it shortly.', 'success');
      navigate(id ? `/dashboard/requests/${id}` : '/dashboard/requests');
    } catch (err) {
      push(err.message || 'Unable to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} />;

  return (
    <div>
      <PageMeta title="New request" path="/dashboard/requests/new" />
      <p className="eyebrow">Tracked service request</p>
      <h1 className="!text-3xl">{svc?.title || 'Service request'}</h1>
      <p className="lead mb-2">{svc?.summary || 'Share your requirements.'}</p>
      <div className="mb-6 max-w-2xl rounded-xl border border-accent/20 bg-accent-soft/60 p-4 text-sm text-ink">
        <p className="m-0 font-semibold">You are submitting a service request — not starting the project yet.</p>
        <p className="mt-2 mb-0 text-slate-vignak">
          Vignak reviews your request first. After it is accepted, your project workspace appears under Projects
          with milestones, documents, and messages.
        </p>
      </div>
      <ServiceRequestForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitting={submitting}
        submitLabel={svc?.ctaLabel || 'Submit request'}
      />
    </div>
  );
}
