import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Loading } from '../components/ui/Loading';
import { listTalks } from '../services/talksService';
import { formatTalkDate, talkStatusLabel } from '../utils/format';

export default function TalksPage() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTalks().then(setTalks).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Vignak Talks</p>
          <h1>Conversations that connect technology, learning and people.</h1>
          <p className="lead">
            Vignak Talks bring practitioners and communities together for practical, human discussions — on campus and online.
          </p>
        </Container>
      </section>
      <Section>
        {loading && <Loading />}
        <div className="grid-2">
          {talks.map((talk) => (
            <Card key={talk.id} as={Link} to={`/talks/${talk.slug}`} style={{ display: 'block' }}>
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
