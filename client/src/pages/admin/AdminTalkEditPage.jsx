import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TALK_STATUS_VALUES } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Input, Textarea, Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

const empty = {
  title: '',
  description: '',
  location: '',
  status: 'UPCOMING',
  registrationOpen: false,
  published: false,
  date: '',
  videoUrl: '',
  coverImage: '',
  speaker: '',
};

export default function AdminTalkEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState(empty);
  const [speakers, setSpeakers] = useState([]);
  const [regs, setRegs] = useState([]);
  const [speakerForm, setSpeakerForm] = useState({ name: '', designation: '', bio: '' });
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    api.getAdminSpeakers().then((res) => setSpeakers(res.data || []));
    if (isNew) return;
    Promise.all([api.getAdminTalk(id), api.getTalkRegistrations(id)])
      .then(([talkRes, regRes]) => {
        const t = talkRes.data;
        setForm({
          ...empty,
          ...t,
          speaker: t.speaker?._id || t.speaker || '',
          date: t.date ? new Date(t.date).toISOString().slice(0, 16) : '',
          videoUrl: t.videoUrl || '',
          coverImage: t.coverImage || '',
        });
        setRegs(regRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function createSpeaker() {
    try {
      const res = await api.createAdminSpeaker(speakerForm);
      setSpeakers((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, speaker: res.data._id }));
      setSpeakerForm({ name: '', designation: '', bio: '' });
      push('Speaker created.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      speaker: form.speaker || undefined,
      date: form.date ? new Date(form.date).toISOString() : undefined,
      videoUrl: form.videoUrl || undefined,
      coverImage: form.coverImage || undefined,
    };
    try {
      if (isNew) {
        const res = await api.createAdminTalk(payload);
        push('Talk created.', 'success');
        navigate(`/admin/talks/${res.data._id}/edit`);
      } else {
        await api.updateAdminTalk(id, payload);
        push('Talk saved.', 'success');
      }
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;

  return (
    <div className={styles.stack}>
      <Link to="/admin/talks">← Talks</Link>
      <h1>{isNew ? 'New talk' : 'Edit talk'}</h1>
      <form className={styles.stack} onSubmit={onSubmit}>
        <Input label="Title" name="title" value={form.title} onChange={onChange} required />
        <Textarea label="Description" name="description" value={form.description} onChange={onChange} required />
        <Input label="Location" name="location" value={form.location || ''} onChange={onChange} />
        <Input label="Date" name="date" type="datetime-local" value={form.date} onChange={onChange} />
        <Select label="Status" name="status" value={form.status} onChange={onChange}>
          {TALK_STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Speaker" name="speaker" value={form.speaker || ''} onChange={onChange}>
          <option value="">None</option>
          {speakers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </Select>
        <Input label="Video URL" name="videoUrl" value={form.videoUrl} onChange={onChange} />
        <Input label="Cover image URL" name="coverImage" value={form.coverImage} onChange={onChange} />
        <label><input type="checkbox" name="registrationOpen" checked={!!form.registrationOpen} onChange={onChange} /> Registration open</label>
        <label><input type="checkbox" name="published" checked={!!form.published} onChange={onChange} /> Published</label>
        <Button type="submit">Save talk</Button>
      </form>

      <section className={styles.panel}>
        <h2>Quick-add speaker</h2>
        <Input label="Name" value={speakerForm.name} onChange={(e) => setSpeakerForm((p) => ({ ...p, name: e.target.value }))} />
        <Input label="Designation" value={speakerForm.designation} onChange={(e) => setSpeakerForm((p) => ({ ...p, designation: e.target.value }))} />
        <Textarea label="Bio" value={speakerForm.bio} onChange={(e) => setSpeakerForm((p) => ({ ...p, bio: e.target.value }))} />
        <Button variant="secondary" onClick={createSpeaker}>Create speaker</Button>
      </section>

      {!isNew && (
        <section className={styles.panel}>
          <h2>Registrations</h2>
          {regs.length === 0 ? (
            <p className={styles.sub}>No registrations yet.</p>
          ) : (
            <DataTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'organization', label: 'Organization' },
                { key: 'status', label: 'Status' },
              ]}
              rows={regs}
            />
          )}
        </section>
      )}
    </div>
  );
}
