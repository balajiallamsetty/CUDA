import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MILESTONE_STATUS_VALUES, TASK_STATUS_VALUES, TASK_PRIORITY_VALUES, TASK_VISIBILITY_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminWorkProjectDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [file, setFile] = useState(null);

  function load() {
    setLoading(true);
    api.getAdminWorkProject(id)
      .then((res) => setBundle(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function updateMilestone(milestone, status) {
    try {
      await api.upsertAdminMilestone(id, { id: milestone._id, status });
      push('Milestone updated.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function addTask() {
    try {
      await api.upsertAdminTask(id, {
        title: taskTitle,
        status: 'PENDING',
        priority: 'MEDIUM',
        visibility: 'CLIENT',
      });
      setTaskTitle('');
      push('Task created.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function sendMessage() {
    try {
      await api.postAdminProjectMessage(id, message);
      setMessage('');
      push('Message sent.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function upload() {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name);
      await api.uploadAdminProjectDocument(id, fd);
      setFile(null);
      push('Document uploaded.', 'success');
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!bundle) return null;

  const { project, milestones, tasks, documents, messages } = bundle;

  return (
    <div className={styles.stack}>
      <Link to="/admin/work-projects">← Back</Link>
      <header className={styles.header}>
        <div>
          <h1>{project.title}</h1>
          <p className={styles.sub}>{project.client?.name} · {project.progress}% · {project.status}</p>
        </div>
      </header>

      <section className={styles.panel}>
        <h2>Milestones</h2>
        <ul>
          {milestones.map((m) => (
            <li key={m._id} className={styles.actions}>
              <span><strong>{m.title}</strong> · {m.status}</span>
              <Select
                label="Status"
                value={m.status}
                onChange={(e) => updateMilestone(m, e.target.value)}
              >
                {MILESTONE_STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel}>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((t) => (
            <li key={t._id}>{t.title} · {t.status} · {t.visibility}</li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Input label="New task" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <Button onClick={addTask} disabled={!taskTitle.trim()}>Add task</Button>
        </div>
        <p className={styles.sub}>Priorities: {TASK_PRIORITY_VALUES.join(', ')} · Visibility: {TASK_VISIBILITY_VALUES.join(', ')} · Status: {TASK_STATUS_VALUES.join(', ')}</p>
      </section>

      <section className={styles.panel}>
        <h2>Documents</h2>
        <ul>
          {documents.map((d) => <li key={d._id}>{d.title} ({d.mimeType})</li>)}
        </ul>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button onClick={upload} disabled={!file}>Upload</Button>
      </section>

      <section className={styles.panel}>
        <h2>Messages</h2>
        <ul>
          {messages.map((m) => (
            <li key={m._id}><strong>{m.sender?.name}:</strong> {m.body}</li>
          ))}
        </ul>
        <Textarea label="Reply" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={sendMessage} disabled={!message.trim()}>Send</Button>
      </section>
    </div>
  );
}
