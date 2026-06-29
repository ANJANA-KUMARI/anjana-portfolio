import SectionHeader from './SectionHeader.jsx';

export default function Experience({ experience }) {
  return (
    <section className="section muted-section" id="experience">
      <div className="container">
        <SectionHeader
          eyebrow="Experience"
          title="Backend engineering for complex business workflows"
        />
        <div className="timeline">
          {experience.map((role) => (
            <article className="timeline-item reveal" key={`${role.company}-${role.period}`}>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-heading">
                  <div>
                    <h3>{role.role}</h3>
                    <p>{role.company}</p>
                  </div>
                  <span>{role.period}</span>
                </div>
                <ul>
                  {role.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
