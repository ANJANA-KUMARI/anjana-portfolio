import { useState } from 'react';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons.jsx';

const navigation = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
];

export default function Header({ theme, onToggleTheme, name }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Go to top">
          <span className="brand-mark">AK</span>
          <span>{name}</span>
        </a>

        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
