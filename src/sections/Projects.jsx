import { useEffect, useState } from "react";
import {
  ExternalLink,
  Layers3,
  Code2,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function ProjectVisual({ project }) {
  if (project.thumbnail) {
    return (
      <div className="project-visual project-visual-image">
        <img
          className="project-cover-image"
          src={project.thumbnail}
          alt={`${project.title} preview`}
          loading="lazy"
        />
        <span className="project-visual-label">
          <span />
          {project.featured ? "Featured project" : project.category || "Project"}
        </span>
      </div>
    );
  }

  return (
    <div className="project-visual">
      <div className="project-visual-glow" />
      <div className="project-window">
        <div className="project-window-top">
          <div className="project-window-dots">
            <span />
            <span />
            <span />
          </div>
          <span>{(project.title || "PROJECT").toUpperCase()}</span>
        </div>

        <div className="project-preview">
          <div className="preview-sidebar">
            <div className="preview-logo">
              {(project.title || "P").charAt(0).toUpperCase()}
            </div>
            <span className="preview-line active" />
            <span className="preview-line" />
            <span className="preview-line" />
            <span className="preview-line" />
          </div>

          <div className="preview-content">
            <div className="preview-heading">
              <div>
                <span className="preview-eyebrow">PROJECT OVERVIEW</span>
                <div className="preview-title-line" />
              </div>
              <span className="preview-add">+</span>
            </div>

            <div className="preview-stats">
              <div>
                <span>Category</span>
                <strong>{project.category ? "01" : "—"}</strong>
              </div>
              <div>
                <span>Tools</span>
                <strong>{String((project.technologies || []).length).padStart(2, "0")}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>✓</strong>
              </div>
            </div>

            {[0, 1, 2].map((item) => (
              <div className="preview-project-row" key={item}>
                <span />
                <div>
                  <i />
                  <i />
                </div>
                <b />
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="project-visual-label">
        <span />
        {project.featured ? "Featured project" : "Selected project"}
      </span>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/projects`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load projects.");
        }

        if (!cancelled) {
          const publishedProjects = (result.data || []).filter(
            (project) => project.published
          );

          setProjects(
            publishedProjects.sort(
              (a, b) =>
                Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message ||
              "Projects could not be loaded right now. Please try again later."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <div className="projects-heading">
          <div>
            <p className="section-label">SELECTED WORK</p>

            <h2 className="section-title">
              Projects built to <span>solve real problems.</span>
            </h2>

            <p className="section-description">
              A selection of practical applications that demonstrate my
              approach to design, development, and problem-solving.
            </p>
          </div>

          <span className="projects-count">
            <Layers3 size={16} />
            {String(projects.length).padStart(2, "0")} PROJECT
            {projects.length === 1 ? "" : "S"}
          </span>
        </div>

        {loading ? (
          <div className="projects-state" role="status">
            <span className="projects-state-spinner" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="projects-state projects-state-error" role="alert">
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-state">
            <ImageIcon size={28} />
            <p>New projects are on the way. Check back soon.</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project, index) => {
              const technologies = project.technologies || [];
              const caseStudy = project.caseStudy;
              const hasCaseStudy = Boolean(
                caseStudy &&
                  (caseStudy.overview ||
                    caseStudy.problem ||
                    caseStudy.solution ||
                    caseStudy.role ||
                    caseStudy.architecture ||
                    caseStudy.challenges ||
                    caseStudy.learnings)
              );

              return (
                <article className="project-card card" key={project.id || project.slug}>
                  <ProjectVisual project={project} />

                  <div className="project-details">
                    <div className="project-meta">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        {(project.category || "PROJECT").toUpperCase()}
                      </span>
                    </div>

                    <h3>{project.title}</h3>
                    <p className="project-description">
                      {project.shortDescription || project.description}
                    </p>

                    {project.description &&
                      project.description !== project.shortDescription && (
                        <p className="project-long-description">
                          {project.description}
                        </p>
                      )}

                    {technologies.length > 0 && (
                      <div className="project-technologies">
                        {technologies.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    )}

                    <div className="project-actions">
                      {project.liveUrl ? (
                        <a
                          className="button button-primary"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="button button-primary project-link-disabled">
                          Live Demo <ExternalLink size={16} />
                        </span>
                      )}

                      {project.sourceUrl ? (
                        <a
                          className="button button-secondary"
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source Code <Code2 size={17} />
                        </a>
                      ) : (
                        <span className="button button-secondary project-link-disabled">
                          Source Code <Code2 size={17} />
                        </span>
                      )}

                      {hasCaseStudy && project.slug ? (
                        <Link
                          className="project-case-link"
                          to={`/projects/${project.slug}`}
                        >
                          Case Study <BookOpen size={16} />
                        </Link>
                      ) : (
                        <span
                          className="project-case-link project-link-disabled"
                          aria-disabled="true"
                          title="A case study has not been added yet."
                        >
                          Case Study <BookOpen size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
