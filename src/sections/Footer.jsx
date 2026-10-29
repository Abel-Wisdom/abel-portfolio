import { ArrowUp, Mail, MessageCircle } from "lucide-react";
 

function SocialIcon({ type }) {
  if (type === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15 1 .1.76 1.9 3.1 1.9.8 0 1.45-.3 1.85-.83-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.06 1.14a10.6 10.6 0 0 1 5.57 0c2.1-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.25-5.12 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },

  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              Abel<span>.</span>
            </a>

            <h3>Building digital experiences that matter.</h3>

            <p>
              Full-stack developer focused on creating modern, responsive,
              and reliable web applications.
            </p>

            <div className="footer-socials">
              <a
                href="mailto:abelwisdom904@gmail.com"
                aria-label="Email Abel"
                title="Email"
              >
                <Mail size={18} />
              </a>

              <a
                href="https://wa.me/2349164045329"
                target="_blank"
                rel="noreferrer"
                aria-label="Contact Abel on WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>

              {/* Add your actual GitHub and LinkedIn URLs when ready. */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg
  role="img"
  aria-label="GitHub"
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="currentColor"
>
  <SocialIcon type="github" />
</svg>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
               <svg
  role="img"
  aria-label="LinkedIn"
  viewBox="0 0 24 24"
  width="18"
  height="18"
  fill="currentColor"
>
    <SocialIcon type="linkedin" />
</svg>
              </a>
            </div>
          </div>

          <div className="footer-navigation">
            <h4>Quick Links</h4>

            <ul>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Let’s Connect</h4>

            <p>
              Have an opportunity or project in mind? I’d be happy to hear
              from you.
            </p>

            <a
              href="#contact"
              className="footer-contact-link"
            >
              Get in touch <ArrowUp size={16} />
            </a>

            <span className="footer-availability">
              Open to remote opportunities
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Abel Wisdom. All rights reserved.
          </p>

          <a href="#home" className="footer-back-to-top">
            Back to top <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
