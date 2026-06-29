export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header reveal">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
