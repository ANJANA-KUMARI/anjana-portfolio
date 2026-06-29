import SectionHeader from './SectionHeader.jsx';
import { ArrowIcon } from './Icons.jsx';

export default function Publication({ publications }) {
  if (!publications.length) return null;

  return (
    <section className="section muted-section" id="publication">
      <div className="container">
        <SectionHeader eyebrow="Research" title="Publication and knowledge sharing" />
        <div className="publication-list">
          {publications.map((publication) => (
            <article className="publication-card reveal" key={publication.title}>
              <div className="publication-badge">IEEE</div>
              <div>
                <p>{publication.event}</p>
                <h3>{publication.title}</h3>
                <span>{publication.year}</span>
              </div>
              {publication.url ? (
                <a href={publication.url} target="_blank" rel="noreferrer" aria-label="Open publication">
                  <ArrowIcon />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
