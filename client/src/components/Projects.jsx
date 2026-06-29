import SectionHeader from './SectionHeader.jsx';
import { ArrowIcon } from './Icons.jsx';

export default function Projects({ projects }) {
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader
          eyebrow="Selected work"
          title="Systems, integrations, and workflow platforms"
          description="These descriptions are intentionally high-level so confidential implementation details remain private."
        />
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card reveal" key={project.title}>
              <div className="project-number">0{index + 1}</div>
              <div className="project-content">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noreferrer" className="text-link">
                    View project <ArrowIcon />
                  </a>
                ) : (
                  <span className="private-label">Private enterprise project</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
