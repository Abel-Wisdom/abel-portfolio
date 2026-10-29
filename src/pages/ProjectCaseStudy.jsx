
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Lightbulb,
  Target,
  Wrench,
  Layers,
  UserRound,
  Rocket,
  X,
} from "lucide-react";
import "../styles/project-case-study.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const sampleProject = {
  title: "ProjectFlow",
  subtitle:
    "A full-stack project management platform for organizing projects, managing tasks, and tracking progress.",
  category: "Full-Stack Web Application",
  year: "2026",
  role: "Full-Stack Developer",

  overview:
    "ProjectFlow is a project management application designed to help individuals and small teams organize their work in one place. Users can create projects, add descriptions and deadlines, manage tasks, and monitor project completion. The application uses a React frontend connected to a Node.js and Express API, with Prisma ORM and PostgreSQL providing persistent data storage.",

  problem:
    "Managing several projects can make it difficult to track deadlines, unfinished tasks, and overall progress. When information is scattered across separate notes or task lists, it becomes harder to understand what needs attention and how much work remains. ProjectFlow brings project information, task management, and progress tracking together in a single interface.",

  solution:
    "I built a full-stack application that connects an interactive React interface to a backend REST API. The backend handles validation and application logic, while Prisma manages database operations. Projects and tasks are stored in PostgreSQL, and project progress is calculated from task completion so that the displayed information reflects the underlying records.",

  goals: [
    "Build an intuitive, responsive project management interface.",
    "Implement CRUD operations for project records.",
    "Support creating, editing, updating, and deleting tasks.",
    "Calculate project progress from completed tasks.",
    "Keep related project and task records consistent.",
    "Connect the frontend to a persistent database through a REST API.",
    "Validate requests and handle common API errors.",
  ],

  responsibilities: [
    {
      title: "Frontend development",
      description:
        "Built React components and pages, implemented project and task interactions, and connected the interface to backend API requests.",
    },
    {
      title: "Backend development",
      description:
        "Created Express API routes for project and task operations, with server-side validation and appropriate responses for successful and unsuccessful requests.",
    },
    {
      title: "Database integration",
      description:
        "Defined project and task models using Prisma ORM and PostgreSQL, including the relationship between each project and its tasks.",
    },
    {
      title: "Application logic",
      description:
        "Implemented progress calculations based on task completion and project status rules to keep project summaries aligned with task data.",
    },
    {
      title: "Testing and debugging",
      description:
        "Tested API operations, investigated integration and database errors, and verified key workflows after making corrections.",
    },
  ],

  features: [
    {
      title: "Project management",
      description:
        "Create projects with a name, description, and optional due date. Retrieve saved projects, edit project information, and delete projects when they are no longer needed.",
    },
    {
      title: "Task management",
      description:
        "Create tasks within projects, update task details and statuses, retrieve tasks belonging to a project, and remove tasks when necessary.",
    },
    {
      title: "Automatic progress tracking",
      description:
        "Calculate completion using the number of completed tasks compared with the total number of tasks. This makes progress reflect task completion instead of relying only on manually entered percentages.",
    },
    {
      title: "Project status management",
      description:
        "Update project status according to task progress and the application's defined status rules.",
    },
    {
      title: "Persistent data storage",
      description:
        "Store project and task records in PostgreSQL so data remains available when the application is refreshed or revisited.",
    },
    {
      title: "REST API integration",
      description:
        "Connect frontend operations to Express endpoints so users can work with real database records instead of relying entirely on hardcoded examples.",
    },
    {
      title: "Input validation and error handling",
      description:
        "Validate required fields and supported values, check resource identifiers, and return appropriate HTTP status codes for common errors.",
    },
    {
      title: "Relational data integrity",
      description:
        "Associate each task with its parent project and configure cascade deletion so related tasks are removed when their project is deleted.",
    },
  ],

  architecture: [
    {
      name: "React and Vite",
      purpose:
        "Render the frontend, organize reusable interface components, and handle user interactions.",
    },
    {
      name: "Node.js and Express",
      purpose:
        "Receive HTTP requests, validate input, run application logic, and return API responses.",
    },
    {
      name: "Prisma ORM",
      purpose:
        "Define data models and relationships and provide structured access to database records.",
    },
    {
      name: "PostgreSQL and Neon",
      purpose:
        "Store persistent project and task records in a relational database hosted through Neon.",
    },
  ],

  challenges: [
    {
      title: "Keeping project progress accurate",
      description:
        "Manually maintained progress can become outdated when tasks are completed, added, or deleted.",
      solution:
        "Implemented backend logic that calculates progress from completed tasks and the total task count, then updates project status according to the application's rules.",
    },
    {
      title: "Maintaining project-task relationships",
      description:
        "Tasks must remain associated with the correct project, and deleting a project should not leave unwanted task records behind.",
      solution:
        "Defined a relational model in Prisma and configured cascade deletion for the task-to-project relationship.",
    },
    {
      title: "Connecting the interface to persistent data",
      description:
        "Frontend interactions need to update the database rather than only changing what appears on screen.",
      solution:
        "Integrated React operations with Express endpoints and Prisma database queries, then tested the create, retrieve, update, and delete workflows.",
    },
    {
      title: "Handling invalid API requests",
      description:
        "Missing fields, unsupported values, and invalid resource identifiers can cause failed operations.",
      solution:
        "Added backend validation for important fields and values, checked resource identifiers, and returned suitable HTTP status codes for common failure cases.",
    },
    {
      title: "Debugging across application layers",
      description:
        "Problems in the frontend, API, ORM, or database can prevent an otherwise complete workflow from succeeding.",
      solution:
        "Used server logs, API responses, and direct endpoint testing to identify errors, correct the underlying issues, and retest affected functionality.",
    },
  ],

  technologies: [
    "React",
    "Vite",
    "JavaScript",
    "Node.js",
    "Express",
    "Prisma ORM",
    "PostgreSQL",
    "Neon",
    "REST API",
    "CSS",
  ],

  learnings:
    "Building ProjectFlow strengthened my understanding of full-stack architecture and the relationship between frontend interfaces, backend APIs, and relational databases. I gained practical experience creating REST endpoints, validating requests, modeling related data, implementing business logic, and troubleshooting integration issues. The project also reinforced the importance of testing complete user workflows and ensuring that frontend behavior remains consistent with persisted database records.",

  futureImprovements: [
    "Add secure user authentication and account management.",
    "Introduce project ownership, team membership, and role-based permissions.",
    "Add project search, filtering, sorting, and pagination.",
    "Implement deadline reminders and notifications.",
    "Expand automated tests for API endpoints and critical user workflows.",
    "Continue improving accessibility and the mobile experience.",
  ],

  liveUrl: "",
  sourceUrl: "",
};

function ProjectCaseStudy() {
  const { slug } = useParams();
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProjectGallery() {
      setGalleryLoading(true);
      setGalleryError("");
      try {
        const response = await fetch(`${API_URL}/projects`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load project screenshots.");
        }
        const projects = Array.isArray(result.data) ? result.data : [];
        const currentProject = projects.find((item) => item.slug === slug);
        const images = Array.isArray(currentProject?.gallery)
          ? currentProject.gallery.filter((image) => typeof image === "string" && image.trim())
          : [];
        if (!cancelled) setGalleryImages(images);
      } catch (error) {
        if (!cancelled) setGalleryError(error.message || "Could not load project screenshots.");
      } finally {
        if (!cancelled) setGalleryLoading(false);
      }
    }
    loadProjectGallery();
    return () => { cancelled = true; };
  }, [slug]);

 

  const project = sampleProject;

  return (
    <div className="case-study-page">
      <header className="case-study-header">
        <div className="container case-study-header-inner">
          <Link to="/" className="case-study-back">
            <ArrowLeft size={17} />
            Back to portfolio
          </Link>
          <span className="case-study-header-label">
            PROJECT CASE STUDY
          </span>
        </div>
      </header>

      <main>
        <section className="case-study-hero">
          <div className="container">
            <p className="section-label">{project.category}</p>
            <h1 className="case-study-title">{project.title}</h1>
            <p className="case-study-subtitle">{project.subtitle}</p>

            <div className="case-study-meta">
              <div>
                <span>Role</span>
                <strong>{project.role}</strong>
              </div>
              <div>
                <span>Year</span>
                <strong>{project.year}</strong>
              </div>
              <div>
                <span>Project type</span>
                <strong>Full-stack development</strong>
              </div>
            </div>

            <div className="case-study-actions">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary"
                >
                  Live Demo <ArrowUpRight size={17} />
                </a>
              )}

              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                >
                  Source Code <Code2 size={17} />
                </a>
              )}
            </div>
          </div>
        </section>

         
              <section className="case-study-block case-study-gallery-section">
                <span className="case-study-icon"><Layers size={20} /></span>
                <h2>Project Screenshots</h2>
                <p className="case-study-gallery-intro">
                  A closer look at the interface and key screens of this project.
                </p>
                {galleryLoading ? (
                  <p className="case-study-gallery-message">Loading screenshots...</p>
                ) : galleryError ? (
                  <p className="case-study-gallery-message">Screenshots could not be loaded right now.</p>
                ) : galleryImages.length ? (
                  <div className="case-study-gallery">
                    {galleryImages.map((image, index) => (
                      <button
                        type="button"
                        className="case-study-gallery-item"
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImage(image)}
                        aria-label={`View project screenshot ${index + 1}`}
                      >
                        <img src={image} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" />
                        <span>View screenshot</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="case-study-gallery-message">
                    No additional screenshots have been uploaded for this project yet.
                  </p>
                )}
              </section>

        <section className="case-study-content-section">
          <div className="container case-study-layout">
            <article className="case-study-article">
              <section className="case-study-block">
                <span className="case-study-icon">
                  <Target size={20} />
                </span>
                <h2>Project Overview</h2>
                <p>{project.overview}</p>
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Lightbulb size={20} />
                </span>
                <h2>The Problem</h2>
                <p>{project.problem}</p>
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Wrench size={20} />
                </span>
                <h2>The Solution</h2>
                <p>{project.solution}</p>
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Target size={20} />
                </span>
                <h2>Project Goals</h2>
                <ul className="case-study-feature-list">
                  {project.goals.map((goal) => (
                    <li key={goal}>
                      <CheckCircle2 size={17} />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <UserRound size={20} />
                </span>
                <h2>My Role and Responsibilities</h2>
                {project.responsibilities.map((item) => (
                  <div
                    className="case-study-challenge"
                    key={item.title}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <CheckCircle2 size={20} />
                </span>
                <h2>Core Features</h2>
                {project.features.map((feature) => (
                  <div
                    className="case-study-challenge"
                    key={feature.title}
                  >
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Layers size={20} />
                </span>
                <h2>Technical Architecture</h2>
                <p>
                  ProjectFlow separates the frontend, backend, and
                  database responsibilities. This makes it easier to
                  understand how information travels through the
                  application and where business logic is handled.
                </p>

                {project.architecture.map((layer) => (
                  <div
                    className="case-study-challenge"
                    key={layer.name}
                  >
                    <h3>{layer.name}</h3>
                    <p>{layer.purpose}</p>
                  </div>
                ))}
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Code2 size={20} />
                </span>
                <h2>Technical Challenges and Solutions</h2>
                {project.challenges.map((challenge) => (
                  <div
                    className="case-study-challenge"
                    key={challenge.title}
                  >
                    <h3>{challenge.title}</h3>
                    <p>{challenge.description}</p>
                    <div className="case-study-challenge-solution">
                      <strong>How I solved it</strong>
                      <p>{challenge.solution}</p>
                    </div>
                  </div>
                ))}
              </section>

              <section className="case-study-block">
                <span className="case-study-icon">
                  <Lightbulb size={20} />
                </span>
                <h2>What I Learned</h2>
                <p>{project.learnings}</p>
              </section>

            
            </article>

            <aside className="case-study-sidebar">
              <div className="case-study-sidebar-card">
                <h3>Technology Stack</h3>
                <div className="case-study-tech-list">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>

              <div className="case-study-sidebar-card">
                <h3>Project Details</h3>
                <div className="case-study-detail">
                  <span>Developer role</span>
                  <strong>{project.role}</strong>
                </div>
                <div className="case-study-detail">
                  <span>Year</span>
                  <strong>{project.year}</strong>
                </div>
                <div className="case-study-detail">
                  <span>Category</span>
                  <strong>{project.category}</strong>
                </div>
              </div>

              <Link to="/#contact" className="case-study-contact-link">
                Have a project in mind?
                <span>
                  Let's talk <ArrowUpRight size={16} />
                </span>
              </Link>
            </aside>
          </div>
        </section>
      </main>

      {selectedImage && (
        <div className="case-study-image-modal" role="dialog" aria-modal="true" aria-label="Project screenshot preview" onClick={() => setSelectedImage(null)}>
          <button type="button" className="case-study-image-modal-close" aria-label="Close screenshot preview" onClick={() => setSelectedImage(null)}>
            <X size={24} />
          </button>
          <img src={selectedImage} alt={`${project.title} enlarged screenshot`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      <footer className="case-study-footer">
        <div className="container">
          <Link to="/" className="case-study-back">
            <ArrowLeft size={17} />
            Back to all projects
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default ProjectCaseStudy;
