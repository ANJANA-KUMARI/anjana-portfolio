import { ArrowIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons.jsx';

const iconMap = {
  github: <GithubIcon />,
  linkedin: <LinkedinIcon />,
  email: <MailIcon />,
};

export default function Hero({ profile }) {
  return (
    <section className="hero section" id="top">
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow">
            <span className="status-dot" />
            {profile.availability}
          </div>
          <p className="hero-intro">Hello, I’m</p>
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <p className="hero-description">{profile.summary}</p>

          <div className="hero-actions">
            <a className="button primary" href="#projects">
              View my work <ArrowIcon />
            </a>
            <a className="button secondary" href="#contact">
              Contact me
            </a>
          </div>

          <div className="social-row" aria-label="Social links">
            {profile.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={social.label}
                title={social.label}
              >
                {iconMap[social.icon]}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="portrait-glow" aria-hidden="true" />

          <figure className="profile-photo-card">
            <div className="profile-photo-pattern" aria-hidden="true" />
            <img
              src="/images/profile-photo.jpg"
              alt={`${profile.name}, ${profile.title}`}
              width="580"
              height="1100"
              loading="eager"
              fetchPriority="high"
            />
            <figcaption className="profile-photo-caption">
              <span>Based in {profile.location}</span>
              <strong>{profile.title}</strong>
            </figcaption>
          </figure>

          <div className="code-window code-window-mini" aria-hidden="true">
            <div className="code-window-header">
              <span />
              <span />
              <span />
              <p>backend-engineer.js</p>
            </div>
            <pre>
              <code>
                <span className="code-purple">const</span>{' '}
                <span className="code-blue">stack</span> = [
                <span className="code-green">&quot;Node.js&quot;</span>,{' '}
                <span className="code-green">&quot;TypeScript&quot;</span>,{' '}
                <span className="code-green">&quot;MongoDB&quot;</span>];
              </code>
            </pre>
          </div>

          <div className="floating-card floating-card-one">
            <strong>{profile.yearsExperience}+</strong>
            <span>Years building software</span>
          </div>
          <div className="floating-card floating-card-two">
            <strong>API</strong>
            <span>Scalable backend systems</span>
          </div>
        </div>
      </div>
    </section>
  );
}
