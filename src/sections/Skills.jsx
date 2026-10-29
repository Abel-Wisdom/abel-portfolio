
import {
  Code2,
  Server,
  Database,
  Wrench,
} from "lucide-react";

const skillGroups = [
  {
    title: "Frontend Development",
    description: "Building responsive and interactive interfaces.",
    icon: Code2,
    skills: ["HTML", "CSS", "JavaScript", "React", "Vite", "React Router"],
  },
  {
    title: "Backend Development",
    description: "Creating APIs and application logic.",
    icon: Server,
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Database & ORM",
    description: "Managing application data and database access.",
    icon: Database,
    skills: ["PostgreSQL", "Neon", "Prisma ORM"],
  },
  {
    title: "Tools & Workflow",
    description: "Building, testing, and maintaining projects.",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Postman", "npm"],
  },
];

function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="skills-heading">
          <p className="section-label">MY TOOLKIT</p>

          <h2 className="section-title">
            Technologies I use to <span>build and ship.</span>
          </h2>

          <p className="section-description">
            My development toolkit spans frontend interfaces, backend APIs,
            database management, and the tools I use to bring applications
            together.
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;

            return (
              <article className="skill-card card" key={group.title}>
                <div className="skill-card-top">
                  <div className="skill-icon">
                    <Icon size={22} />
                  </div>

                  <span className="skill-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3>{group.title}</h3>
                <p className="skill-description">{group.description}</p>

                <div className="skill-tags">
                  {group.skills.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
