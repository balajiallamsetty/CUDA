import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { SITE } from '../constants/site';
import PageMeta from '../components/common/PageMeta';

export default function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description={`How ${SITE.legalName} handles information you share through our website and forms.`}
        path="/privacy"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="lead">How {SITE.legalName} handles information you share through our website and forms.</p>
        </Container>
      </section>
      <Section className="prose-block">
        <h3>Information we collect</h3>
        <p>
          When you contact us or start a project, we collect details you submit such as name, email, phone, organization,
          and project information. Technical metadata such as IP address and user agent may be stored for security and abuse prevention.
        </p>
        <h3>How we use information</h3>
        <p>
          We use enquiry data to respond to requests, qualify opportunities, improve our services, and protect our systems.
          We do not sell personal information.
        </p>
        <h3>Retention and security</h3>
        <p>
          Data is stored in secured databases with access limited to authorized roles. Authentication for staff tools uses
          hashed passwords and HttpOnly session cookies.
        </p>
        <h3>Contact</h3>
        <p>Privacy questions: {SITE.email}</p>
      </Section>
    </>
  );
}
