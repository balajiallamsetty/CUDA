import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import Card from '../components/ui/Card';
import PageMeta from '../components/common/PageMeta';

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="About"
        description="Learn about Vignak Solutions — connecting technology with human progress through digital systems and meaningful conversations."
        path="/about"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">About Vignak</p>
          <h1>A company built to connect technology with human progress.</h1>
          <p className="lead">
            Today our primary focus is Project Assistance for B.Tech, B.E., and M.Tech students. We also support
            digital systems, campus experiences, and conversations for institutions and teams.
          </p>
          <div className="row" style={{ marginTop: '1.25rem' }}>
            <Button as={Link} to="/project-assistance">Explore Project Assistance</Button>
          </div>
        </Container>
      </section>

      <Section title="Our approach">
        <div className="grid-2">
          <Card>
            <h3>Craft over clutter</h3>
            <p>
              We prefer precise products and honest communication over noisy marketing. Every page, kit and talk should earn attention.
            </p>
          </Card>
          <Card>
            <h3>Foundations first</h3>
            <p>
              Phase 1 establishes secure, expandable systems. Future products — including Joy Box and broader ecosystem tools —
              will build on this base rather than replacing it.
            </p>
          </Card>
        </div>
      </Section>

      <Section tone="elevated" title="What guides us">
        <ul className="list-clean">
          <li>Respect for students, professionals and institutions as real people — not metrics.</li>
          <li>Technology that is maintainable, secure and ready to expand.</li>
          <li>Experiences that feel premium without becoming inaccessible.</li>
          <li>Clear partnerships with campuses, startups and established businesses.</li>
        </ul>
        <div className="row" style={{ marginTop: '1.5rem' }}>
          <Button as={Link} to="/register">Start Your Project</Button>
          <Button as={Link} to="/contact" variant="secondary">Contact</Button>
        </div>
      </Section>
    </>
  );
}
