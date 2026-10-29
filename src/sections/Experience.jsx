
import { BriefcaseBusiness, GraduationCap, Award } from "lucide-react";

const experiences = [
  {
    type: "project",
    date: "PROJECT EXPERIENCE",
    title: "Full-Stack Developer — ProjectFlow",
    organization: "Independent Portfolio Project",
    description:
      "Designed and developed a full-stack project management application, connecting a React frontend to an Express API and PostgreSQL database.",
    achievements: [
      "Implemented project and task creation, editing, and deletion.",
      "Built task-based project progress and status calculations.",
      "Added API validation and relational data handling with Prisma.",
    ],
    icon: BriefcaseBusiness,
  },
  {
    type: "learning",
    date: "ONGOING LEARNING",
    title: "Full-Stack Web Development",
    organization: "Practical, project-based learning",
    description:
      "Developing practical skills across frontend interfaces, backend services, databases, and application deployment through hands-on work.",
    achievements: [
      "Building responsive interfaces with React and CSS.",
      "Developing REST APIs using Node.js and Express.",
      "Working with PostgreSQL, Prisma, and Git-based workflows.",
    ],
    icon: GraduationCap,
  },
];

function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <div className="experience-heading">
          <p className="section-label">MY JOURNEY</p>

          <h2 className="section-title">
            Experience built through <span>doing.</span>
          </h2>

          <p className="section-description">
            A snapshot of my hands-on development experience and continued
            learning as I build toward professional full-stack roles.
          </p>
        </div>

        <div className="experience-layout">
          <div className="experience-timeline">
            {experiences.map((item) => {
              const Icon = item.icon;

              return (
                <article className="experience-item" key={item.title}>
                  <div className="experience-marker">
                    <Icon size={19} />
                  </div>

                  <div className="experience-card card">
                    <span className="experience-date">{item.date}</span>

                    <h3>{item.title}</h3>
                    <p className="experience-organization">
                      {item.organization}
                    </p>

                    <p className="experience-description">
                      {item.description}
                    </p>

                    <ul className="experience-achievements">
                      {item.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="experience-note card">
            <div className="experience-note-icon">
              <Award size={23} />
            </div>

            <p className="section-label">MY APPROACH</p>

            <h3>Learn by building. Improve with every project.</h3>

            <p>
              I focus on turning what I learn into working applications,
              understanding the decisions behind the code, and improving how I
              design, build, test, and maintain software.
            </p>

            <div className="experience-note-tags">
              <span>Continuous learning</span>
              <span>Practical problem-solving</span>
              <span>Product mindset</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Experience;
