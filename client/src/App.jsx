import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Publication from './components/Publication.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { getPortfolio } from './services/api.js';

function getInitialTheme() {
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    getPortfolio()
      .then((data) => {
        if (active) setPortfolio(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [portfolio]);

  if (error) {
    return (
      <main className="app-state">
        <div>
          <h1>Unable to load the portfolio</h1>
          <p>{error}</p>
          <p>Confirm that the Node.js backend is running on port 5000.</p>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="app-state">
        <div className="loader" aria-label="Loading portfolio" />
      </main>
    );
  }

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        name={portfolio.profile.name}
      />
      <main>
        <Hero profile={portfolio.profile} />
        <About profile={portfolio.profile} />
        <Skills skills={portfolio.skills} />
        <Experience experience={portfolio.experience} />
        <Projects projects={portfolio.projects} />
        <Publication publications={portfolio.publications} />
        <Contact profile={portfolio.profile} />
      </main>
      <Footer name={portfolio.profile.name} />
    </>
  );
}
