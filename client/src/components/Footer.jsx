export default function Footer({ name }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {name}. Built with React and Node.js.</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
