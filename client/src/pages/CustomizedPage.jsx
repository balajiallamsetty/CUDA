import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import PageMeta from '../components/common/PageMeta';

export default function CustomizedPage() {
  return (
    <>
      <PageMeta
        title="Customized"
        description="Branded gifts and conference kits from Vignak — cohesive materials for institutions and organizers."
        path="/customized"
      />
      <section className="page-hero">
        <Container>
          <p className="eyebrow">Customized</p>
          <h1>Gifts and conference kits with intention.</h1>
          <p className="lead">
            From branded notebooks to complete conference kits, Vignak helps institutions and organizers deliver materials that feel cohesive and professional.
          </p>
        </Container>
      </section>
      <Section>
        <div className="grid-2">
          <Card>
            <h3>Customized Gifts</h3>
            <p>Notebooks, certificates, badges, ID cards, merchandise and campus event materials.</p>
            <Button as={Link} to="/customized/gifts" size="sm">Explore gifts</Button>
          </Card>
          <Card>
            <h3>Conference Kits</h3>
            <p>End-to-end kits for conferences and gatherings — designed as one system, not scattered print jobs.</p>
            <Button as={Link} to="/customized/conference-kits" size="sm">Explore kits</Button>
          </Card>
        </div>
      </Section>
    </>
  );
}
