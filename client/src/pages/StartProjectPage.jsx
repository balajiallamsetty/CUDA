import { useState } from 'react';
import {
  LEAD_SERVICE_VALUES,
  ORGANIZATION_TYPE_VALUES,
  CONTACT_METHOD_VALUES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
} from '@vignak/shared';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Input, Textarea, Select } from '../components/ui/Field';
import { useToast } from '../components/ui/Toast';
import { createLead } from '../services/api';
import { validateEmail, validateRequired } from '../utils/validation';

const initial = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  organizationType: '',
  service: '',
  description: '',
  budget: '',
  timeline: '',
  preferredContactMethod: '',
  company_website: '',
};

export default function StartProjectPage() {
  const { push } = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const next = {
      name: validateRequired(form.name, 'Name'),
      email: validateRequired(form.email, 'Email') || (!validateEmail(form.email) ? 'Enter a valid email' : ''),
      service: validateRequired(form.service, 'Service'),
      description: validateRequired(form.description, 'Description'),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    try {
      await createLead(form);
      setDone(true);
      setForm(initial);
      push('Project inquiry submitted.', 'success');
    } catch (err) {
      if (err.details) {
        const mapped = {};
        err.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setErrors(mapped);
      }
      push(err.message || 'Unable to submit inquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Start a Project</p>
          <h1>Share your brief. We will take it from there.</h1>
          <p className="lead">
            Tell us about your website, application, customized materials, conference kit, event, or Vignak Talks idea.
          </p>
        </Container>
      </section>
      <Section>
        <div style={{ maxWidth: 720 }}>
          {done ? (
            <Card>
              <h3>Inquiry received</h3>
              <p>Thank you. A Vignak team member will follow up using your preferred contact method.</p>
              <Button onClick={() => setDone(false)} variant="secondary">Submit another inquiry</Button>
            </Card>
          ) : (
            <form className="stack" onSubmit={onSubmit} noValidate>
              <div className="grid-2">
                <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} required />
              </div>
              <div className="grid-2">
                <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
                <Input label="Organization" name="organization" value={form.organization} onChange={onChange} />
              </div>
              <div className="grid-2">
                <Select label="Organization type" name="organizationType" value={form.organizationType} onChange={onChange}>
                  <option value="">Select…</option>
                  {ORGANIZATION_TYPE_VALUES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </Select>
                <Select label="Service" name="service" value={form.service} onChange={onChange} error={errors.service} required>
                  <option value="">Select…</option>
                  {LEAD_SERVICE_VALUES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </Select>
              </div>
              <Textarea
                label="Description"
                name="description"
                value={form.description}
                onChange={onChange}
                error={errors.description}
                required
                hint="Goals, audience, timeline constraints, and anything we should know."
              />
              <div className="grid-2">
                <Select label="Budget" name="budget" value={form.budget} onChange={onChange}>
                  <option value="">Select…</option>
                  {BUDGET_RANGES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </Select>
                <Select label="Timeline" name="timeline" value={form.timeline} onChange={onChange}>
                  <option value="">Select…</option>
                  {TIMELINE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </Select>
              </div>
              <Select
                label="Preferred contact method"
                name="preferredContactMethod"
                value={form.preferredContactMethod}
                onChange={onChange}
              >
                <option value="">Select…</option>
                {CONTACT_METHOD_VALUES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
              <input
                type="text"
                name="company_website"
                value={form.company_website}
                onChange={onChange}
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit project inquiry'}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
