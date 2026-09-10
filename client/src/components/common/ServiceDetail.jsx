import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Container from '../layout/Container';
import Section from '../layout/Section';

export default function ServiceDetail({
  eyebrow,
  title,
  problem,
  solution,
  services,
  audience,
  benefits,
  process,
  ctaTo,
  ctaLabel,
}) {
  return (
    <>
      <section className="page-hero">
        <Container>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </Container>
      </section>

      <Section title="The problem">
        <p className="lead">{problem}</p>
      </Section>

      <Section tone="elevated" title="Our solution">
        <p className="lead">{solution}</p>
      </Section>

      <Section title="Services">
        <ul className="list-clean">
          {services.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" title="Who it is for">
        <div className="grid-3">
          {audience.map((item) => (
            <Card key={item}><h3>{item}</h3></Card>
          ))}
        </div>
      </Section>

      <Section title="Benefits">
        <ul className="list-clean">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="elevated" title="Process">
        <ol className="list-clean">
          {process.map((item, index) => (
            <li key={item}><strong>{index + 1}.</strong> {item}</li>
          ))}
        </ol>
        <div className="row" style={{ marginTop: '1.5rem' }}>
          <Button as={Link} to={ctaTo}>{ctaLabel}</Button>
          <Button as={Link} to="/contact" variant="secondary">Ask a question</Button>
        </div>
      </Section>
    </>
  );
}
