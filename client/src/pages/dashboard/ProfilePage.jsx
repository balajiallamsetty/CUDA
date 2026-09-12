import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Field';
import PageMeta from '../../components/common/PageMeta';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const { push } = useToast();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    course: user?.course || '',
    year: user?.year || '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = params.get('verify');
    if (!token) return;
    api.confirmEmailVerification(token)
      .then(async () => {
        await refresh();
        push('Email verified.', 'success');
      })
      .catch((err) => push(err.message || 'Verification failed', 'error'));
  }, [params, push, refresh]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updateMyProfile(form);
      await refresh();
      push('Profile updated.', 'success');
    } catch (err) {
      push(err.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyEmail() {
    try {
      const res = await api.requestEmailVerification();
      push(res.message || 'Check your email for a verification link.', 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  }

  return (
    <div>
      <PageMeta title="Profile" path="/dashboard/profile" />
      <p className="eyebrow">Account</p>
      <h1 className="!text-3xl">Profile</h1>
      <p className="mb-2 text-sm text-muted">{user?.email}</p>
      <p className="mb-6 text-sm">
        Email status:{' '}
        <strong>{user?.emailVerifiedAt ? 'Verified' : 'Not verified'}</strong>
        {!user?.emailVerifiedAt && (
          <Button size="sm" variant="secondary" className="ml-3" onClick={verifyEmail}>
            Send verification email
          </Button>
        )}
      </p>
      <form className="grid max-w-xl gap-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft" onSubmit={onSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={onChange} required />
        <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
        <Input label="Institution" name="institution" value={form.institution} onChange={onChange} />
        <Input label="Course" name="course" value={form.course} onChange={onChange} />
        <Select label="Year" name="year" value={form.year} onChange={onChange}>
          <option value="">Select year</option>
          <option value="4th Year">4th Year</option>
          <option value="M.Tech">M.Tech</option>
          <option value="Other">Other</option>
        </Select>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save profile'}</Button>
      </form>
    </div>
  );
}
