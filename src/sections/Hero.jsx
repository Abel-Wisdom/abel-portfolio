
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Download,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const defaultProfile = {
  fullName: "Abel Wisdom",
  professionalTitle: "Full-Stack Developer",
  biography:
    "I'm a full-stack developer passionate about building modern, responsive web applications that solve real-world problems through thoughtful design and clean code.",
  githubUrl: "",
  linkedinUrl: "",
  profileImageUrl: "",
  resumeUrl: "",
};

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

function Hero() {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const result = await response.json();

        if (!response.ok || !result.success || !result.settings) {
          return;
        }

        if (!cancelled) {
          setProfile({
            ...defaultProfile,
            ...Object.fromEntries(
              Object.entries(result.settings).map(([key, value]) => [
                key,
                value ?? "",
              ])
            ),
          });
        }
      } catch (error) {
        console.error("Could not load public portfolio settings:", error);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const name = profile.fullName || defaultProfile.fullName;
  const title =
    profile.professionalTitle || defaultProfile.professionalTitle;
  const biography = profile.biography || defaultProfile.biography;

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="availability">
            <span className="availability-dot" />
            Available for opportunities
          </div>

          <p className="hero-eyebrow">
            HELLO, I'M {name.toUpperCase()}
          </p>

          <h1 className="hero-title">
            Building digital
            <br />
            experiences that
            <br />
            <span className="gradient-text">make an impact.</span>
          </h1>

          <p className="hero-description">{biography}</p>

          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              Explore My Work <ArrowUpRight size={17} />
            </a>

            {profile.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                className="button button-secondary"
                target="_blank"
                rel="noreferrer"
                download
              >
                Download Resume <Download size={16} />
              </a>
            ) : (
              <span
                className="button button-secondary"
                aria-label="Resume has not been uploaded yet"
                title="Upload your resume in Portfolio Settings"
                style={{ opacity: 0.65, cursor: "not-allowed" }}
              >
                Resume Coming Soon <Download size={16} />
              </span>
            )}
          </div>

            <div className="hero-socials">
            <span>Find me on</span>
   <a
  href="#"
  className="hero-social-link"
  target="_blank"
  rel="noreferrer"
>
<SocialIcon type="github" />
  <span>GitHub</span>
</a>

   <a
  href="#"
  className="hero-social-link"
  target="_blank"
  rel="noreferrer"
>
<SocialIcon type="linkedin" />

  <span>LinkedIn</span>
</a>

            <a href="#contact" aria-label="Contact me">
              <ArrowUpRight size={19} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow" />

          <div className="hero-image-frame">
            {profile.profileImageUrl ? (
              <img
                className="hero-profile-image"
                src={profile.profileImageUrl}
                alt={`${name} — ${title}`}
              />
            ) : (
              <div className="hero-image-placeholder">
                <Code2 size={56} strokeWidth={1.2} />
                <span>Your profile photo</span>
                <small>Upload it through your admin dashboard</small>
              </div>
            )}
          </div>

          <div className="floating-card floating-card-top">
            <span className="floating-icon">
              <Code2 size={19} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>Building for the web</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="floating-status" />
            <div>
              <strong>Code. Build. Improve.</strong>
              <small>Turning ideas into reality</small>
            </div>
          </div>

          <div className="hero-decoration">{"< / >"}</div>
        </div>
      </div>

      <a href="#about" className="hero-scroll">
        <ArrowDown size={16} /> Scroll to explore
      </a>
    </section>
  );
}

export default Hero;
