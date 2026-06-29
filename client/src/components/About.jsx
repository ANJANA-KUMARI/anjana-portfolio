import SectionHeader from './SectionHeader.jsx';

export default function About({ profile }) {
  return (
    <section className="section muted-section" id="about">
      <div className="container">
        <SectionHeader eyebrow="About" title="Engineering software that solves real problems" />
        <div className="about-grid">
          <div className="about-copy reveal">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="stats-grid reveal">
            {profile.stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
