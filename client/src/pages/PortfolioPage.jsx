import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import PageMeta from '../components/common/PageMeta';
import { Loading } from '../components/ui/Loading';
import { EmptyState, ErrorState } from '../components/ui/States';
import { listProjects } from '../services/portfolioService';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => setError(err.message || 'Unable to load projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Portfolio"
        description="Selected Vignak Solutions projects across web, events, conference kits and branding."
        path="/portfolio"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Portfolio</p>
          <h1>Selected projects across web, events and branding.</h1>
          <p className="lead">
            Case summaries illustrating how Vignak approaches digital and experiential work.
          </p>
        </Container>
      </section>
      <Section>
        {loading && <Loading />}
        {!loading && error && (
          <ErrorState title="Portfolio unavailable" description={error} onRetry={() => window.location.reload()} />
        )}
        {!loading && !error && projects.length === 0 && (
          <EmptyState title="No projects published yet" description="Check back soon for featured work." />
        )}
        <div className="grid-3">
          {projects.map((project) => (
            <Card key={project.id || project._id} as={Link} to={`/portfolio/${project.slug}`} style={{ display: 'block' }}>
              <Badge>{project.category}</Badge>
              <h3>{project.title}</h3>
              <p className="muted">{project.client}</p>
              <p>{project.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
