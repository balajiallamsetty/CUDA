import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/States';
import { getProjectBySlug } from '../services/portfolioService';

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectBySlug(slug)
      .then(setProject)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Container>
        <div style={{ padding: '4rem 0' }}><Loading /></div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <div style={{ padding: '4rem 0' }}>
          <ErrorState title="Project not found" description="This project may be unpublished or the link is incorrect." />
          <div style={{ marginTop: '1rem' }}>
            <Button as={Link} to="/portfolio" variant="secondary">Back to portfolio</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="page-hero">
        <Container>
          <Badge>{project.category}</Badge>
          <h1 style={{ marginTop: '1rem' }}>{project.title}</h1>
          <p className="lead">{project.description}</p>
          {project.client && <p className="muted">Client: {project.client}</p>}
        </Container>
      </section>
      <Section title="Challenge">
        <p>{project.challenge}</p>
      </Section>
      <Section tone="elevated" title="Solution">
        <p>{project.solution}</p>
      </Section>
      <Section title="Technologies">
        <div className="row">
          {project.technologies?.map((tech) => (
            <Badge key={tech} tone="neutral">{tech}</Badge>
          ))}
        </div>
      </Section>
      <Section tone="muted" title="Results">
        <p>{project.results}</p>
        {project.externalUrl && (
          <Button as="a" href={project.externalUrl} target="_blank" rel="noreferrer" variant="secondary">
            Visit external link
          </Button>
        )}
      </Section>
    </>
  );
}
