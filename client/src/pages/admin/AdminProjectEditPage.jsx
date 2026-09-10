import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PROJECT_CATEGORY_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

const empty = {
  title: '',
  category: 'Web',
  client: '',
  description: '',
  challenge: '',
  solution: '',
  results: '',
  technologies: '',
  externalUrl: '',
  published: false,
  featured: false,
};

export default function AdminProjectEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api.getAdminProject(id)
      .then((res) => {
        const p = res.data;
        setForm({
          ...p,
          technologies: (p.technologies || []).join(', '),
          externalUrl: p.externalUrl || '',
        });
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      technologies: String(form.technologies || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      externalUrl: form.externalUrl || undefined,
    };
    try {
      if (isNew) {
        const res = await api.createAdminProject(payload);
        push('Project created.', 'success');
        navigate(`/admin/projects/${res.data._id}/edit`);
      } else {
        await api.updateAdminProject(id, payload);
        push('Project saved.', 'success');
      }
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <Link to="/admin/projects">← Projects</Link>
      <h1>{isNew ? 'New project' : 'Edit project'}</h1>
      <form className={styles.stack} onSubmit={onSubmit}>
        <Input label="Title" name="title" value={form.title} onChange={onChange} required />
        <Select label="Category" name="category" value={form.category} onChange={onChange}>
          {PROJECT_CATEGORY_VALUES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input label="Client" name="client" value={form.client || ''} onChange={onChange} />
        <Textarea label="Description" name="description" value={form.description} onChange={onChange} required />
        <Textarea label="Challenge" name="challenge" value={form.challenge || ''} onChange={onChange} />
        <Textarea label="Solution" name="solution" value={form.solution || ''} onChange={onChange} />
        <Textarea label="Results" name="results" value={form.results || ''} onChange={onChange} />
        <Input label="Technologies (comma-separated)" name="technologies" value={form.technologies} onChange={onChange} />
        <Input label="External URL" name="externalUrl" value={form.externalUrl} onChange={onChange} />
        <label><input type="checkbox" name="published" checked={!!form.published} onChange={onChange} /> Published</label>
        <label><input type="checkbox" name="featured" checked={!!form.featured} onChange={onChange} /> Featured</label>
        <div className={styles.actions}>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</Button>
        </div>
      </form>
    </div>
  );
}
