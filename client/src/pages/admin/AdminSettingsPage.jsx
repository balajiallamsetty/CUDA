import { useEffect, useState } from 'react';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Field';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/States';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminPages.module.css';

export default function AdminSettingsPage() {
  const { push } = useToast();
  const { can } = useAuth();
  const [settings, setSettings] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getAdminSettings(),
      can('audit:read') ? api.getAuditLogs({ limit: '20' }) : Promise.resolve({ data: [] }),
    ])
      .then(([settingsRes, logsRes]) => {
        setSettings(settingsRes.data);
        setLogs(logsRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [can]);

  async function saveSettings(e) {
    e.preventDefault();
    try {
      const res = await api.updateAdminSettings(settings);
      setSettings(res.data);
      push('Settings saved.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    try {
      await api.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      push('Password changed.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState description={error} />;

  return (
    <div className={styles.stack}>
      <h1>Settings</h1>
      <section className={styles.panel}>
        <h2>Public contact details</h2>
        <form className={styles.stack} onSubmit={saveSettings}>
          <Input
            label="Company name"
            value={settings.companyName || ''}
            onChange={(e) => setSettings((p) => ({ ...p, companyName: e.target.value }))}
          />
          <Input
            label="Public contact email"
            value={settings.publicContactEmail || ''}
            onChange={(e) => setSettings((p) => ({ ...p, publicContactEmail: e.target.value }))}
          />
          <Input
            label="Public phone"
            value={settings.publicPhone || ''}
            onChange={(e) => setSettings((p) => ({ ...p, publicPhone: e.target.value }))}
          />
          <Button type="submit">Save settings</Button>
        </form>
      </section>

      <section className={styles.panel}>
        <h2>Change password</h2>
        <form className={styles.stack} onSubmit={changePassword}>
          <Input
            label="Current password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
            required
          />
          <Input
            label="New password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
            required
          />
          <Button type="submit">Update password</Button>
        </form>
      </section>

      {can('audit:read') && (
        <section className={styles.panel}>
          <h2>Recent audit activity</h2>
          <DataTable
            columns={[
              { key: 'action', label: 'Action' },
              { key: 'actorEmail', label: 'Actor' },
              { key: 'success', label: 'OK', render: (r) => (r.success ? 'Yes' : 'No') },
              { key: 'createdAt', label: 'When', render: (r) => new Date(r.createdAt).toLocaleString() },
            ]}
            rows={logs}
          />
        </section>
      )}
    </div>
  );
}
