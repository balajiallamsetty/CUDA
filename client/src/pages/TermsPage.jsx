import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { SITE } from '../constants/site';
import PageMeta from '../components/common/PageMeta';

export default function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms of Use"
        description={`Guidelines for using the ${SITE.legalName} website and related services.`}
        path="/terms"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Legal</p>
          <h1>Terms of Use</h1>
          <p className="lead">Guidelines for using the {SITE.legalName} website and related services.</p>
        </Container>
      </section>
      <Section className="prose-block">
        <h3>Acceptance</h3>
        <p>
          By using this website, you agree to use it lawfully and respectfully. Project engagements are governed by separate
          proposals or agreements when scoped.
        </p>
        <h3>Content</h3>
        <p>
          Site content is provided for informational purposes. Portfolio and talks materials may be illustrative and updated over time.
        </p>
        <h3>Inquiries</h3>
        <p>
          Submitting a form does not create a binding contract. We will confirm next steps after reviewing your enquiry.
        </p>
        <h3>Contact</h3>
        <p>Questions about these terms: {SITE.email}</p>
      </Section>
    </>
  );
}
