import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";


const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#home" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-mark">A</span>
          <span>Abel<span className="brand-accent">Wisdom</span></span>
        </a>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            className="button button-primary navbar-cta"
            onClick={closeMenu}
          >
            Let's Talk <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
