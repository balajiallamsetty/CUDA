import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import Button from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminServiceDefinitionsPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);

  function load() {
    setLoading(true);
    api.getAdminServiceDefinitions()
      .then((res) => {
        setItems(res.data || []);
        if (!selected && res.data?.[0]) select(res.data[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function select(item) {
    setSelected(item);
    setForm({
      title: item.title || '',
      summary: item.summary || '',
      category: item.category || '',
      ctaLabel: item.ctaLabel || '',
      order: item.order ?? 0,
      active: Boolean(item.active),
      public: Boolean(item.public),
      requiresQuotation: Boolean(item.workflowConfig?.requiresQuotation),
      milestonesText: (item.workflowConfig?.milestones || [])
        .map((m) => `${m.title}|${m.weight}|${m.stage || ''}`)
        .join('\n'),
      fieldsText: (item.workflowConfig?.requestFields || [])
        .map((f) => `${f.key}|${f.label}|${f.type}|${f.required ? '1' : '0'}`)
        .join('\n'),
    });
  }

  async function save() {
    if (!selected || !form) return;
    const milestones = form.milestonesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [title, weight, stage] = line.split('|');
        return {
          title: title?.trim() || `Milestone ${i + 1}`,
          order: i + 1,
          weight: Number(weight) || 10,
          stage: stage?.trim() || undefined,
        };
      });
    const requestFields = form.fieldsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, label, type, required] = line.split('|');
        return {
          key: key?.trim(),
          label: label?.trim() || key,
          type: type?.trim() || 'text',
          required: required === '1',
        };
      })
      .filter((f) => f.key);

    try {
      const res = await api.updateAdminServiceDefinition(selected.slug, {
        title: form.title,
        summary: form.summary,
        category: form.category,
        ctaLabel: form.ctaLabel,
        order: Number(form.order) || 0,
        active: form.active,
        public: form.public,
        workflowConfig: {
          ...(selected.workflowConfig || {}),
          requiresQuotation: form.requiresQuotation,
          milestones,
          requestFields,
        },
      });
      push('Service updated.', 'success');
      setSelected(res.data);
      load();
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} onRetry={load} />;

  return (
    <div className={styles.stack}>
      <header className={styles.header}>
        <div>
          <h1>Service definitions</h1>
          <p className={styles.sub}>Activate services and edit workflow fields / milestones.</p>
        </div>
      </header>
      <div className={styles.twoCol || undefined} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(220px, 280px) 1fr' }}>
        <aside className={styles.panel}>
          <ul className={styles.list || undefined} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => select(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.4rem',
                    border: 'none',
                    background: selected?.slug === item.slug ? '#eef2ff' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <strong>{item.title}</strong>
                  <div className={styles.sub}>{item.active ? 'Active' : 'Inactive'} · {item.slug}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {form && (
          <section className={styles.panel}>
            <div className={styles.actions}>
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea label="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Input label="CTA label" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
              <Input label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              <Select label="Active" value={form.active ? '1' : '0'} onChange={(e) => setForm({ ...form, active: e.target.value === '1' })}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
              <Select label="Public" value={form.public ? '1' : '0'} onChange={(e) => setForm({ ...form, public: e.target.value === '1' })}>
                <option value="1">Public</option>
                <option value="0">Hidden</option>
              </Select>
              <Select
                label="Requires quotation"
                value={form.requiresQuotation ? '1' : '0'}
                onChange={(e) => setForm({ ...form, requiresQuotation: e.target.value === '1' })}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
              <Textarea
                label="Milestones"
                value={form.milestonesText}
                onChange={(e) => setForm({ ...form, milestonesText: e.target.value })}
                hint="One milestone per line. Format: title|weight|stage — example: Kickoff|10|intake"
              />
              <p className="text-sm text-muted" style={{ marginTop: '-0.5rem' }}>
                Example lines:<br />
                Scope lock|15|planning<br />
                Core build|40|build<br />
                Demo prep|20|delivery
              </p>
              <Textarea
                label="Request fields"
                value={form.fieldsText}
                onChange={(e) => setForm({ ...form, fieldsText: e.target.value })}
                hint="One field per line. Format: key|label|type|required(0/1) — example: title|Project title|text|1"
              />
              <p className="text-sm text-muted" style={{ marginTop: '-0.5rem' }}>
                Common types: text, textarea, pa_domain, tags, timeline, date. Required flag is 1 or 0.
              </p>
              <Button onClick={save}>Save service</Button>
              <Link to={`/services/${selected.slug}`}>View public page</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
