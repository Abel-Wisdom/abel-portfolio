
import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, Lightbulb, Rocket } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const defaultBiography =
  "I'm a developer focused on building meaningful digital experiences, solving practical problems, and growing through hands-on projects.";

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description:
      "Building responsive user interfaces and connecting them to reliable backend services and databases.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solving",
    description:
      "Turning ideas into practical solutions through thoughtful design, clean code, and continuous learning.",
  },
  {
    icon: Rocket,
    title: "Building for Impact",
    description:
      "Creating useful digital products with a focus on usability, performance, and real-world value.",
  },
];

function About() {
  const [biography, setBiography] = useState(defaultBiography);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);

        if (!response.ok) return;

        const result = await response.json();

        if (!cancelled && result.success && result.settings?.biography?.trim()) {
          setBiography(result.settings.biography.trim());
        }
      } catch (error) {
        console.error("Unable to load portfolio biography:", error);
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-heading">
          <p className="section-label">ABOUT ME</p>

          <h2 className="section-title">
            More than code. <span>A builder's mindset.</span>
          </h2>

          <p className="section-description">{biography}</p>
        </div>

        <div className="about-layout">
          <div className="about-story card">
            <div className="about-story-icon">
              <Code2 size={23} />
            </div>

            <h3>Turning ideas into working products</h3>

            <p>
              I enjoy taking an idea from concept to implementation—from
              designing an intuitive interface to building the APIs and database
              logic that power it.
            </p>

            <p>
              My work combines frontend development, backend engineering, and
              practical problem-solving. I'm continually strengthening my skills
              by building projects that reflect real-world development workflows.
            </p>

            <a className="about-project-link" href="#projects">
              Explore my projects <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="about-highlights">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article className="about-highlight card" key={item.title}>
                  <div className="about-highlight-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
