
import {
  ArrowUpRight,
  Database,
  Layers3,
  Workflow,
  CheckCircle2,
} from "lucide-react";

const caseStudyDetails = [
  {
    icon: Layers3,
    label: "Frontend",
    value: "React + Vite",
    description: "Component-based user interface and client-side navigation.",
  },
  {
    icon: Workflow,
    label: "Backend",
    value: "Node.js + Express",
    description: "REST endpoints for project and task operations.",
  },
  {
    icon: Database,
    label: "Database",
    value: "PostgreSQL + Prisma",
    description: "Relational data models and database operations.",
  },
];

const challenges = [
  {
    title: "Keeping project progress accurate",
    description:
      "Implemented logic that calculates project progress from task completion, keeping the displayed progress and status aligned with task updates.",
  },
  {
    title: "Validating API requests",
    description:
      "Added server-side validation for project and task operations so invalid input receives appropriate error responses.",
  },
  {
    title: "Maintaining related data",
    description:
      "Configured the project-task relationship so deleting a project also deletes its associated tasks.",
  },
];

function CaseStudy() {
  return (
    <section className="section case-study-section" id="case-study">
      <div className="container">
        <div className="case-study-heading">
          <p className="section-label">BEHIND THE BUILD</p>

          <h2 className="section-title">
            Inside <span>ProjectFlow.</span>
          </h2>

          <p className="section-description">
            A closer look at the architecture, engineering decisions, and
            practical problems behind my full-stack project management
            application.
          </p>
        </div>

        <article className="case-study-card card">
          <div className="case-study-top">
            <div>
              <span className="case-study-overline">
                FEATURED CASE STUDY · 01
              </span>
              <h3>From project idea to full-stack application</h3>
              <p>
                ProjectFlow brings project organization and task tracking
                together in one responsive web application.
              </p>
            </div>

            <div className="case-study-symbol">
              <Layers3 size={32} />
            </div>
          </div>

          <div className="case-study-tech-grid">
            {caseStudyDetails.map((item) => {
              const Icon = item.icon;

              return (
                <div className="case-study-tech" key={item.label}>
                  <div className="case-study-tech-icon">
                    <Icon size={20} />
                  </div>

                  <span>{item.label}</span>
                  <h4>{item.value}</h4>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="case-study-content">
            <div className="case-study-overview">
              <p className="section-label">THE ENGINEERING</p>
              <h3>What I focused on</h3>

              <p>
                The application uses a React frontend to present project and
                task information, an Express backend to handle requests, and
                PostgreSQL to persist data. Prisma provides the data-access
                layer and manages the relationship between projects and tasks.
              </p>

              <p>
                A key part of the implementation was ensuring that task changes
                update the parent project's calculated progress and status.
                I also worked on request validation, error handling, and
                keeping related records consistent.
              </p>
            </div>

            <div className="case-study-challenges">
              <p className="section-label">PROBLEMS & SOLUTIONS</p>

              {challenges.map((challenge) => (
                <div className="case-study-challenge" key={challenge.title}>
                  <CheckCircle2 size={20} />

                  <div>
                    <h4>{challenge.title}</h4>
                    <p>{challenge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="case-study-bottom">
            <div>
              <span className="case-study-bottom-label">
                WHAT THIS PROJECT DEMONSTRATES
              </span>

              <div className="case-study-tags">
                <span>Full-Stack Development</span>
                <span>REST API Design</span>
                <span>Relational Data Modeling</span>
                <span>Validation & Error Handling</span>
              </div>
            </div>

            <a className="case-study-link" href="#contact">
              Discuss my work <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

export default CaseStudy;
