import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import PageMeta from '../components/common/PageMeta';

export default function SolutionsPage() {
  return (
    <>
      <PageMeta
        title="Solutions"
        description="Digital solutions from Vignak — websites, custom applications, and foundations built for clarity and growth."
        path="/solutions"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Other services</p>
          <h1>Digital solutions designed for clarity and growth.</h1>
          <p className="lead">
            Looking for academic project help? Start with{' '}
            <Link to="/project-assistance" className="font-semibold text-accent">Project Assistance</Link>.
            Below are additional web and digital services for institutions and teams.
          </p>
        </Container>
      </section>
      <Section>
        <div className="grid-2">
          <Card>
            <h3>Web Services</h3>
            <p>Business, college, startup, portfolio and landing experiences — plus web applications.</p>
            <Button as={Link} to="/solutions/web-services" size="sm">View web services</Button>
          </Card>
          <Card>
            <h3>Custom Digital Solutions</h3>
            <p>Tailored digital systems for workflows, enquiry flows and operational needs beyond a brochure site.</p>
            <Button as={Link} to="/solutions/custom-digital-solutions" size="sm">View custom digital</Button>
          </Card>
        </div>
      </Section>
    </>
  );
}
