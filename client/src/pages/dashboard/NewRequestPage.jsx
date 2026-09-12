import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIMELINE_OPTIONS, SERVICE_SLUGS } from '@vignak/shared';
import * as api from '../../services/api';
import Button from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import PageMeta from '../../components/common/PageMeta';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { PROJECT_CATEGORY_OPTIONS } from '../../data/projectCategories';

export default function NewRequestPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    domain: '',
    description: '',
    requirements: '',
    technologies: '',
    timeline: '',
    expectedCompletionDate: '',
    course: user?.course || '',
    year: user?.year || '',
    phone: user?.phone || '',
    organization: user?.institution || '',
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createMyServiceRequest({
        serviceSlug: SERVICE_SLUGS.PROJECT_ASSISTANCE,
        title: form.title,
        domain: form.domain,
        description: form.description,
        requirements: form.requirements,
        technologies: form.technologies
          ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        timeline: form.timeline || undefined,
        expectedCompletionDate: form.expectedCompletionDate || undefined,
        course: form.course,
        year: form.year,
        phone: form.phone,
        organization: form.organization,
      });
      push('Request submitted. We will review it shortly.', 'success');
      navigate('/dashboard/requests');
    } catch (err) {
      push(err.message || 'Unable to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageMeta title="New request" path="/dashboard/requests/new" />
      <p className="eyebrow">New request</p>
      <h1 className="!text-3xl">Submit Project Assistance requirement</h1>
      <p className="lead mb-6">Share domain, idea, stack preference, and timeline.</p>
      <form className="grid max-w-2xl gap-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft" onSubmit={onSubmit}>
        <Input label="Project title" name="title" value={form.title} onChange={onChange} required />
        <Select label="Domain" name="domain" value={form.domain} onChange={onChange} required>
          <option value="">Select domain</option>
          {PROJECT_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <Textarea label="Description" name="description" value={form.description} onChange={onChange} required />
        <Textarea label="Additional requirements" name="requirements" value={form.requirements} onChange={onChange} />
        <Input
          label="Preferred technologies"
          name="technologies"
          value={form.technologies}
          onChange={onChange}
          hint="Comma-separated"
        />
        <Select label="Timeline" name="timeline" value={form.timeline} onChange={onChange}>
          <option value="">Select timeline</option>
          {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input
          label="Expected completion date"
          type="date"
          name="expectedCompletionDate"
          value={form.expectedCompletionDate}
          onChange={onChange}
        />
        <Input label="Course" name="course" value={form.course} onChange={onChange} />
        <Input label="Year" name="year" value={form.year} onChange={onChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
        <Input label="College / organization" name="organization" value={form.organization} onChange={onChange} />
        <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit request'}</Button>
      </form>
    </div>
  );
}
