import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import PageMeta from '../components/common/PageMeta';
import { Loading } from '../components/ui/Loading';
import { EmptyState, ErrorState } from '../components/ui/States';
import { listTalks } from '../services/talksService';
import { formatTalkDate, talkStatusLabel } from '../utils/format';

export default function TalksPage() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listTalks()
      .then(setTalks)
      .catch((err) => setError(err.message || 'Unable to load talks'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Vignak Talks"
        description="Conversations that connect technology, learning and people — on campus and online."
        path="/talks"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Vignak Talks</p>
          <h1>Conversations that connect technology, learning and people.</h1>
          <p className="lead">
            Alongside Project Assistance, Vignak Talks bring practitioners and communities together for practical
            discussions — on campus and online.
          </p>
        </Container>
      </section>
      <Section>
        {loading && <Loading />}
        {!loading && error && (
          <ErrorState title="Talks unavailable" description={error} onRetry={() => window.location.reload()} />
        )}
        {!loading && !error && talks.length === 0 && (
          <EmptyState title="No talks published yet" description="Check back soon for upcoming conversations." />
        )}
        <div className="grid-2">
          {talks.map((talk) => (
            <Card key={talk.id || talk._id} as={Link} to={`/talks/${talk.slug}`} style={{ display: 'block' }}>
              <Badge tone="accent">{talkStatusLabel(talk.status)}</Badge>
              <h3>{talk.title}</h3>
              <p className="muted">{formatTalkDate(talk.date)} · {talk.location}</p>
              <p>{talk.description}</p>
              <p><strong>{talk.speaker?.name}</strong>{talk.speaker?.title ? ` — ${talk.speaker.title}` : ''}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
