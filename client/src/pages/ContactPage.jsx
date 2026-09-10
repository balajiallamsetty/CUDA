import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Input, Textarea } from '../components/ui/Field';
import { useToast } from '../components/ui/Toast';
import { createContact } from '../services/api';
import { validateEmail, validateRequired } from '../utils/validation';
import { SITE } from '../constants/site';
import PageMeta from '../components/common/PageMeta';

const initial = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  company_website: '',
};

export default function ContactPage() {
  const { push } = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const meta = (
    <PageMeta
      title="Contact"
      description={`Contact ${SITE.legalName} — questions, partnerships, and general inquiries.`}
      path="/contact"
    />
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const next = {
      name: validateRequired(form.name, 'Name'),
      email: validateRequired(form.email, 'Email') || (!validateEmail(form.email) ? 'Enter a valid email' : ''),
      subject: validateRequired(form.subject, 'Subject'),
      message: validateRequired(form.message, 'Message'),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    try {
      await createContact(form);
      setDone(true);
      setForm(initial);
      push('Message sent successfully.', 'success');
    } catch (err) {
      if (err.details) {
        const mapped = {};
        err.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setErrors(mapped);
      }
      push(err.message || 'Unable to send message.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {meta}
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Contact</p>
          <h1>Tell us what you are working on.</h1>
          <p className="lead">
            Reach the Vignak team for project questions, partnerships, or Vignak Talks. Prefer a structured brief? Use Start a Project.
          </p>
          <p className="muted">{SITE.email}</p>
        </Container>
      </section>
      <Section>
        <div style={{ maxWidth: 640 }}>
          {done ? (
            <Card>
              <h3>Message received</h3>
              <p>Thank you. We will respond as soon as we can.</p>
              <Button onClick={() => setDone(false)} variant="secondary">Send another message</Button>
            </Card>
          ) : (
            <form className="stack" onSubmit={onSubmit} noValidate>
              <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} required />
              <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} required />
              <Input label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
              <Input label="Subject" name="subject" value={form.subject} onChange={onChange} error={errors.subject} required />
              <Textarea label="Message" name="message" value={form.message} onChange={onChange} error={errors.message} required />
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
                {submitting ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
