import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import PageMeta from '../components/common/PageMeta';
import { listProjects } from '../services/portfolioService';
import { listTalks } from '../services/talksService';
import { formatTalkDate, talkStatusLabel } from '../utils/format';
import heroImage from '../assets/hero.png';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [talks, setTalks] = useState([]);

  useEffect(() => {
    listProjects({ featuredOnly: true })
      .then(setProjects)
      .catch(() => setProjects([]));
    listTalks()
      .then((items) => setTalks(items.slice(0, 2)))
      .catch(() => setTalks([]));
  }, []);

  return (
    <>
      <PageMeta
        title="Vignak Solutions"
        description="Vignak Solutions brings together digital solutions, experiences and events to help businesses, institutions and communities grow."
        path="/"
      />

      <section className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true">
          <img src={heroImage} alt="" className={styles.heroImg} />
          <div className={styles.heroWash} />
        </div>
        <Container className={styles.heroContent}>
          <p className={styles.brand}>Vignak Solutions</p>
          <h1 className={styles.headline}>
            Technology, experiences and connections that move people forward.
          </h1>
          <p className={styles.support}>
            Digital systems, campus and conference experiences, and conversations built with clarity —
            for businesses, institutions and communities.
          </p>
          <div className={`row ${styles.ctaRow}`}>
            <Button as={Link} to="/start-project" variant="inverse" size="lg">
              Start a Project
            </Button>
            <Button as={Link} to="/solutions" variant="outlineInverse" size="lg">
              Explore solutions
            </Button>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="What we do"
        title="Where digital systems meet human moments."
        description="Websites and applications, thoughtful event materials, and talks that help teams decide with purpose."
      >
        <div className="grid-4">
          {[
            ['Technology', 'Websites, applications and digital systems built for clarity and growth.'],
            ['Events', 'Materials and moments for conferences and gatherings that feel intentional.'],
            ['Education', 'Modern presence for institutions and student-facing initiatives.'],
            ['Experiences', 'Branded gifts, kits and touchpoints that earn attention.'],
          ].map(([title, text], index) => (
            <article key={title} className={styles.pillar} style={{ '--delay': `${index * 60}ms` }}>
              <span className={styles.pillarIndex}>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        tone="elevated"
        eyebrow="Services"
        title="Three foundations we deliver today."
        description="Web & digital solutions, customized gifts & conference kits, and Vignak Talks."
      >
        <div className="grid-3">
          <Card className={styles.serviceCard}>
            <Badge tone="accent">Web & Digital</Badge>
            <h3>Web & Digital Solutions</h3>
            <p>Business, college, startup and portfolio sites — plus applications that support real workflows.</p>
            <Button as={Link} to="/solutions/web-services" variant="secondary" size="sm">
              Explore web services
            </Button>
          </Card>
          <Card className={styles.serviceCard}>
            <Badge tone="accent">Customized</Badge>
            <h3>Gifts & Conference Kits</h3>
            <p>Notebooks, certificates, badges, ID cards, merchandise and complete conference kits.</p>
            <Button as={Link} to="/customized" variant="secondary" size="sm">
              Explore customized
            </Button>
          </Card>
          <Card className={styles.serviceCard}>
            <Badge tone="accent">Talks</Badge>
            <h3>Vignak Talks</h3>
            <p>Curated conversations with practitioners on technology, learning and building with purpose.</p>
            <Button as={Link} to="/talks" variant="secondary" size="sm">
              View talks
            </Button>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Why Vignak"
        title="Premium execution with human clarity."
        description="We design for trust: clean systems, honest communication, and delivery that respects your audience."
      >
        <div className="grid-3">
          {[
            ['One team, connected crafts', 'Digital, experiential and conversational work under one coherent brand.'],
            ['Built to expand', 'Architecture ready for future education, AI and ecosystem products — without rushing them.'],
            ['Serious about quality', 'No template clutter. Clear copy, careful design and secure foundations.'],
          ].map(([title, text]) => (
            <div key={title} className={styles.whyItem}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="Who we serve" title="Partners across campuses and companies.">
        <div className={styles.audienceRow}>
          {['Colleges', 'Businesses', 'Startups', 'Students', 'Individuals'].map((audience) => (
            <div key={audience} className={styles.audience}>
              {audience}
            </div>
          ))}
        </div>
      </Section>

      {(projects.length > 0 || talks.length > 0) && (
        <Section
          eyebrow="Selected work"
          title="Portfolio and conversations."
          description="A glimpse of digital projects and upcoming talks from the Vignak team."
        >
          {projects.length > 0 && (
            <>
              <div className="grid-3">
                {projects.map((project) => (
                  <Card key={project.id} as={Link} to={`/portfolio/${project.slug}`} className={styles.clickCard}>
                    <Badge>{project.category}</Badge>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </Card>
                ))}
              </div>
              <div className={styles.sectionAction}>
                <Button as={Link} to="/portfolio" variant="secondary">
                  View all projects
                </Button>
              </div>
            </>
          )}
          {talks.length > 0 && (
            <div className={`grid-2 ${styles.talkGrid}`}>
              {talks.map((talk) => (
                <Card key={talk.id} as={Link} to={`/talks/${talk.slug}`} className={styles.clickCard}>
                  <Badge tone="accent">{talkStatusLabel(talk.status)}</Badge>
                  <h3>{talk.title}</h3>
                  <p className="muted">{formatTalkDate(talk.date)} · {talk.location}</p>
                  <p>{talk.description}</p>
                </Card>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section className={styles.finalCta}>
        <div className={styles.finalInner}>
          <p className="eyebrow">Next step</p>
          <h2>Ready to build with Vignak?</h2>
          <p className="lead">
            Tell us about your website, conference kit, talk, or digital initiative. We will respond with clear next steps.
          </p>
          <div className="row">
            <Button as={Link} to="/start-project" size="lg">
              Start a Project
            </Button>
            <Button as={Link} to="/contact" variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
