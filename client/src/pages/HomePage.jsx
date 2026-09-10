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
import styles from './HomePage.module.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [talks, setTalks] = useState([]);

  useEffect(() => {
    listProjects({ featuredOnly: true }).then(setProjects);
    listTalks().then((items) => setTalks(items.slice(0, 2)));
  }, []);

  return (
    <>
      <PageMeta
        title="Vignak Solutions"
        description="Vignak Solutions brings together digital solutions, experiences and events to help businesses, institutions and communities grow."
        path="/"
      />
      <section className={`page-hero page-hero--brand ${styles.hero}`}>
        <Container>
          <p className="eyebrow">Vignak</p>
          <h1>Building technology, experiences and connections that move people forward.</h1>
          <p className="lead">
            Vignak Solutions brings together digital solutions, experiences and events to help
            businesses, institutions and communities grow.
          </p>
          <div className="row">
            <Button as={Link} to="/start-project" variant="inverse" size="lg">
              Start a Project
            </Button>
            <Button as={Link} to="/solutions" variant="outlineInverse" size="lg">
              Explore Vignak
            </Button>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="What we do"
        title="Technology, events, education and experiences — connected."
        description="We work where digital systems meet human moments: websites and applications, campus and conference experiences, and conversations that spark better decisions."
      >
        <div className="grid-4">
          {[
            ['Technology', 'Websites, applications and digital systems built for clarity and growth.'],
            ['Events', 'Thoughtfully produced materials and moments for conferences and gatherings.'],
            ['Education', 'Support for institutions and student-facing initiatives that need modern presence.'],
            ['Experiences', 'Branded gifts, kits and touchpoints that feel intentional — not generic.'],
          ].map(([title, text]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        tone="elevated"
        eyebrow="Phase 1 services"
        title="Three foundations we deliver today."
        description="Phase 1 focuses on web & digital solutions, customized gifts & conference kits, and Vignak Talks."
      >
        <div className="grid-3">
          <Card>
            <Badge tone="accent">Web & Digital</Badge>
            <h3>Web & Digital Solutions</h3>
            <p>Business, college, startup and portfolio sites — plus applications that support real workflows.</p>
            <Button as={Link} to="/solutions/web-services" variant="secondary" size="sm">
              Explore web services
            </Button>
          </Card>
          <Card>
            <Badge tone="accent">Customized</Badge>
            <h3>Gifts & Conference Kits</h3>
            <p>Notebooks, certificates, badges, ID cards, merchandise and complete conference kits.</p>
            <Button as={Link} to="/customized" variant="secondary" size="sm">
              Explore customized
            </Button>
          </Card>
          <Card>
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
        <div className="grid-4">
          {['Colleges', 'Businesses', 'Startups', 'Students', 'Individuals'].map((audience) => (
            <div key={audience} className={styles.audience}>
              {audience}
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured portfolio"
        title="Selected work."
        description="A glimpse of digital and experiential projects. Full case studies live in the portfolio."
      >
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
      </Section>

      <Section tone="elevated" eyebrow="Vignak Talks" title="Ideas that travel beyond the stage.">
        <div className="grid-2">
          {talks.map((talk) => (
            <Card key={talk.id} as={Link} to={`/talks/${talk.slug}`} className={styles.clickCard}>
              <Badge tone="accent">{talkStatusLabel(talk.status)}</Badge>
              <h3>{talk.title}</h3>
              <p className="muted">{formatTalkDate(talk.date)} · {talk.location}</p>
              <p>{talk.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        tone="ink"
        eyebrow="Future ecosystem"
        title="A platform that can grow with Vignak."
        description="Phase 1 is the foundation. Ahead: Joy Box, national conferences, student communities, AI-assisted services and business automation — introduced carefully, when ready."
      >
        <ul className={`list-clean ${styles.futureList}`}>
          <li>Student platforms and opportunity networks</li>
          <li>Event and venue orchestration</li>
          <li>AI admission, support and voice agents</li>
          <li>CRM and business automation layers</li>
        </ul>
      </Section>

      <Section
        eyebrow="Roadmap"
        title="How Vignak evolves."
      >
        <div className="grid-3">
          <Card>
            <Badge tone="success">Now</Badge>
            <h3>Phase 1</h3>
            <p>Web services, customized gifts & kits, Vignak Talks, leads and secure foundations.</p>
          </Card>
          <Card>
            <Badge tone="warn">Next</Badge>
            <h3>Phase 2</h3>
            <p>Joy Box — experiential offerings built on the Phase 1 operating system.</p>
          </Card>
          <Card>
            <Badge>Later</Badge>
            <h3>Phase 3</h3>
            <p>Broader ecosystem across events, education, AI services and institutional platforms.</p>
          </Card>
        </div>
      </Section>

      <Section className={styles.finalCta}>
        <Container>
          <div className={styles.finalInner}>
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
        </Container>
      </Section>
    </>
  );
}
