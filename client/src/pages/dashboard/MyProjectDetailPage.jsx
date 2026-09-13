import { useEffect, useId, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WORK_PROJECT_STATUS_LABELS, PA_DOMAIN_LABELS } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import PageMeta from '../../components/common/PageMeta';
import { useToast } from '../../components/ui/Toast';

const TABS = ['Overview', 'Milestones', 'Tasks', 'Documents', 'Messages', 'Activity'];

export default function MyProjectDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const tabListId = useId();
  const tabRefs = useRef([]);
  const [tab, setTab] = useState('Overview');
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  function load() {
    setLoading(true);
    api.getMyWorkProject(id)
      .then((res) => setBundle(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function sendMessage(e) {
    e.preventDefault();
    setSending(true);
    try {
      await api.postMyProjectMessage(id, message);
      setMessage('');
      push('Message sent.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setSending(false);
    }
  }

  function onTabKeyDown(e, index) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    setTab(TABS[next]);
    tabRefs.current[next]?.focus();
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!bundle) return null;

  const { project, milestones, tasks, documents, messages, activity } = bundle;
  const panelId = `${tabListId}-panel`;

  return (
    <div>
      <PageMeta title={project.title} path={`/dashboard/projects/${id}`} />
      <Link className="text-sm font-semibold text-accent" to="/dashboard/projects">← Back</Link>
      <div className="mt-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft">
        <h1 className="!text-3xl">{project.title}</h1>
        <p className="text-sm text-muted">
          {PA_DOMAIN_LABELS[project.domain] || project.domain} · {WORK_PROJECT_STATUS_LABELS[project.status]}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line-soft">
          <div className="h-full rounded-full bg-accent-cyan" style={{ width: `${project.progress || 0}%` }} />
        </div>
        <p className="mt-2 text-sm font-semibold">{project.progress || 0}% complete</p>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Project sections"
        id={tabListId}
      >
        {TABS.map((t, index) => {
          const selected = tab === t;
          const tabId = `${tabListId}-tab-${t}`;
          return (
            <button
              key={t}
              ref={(el) => { tabRefs.current[index] = el; }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selected ? 'bg-accent text-white' : 'bg-line-soft'}`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div
        className="mt-6 rounded-2xl border border-line-soft bg-white p-6 shadow-soft"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${tabListId}-tab-${tab}`}
      >
        {tab === 'Overview' && (
          <div>
            <h2 className="!font-sans !text-xl">Overview</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm">{project.summary}</p>
            <p className="mt-4 text-sm text-muted">
              Assignees: {(project.assignees || []).map((a) => a.name).join(', ') || 'Pending assignment'}
            </p>
            <p className="mt-3 text-sm text-muted">
              Shared project files live on the Documents tab. Deliverables for approval may also appear under Deliverables in the sidebar when available.
            </p>
          </div>
        )}
        {tab === 'Milestones' && (
          <ol className="grid gap-3">
            {milestones.map((m) => (
              <li key={m._id} className="rounded-xl border border-line-soft p-4">
                <div className="flex justify-between gap-2">
                  <strong>{m.title}</strong>
                  <span className="text-xs font-semibold text-accent">{m.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{m.description}</p>
              </li>
            ))}
          </ol>
        )}
        {tab === 'Tasks' && (
          <ul className="grid gap-3">
            {tasks.length === 0 && <p className="text-sm text-muted">No client-visible tasks yet.</p>}
            {tasks.map((t) => (
              <li key={t._id} className="rounded-xl border border-line-soft p-4">
                <strong>{t.title}</strong>
                <span className="ml-2 text-xs text-muted">{t.status} · {t.priority}</span>
                <p className="mt-1 text-sm">{t.description}</p>
              </li>
            ))}
          </ul>
        )}
        {tab === 'Documents' && (
          <ul className="grid gap-2">
            {documents.length === 0 && (
              <p className="text-sm text-muted">
                No documents shared yet. This tab is the authoritative place for project files once Vignak starts delivery.
              </p>
            )}
            {documents.map((d) => (
              <li key={d._id}>
                <a className="font-semibold text-accent" href={api.downloadMyDocumentUrl(d._id)} target="_blank" rel="noreferrer">
                  {d.title}
                </a>
                <span className="text-xs text-muted"> · {d.category}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'Messages' && (
          <div>
            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {messages.map((m) => (
                <div key={m._id} className="rounded-lg bg-line-soft/60 p-3 text-sm">
                  <p className="font-semibold">{m.sender?.name || 'User'}</p>
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="grid gap-3">
              <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
              <Button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</Button>
            </form>
          </div>
        )}
        {tab === 'Activity' && (
          <ul className="grid gap-2">
            {activity.map((a) => (
              <li key={a._id} className="text-sm">
                <span className="font-semibold">{a.message}</span>
                <span className="text-muted"> · {new Date(a.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
