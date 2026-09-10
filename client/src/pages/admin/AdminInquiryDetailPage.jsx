import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Select } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPages.module.css';

export default function AdminInquiryDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState('NEW');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAdminInquiry(id)
      .then((res) => { setItem(res.data); setStatus(res.data.status); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function save() {
    try {
      const res = await api.updateAdminInquiry(id, { status });
      setItem(res.data);
      push('Inquiry updated.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} />;
  if (!item) return null;

  return (
    <div className={styles.stack}>
      <Link to="/admin/inquiries">← Back</Link>
      <h1>{item.subject}</h1>
      <p className={styles.sub}>{item.name} · {item.email}</p>
      <section className={styles.panel}>
        <p>{item.message}</p>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <div className={styles.actions}>
          <Button onClick={save}>Save</Button>
        </div>
      </section>
    </div>
  );
}
