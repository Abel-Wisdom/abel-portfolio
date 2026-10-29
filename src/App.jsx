
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import CaseStudy from "./sections/CaseStudy";
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import "./styles/hero.css";
import "./styles/about.css";
import "./styles/skills.css";
import "./styles/projects.css";
import "./styles/case-study.css";
import "./styles/experience.css";
import "./styles/testimonials.css";
import "./styles/contact.css";
import "./styles/footer.css";

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CaseStudy />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/projects/:slug"
        element={<ProjectCaseStudy />}
      />

      <Route path="/admin" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
