import SectionHeader from './SectionHeader.jsx';

export default function Skills({ skills }) {
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader
          eyebrow="Expertise"
          title="Tools I use to build dependable products"
          description="My strongest area is backend engineering, supported by practical cloud, database, integration, and delivery experience."
        />
        <div className="skills-grid">
          {skills.map((group) => (
            <article className="skill-card reveal" key={group.category}>
              <div className="skill-icon">{group.shortCode}</div>
              <h3>{group.category}</h3>
              <div className="tag-list">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
