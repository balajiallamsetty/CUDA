import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Input, Textarea } from '../components/ui/Field';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';
import { getTalkBySlug } from '../services/talksService';
import { formatTalkDate, talkStatusLabel } from '../utils/format';
import { validateEmail, validateRequired } from '../utils/validation';

export default function TalkDetailPage() {
  const { slug } = useParams();
  const { push } = useToast();
  const [talk, setTalk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getTalkBySlug(slug).then(setTalk).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Container>
        <div style={{ padding: '4rem 0' }}><Loading /></div>
      </Container>
    );
  }

  if (!talk) {
    return (
      <Container>
        <div style={{ padding: '4rem 0' }}>
          <ErrorState title="Talk not found" />
          <Button as={Link} to="/talks" variant="secondary">Back to talks</Button>
        </div>
      </Container>
    );
  }

  const canRegister = talk.status === 'REGISTRATION_OPEN' || talk.registrationOpen;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const next = {
      name: validateRequired(form.name, 'Name'),
      email: validateRequired(form.email, 'Email') || (!validateEmail(form.email) ? 'Enter a valid email' : ''),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    // Architecture stub: persistence API will be added with admin/talks management.
    setSubmitted(true);
    push('Registration interest recorded. We will confirm details soon.', 'success');
  }

  return (
    <>
      <section className="page-hero">
        <Container>
          <Badge tone="accent">{talkStatusLabel(talk.status)}</Badge>
          <h1 style={{ marginTop: '1rem' }}>{talk.title}</h1>
          <p className="lead">{talk.description}</p>
          <p className="muted">{formatTalkDate(talk.date)} · {talk.location}</p>
        </Container>
      </section>

      <Section title="Speaker">
        <Card>
          <h3>{talk.speaker?.name}</h3>
          {talk.speaker?.title && <p className="muted">{talk.speaker.title}</p>}
          <p>{talk.speaker?.bio}</p>
        </Card>
      </Section>

      {talk.videoUrl && talk.status === 'COMPLETED' && (
        <Section tone="elevated" title="Recording">
          <Button as="a" href={talk.videoUrl} target="_blank" rel="noreferrer" variant="secondary">
            Watch recording
          </Button>
        </Section>
      )}

      {canRegister && (
        <Section title="Registration" description="Share your details to register interest for this talk.">
          {submitted ? (
            <Card>
              <h3>You are on the list</h3>
              <p>Thank you. Registration architecture is in place; confirmation workflows will expand with the admin phase.</p>
            </Card>
          ) : (
            <form className="stack" onSubmit={onSubmit} noValidate style={{ maxWidth: 560 }}>
              <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} required />
              <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} required />
              <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
              <Input label="Organization" name="organization" value={form.organization} onChange={onChange} />
              <Textarea label="Notes" name="notes" value={form.notes} onChange={onChange} />
              <Button type="submit">Register interest</Button>
            </form>
          )}
        </Section>
      )}
    </>
  );
}
