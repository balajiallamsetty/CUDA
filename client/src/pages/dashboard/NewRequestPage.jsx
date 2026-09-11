import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEAD_SERVICES, TIMELINE_OPTIONS } from '@vignak/shared';
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
    projectTitle: '',
    projectCategory: '',
    description: '',
    technologies: '',
    timeline: '',
    course: user?.course || '',
    year: user?.year || '',
    phone: user?.phone || '',
    company_website: '',
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createLead({
        name: user.name,
        email: user.email,
        phone: form.phone,
        organization: user.institution || '',
        organizationType: 'College',
        service: LEAD_SERVICES.PROJECT_ASSISTANCE,
        description: form.description,
        timeline: form.timeline || undefined,
        projectTitle: form.projectTitle,
        projectCategory: form.projectCategory,
        technologies: form.technologies
          ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        course: form.course,
        year: form.year,
        company_website: form.company_website,
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
      <PageMeta title="New request" description="Submit a project assistance requirement." path="/dashboard/requests/new" />
      <p className="eyebrow">New request</p>
      <h1 className="!text-3xl">Submit project requirement</h1>
      <p className="lead mb-6">Tell us what you want to build. Avoid sharing unnecessary sensitive data.</p>
      <form className="grid max-w-2xl gap-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft" onSubmit={onSubmit}>
        <Input label="Project title" name="projectTitle" value={form.projectTitle} onChange={onChange} required />
        <Select label="Category" name="projectCategory" value={form.projectCategory} onChange={onChange} required>
          <option value="">Select category</option>
          {PROJECT_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <Textarea
          label="Requirements"
          name="description"
          value={form.description}
          onChange={onChange}
          required
          hint="Idea, features, constraints, and what you need help with."
        />
        <Input
          label="Preferred technologies"
          name="technologies"
          value={form.technologies}
          onChange={onChange}
          hint="Comma-separated, e.g. React, Node.js, MongoDB"
        />
        <Select label="Timeline" name="timeline" value={form.timeline} onChange={onChange}>
          <option value="">Select timeline</option>
          {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Input label="Course" name="course" value={form.course} onChange={onChange} />
        <Input label="Year" name="year" value={form.year} onChange={onChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
        <input type="text" name="company_website" value={form.company_website} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" />
        <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit request'}</Button>
      </form>
    </div>
  );
}
