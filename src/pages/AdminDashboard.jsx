
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquareQuote,
  Settings2,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  Plus,
  Image as ImageIcon,
  ShieldCheck,
  Upload,
  Save,
  ExternalLink,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "../styles/AdminDashboard.css";
import ProjectsManager from "./ProjectsManager";
import TestimonialsManager from "./TestimonialsManager";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "case-studies", label: "Case Studies", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "settings", label: "Portfolio Settings", icon: Settings2 },
];

const emptySettings = {
  fullName: "",
  professionalTitle: "",
  biography: "",
  location: "",
  email: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  profileImageUrl: "",
  resumeUrl: "",
};

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Boolean(payload.exp && payload.exp * 1000 > Date.now());
  } catch {
    return false;
  }
}

function getAuthHeaders() {
  const token = sessionStorage.getItem("portfolio_admin_token");
  return { Authorization: `Bearer ${token}` };
}

function PortfolioSettings() {
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load portfolio settings.");
        }

        if (!cancelled) {
          setForm({ ...emptySettings, ...result.settings });
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            type: "error",
            message: error.message || "Could not load portfolio settings.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          professionalTitle: form.professionalTitle,
          biography: form.biography,
          location: form.location,
          email: form.email,
          phone: form.phone,
          githubUrl: form.githubUrl,
          linkedinUrl: form.linkedinUrl,
        }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("portfolio_admin_token");
        window.location.href = "/admin";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save your settings.");
      }

      setForm((current) => ({ ...current, ...result.settings }));
      setNotice({
        type: "success",
        message: result.message || "Portfolio settings saved successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not save your settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(event, type) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (type === "profile-image") {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setNotice({
          type: "error",
          message: "Choose a JPG, PNG, or WebP image.",
        });
        return;
      }
    } else if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setNotice({
        type: "error",
        message: "Please choose your resume as a PDF file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice({
        type: "error",
        message: "The file must be smaller than 10 MB.",
      });
      return;
    }

    setUploading(type);
    setNotice(null);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch(`${API_URL}/uploads/${type}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: data,
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("portfolio_admin_token");
        window.location.href = "/admin";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The file could not be uploaded.");
      }

      setForm((current) => ({
        ...current,
        ...result.settings,
        [type === "profile-image" ? "profileImageUrl" : "resumeUrl"]:
          result.url,
      }));

      setNotice({
        type: "success",
        message: result.message || "File uploaded successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "The file could not be uploaded.",
      });
    } finally {
      setUploading("");
    }
  }

  if (loading) {
    return (
      <section className="admin-content-card settings-loading">
        <div className="admin-loading-spinner" />
        <p>Loading your portfolio settings...</p>
      </section>
    );
  }

  return (
    <div className="settings-page">
      <section className="settings-intro">
        <div>
          <p className="admin-eyebrow">YOUR PROFESSIONAL PROFILE</p>
          <h2>Portfolio Settings</h2>
          <p>
            Manage the details visitors see on your portfolio, along with your
            profile picture and downloadable resume.
          </p>
        </div>
        <div className="settings-intro-icon">
          <Settings2 size={28} />
        </div>
      </section>

      {notice && (
        <div
          className={`settings-notice ${notice.type}`}
          role="status"
          aria-live="polite"
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertCircle size={19} />
          )}
          <span>{notice.message}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice(null)}
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="admin-content-card settings-media-card">
        <div className="settings-card-heading">
          <div>
            <h3>Profile picture</h3>
            <p>This image represents you across your portfolio.</p>
          </div>
          <UserRound size={21} />
        </div>

        <div className="settings-profile-upload">
          <div className="settings-profile-preview">
            {form.profileImageUrl ? (
              <img src={form.profileImageUrl} alt="Portfolio profile preview" />
            ) : (
              <UserRound size={42} />
            )}
          </div>

          <div className="settings-upload-copy">
            <strong>{form.profileImageUrl ? "Current profile picture" : "No profile picture uploaded"}</strong>
            <p>JPG, PNG, or WebP. Maximum file size: 10 MB.</p>
            <label className="admin-primary-button settings-upload-button">
              <Upload size={17} />
              {uploading === "profile-image" ? "Uploading..." : "Upload / Change Picture"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={Boolean(uploading)}
                onChange={(event) => uploadFile(event, "profile-image")}
                hidden
              />
            </label>
          </div>
        </div>
      </section>

      <form className="admin-content-card settings-form" onSubmit={saveSettings}>
        <div className="settings-card-heading">
          <div>
            <h3>Professional information</h3>
            <p>Keep your public profile accurate and up to date.</p>
          </div>
          <UserRound size={21} />
        </div>

        <div className="settings-fields-grid">
          <label className="settings-field">
            <span>Full name</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              placeholder="Your full name"
              required
            />
          </label>

          <label className="settings-field">
            <span>Professional title</span>
            <input
              name="professionalTitle"
              value={form.professionalTitle}
              onChange={updateField}
              placeholder="e.g. Full-Stack Developer"
            />
          </label>

          <label className="settings-field">
            <span>Location</span>
            <input
              name="location"
              value={form.location}
              onChange={updateField}
              placeholder="e.g. Nigeria · Open to remote"
            />
          </label>

          <label className="settings-field">
            <span>Contact email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
            />
          </label>

          <label className="settings-field">
            <span>Phone / WhatsApp</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="+234..."
            />
          </label>

          <label className="settings-field">
            <span>GitHub URL</span>
            <input
              type="url"
              name="githubUrl"
              value={form.githubUrl}
              onChange={updateField}
              placeholder="https://github.com/your-username"
            />
          </label>

          <label className="settings-field settings-field-full">
            <span>LinkedIn URL</span>
            <input
              type="url"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={updateField}
              placeholder="https://www.linkedin.com/in/your-profile"
            />
          </label>

          <label className="settings-field settings-field-full">
            <span>Professional biography</span>
            <textarea
              name="biography"
              value={form.biography}
              onChange={updateField}
              rows={6}
              placeholder="Introduce yourself, describe your skills, and explain the kind of work you do."
            />
          </label>
        </div>

        <div className="settings-form-actions">
          <span>Save your details before leaving this section.</span>
          <button className="admin-primary-button" type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? "Saving..." : "Save Profile Details"}
          </button>
        </div>
      </form>

      <section className="admin-content-card settings-media-card">
        <div className="settings-card-heading">
          <div>
            <h3>Resume / CV</h3>
            <p>Upload the PDF visitors can open or download.</p>
          </div>
          <FileText size={21} />
        </div>

        <div className="settings-resume-row">
          <div className="settings-resume-icon">
            <FileText size={27} />
          </div>
          <div className="settings-resume-info">
            <strong>{form.resumeUrl ? "Resume uploaded" : "No resume uploaded yet"}</strong>
            <p>PDF only · Maximum file size: 10 MB</p>
            {form.resumeUrl && (
              <a href={form.resumeUrl} target="_blank" rel="noreferrer">
                View current resume <ExternalLink size={14} />
              </a>
            )}
          </div>
          <label className="admin-primary-button settings-upload-button">
            <Upload size={17} />
            {uploading === "resume" ? "Uploading..." : "Upload / Replace PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={Boolean(uploading)}
              onChange={(event) => uploadFile(event, "resume")}
              hidden
            />
          </label>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("portfolio_admin_token");

    if (!token || !isTokenValid(token)) {
      sessionStorage.removeItem("portfolio_admin_token");
      navigate("/admin", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdminEmail(payload.email || "Portfolio Administrator");
    } catch {
      setAdminEmail("Portfolio Administrator");
    }

    setCheckingAuth(false);
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("portfolio_admin_token");
    navigate("/admin", { replace: true });
  }

  function selectSection(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  if (checkingAuth) {
    return (
      <main className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Verifying administrator access...</p>
      </main>
    );
  }

  const activeItem =
    navigation.find((item) => item.id === activeSection) || navigation[0];

  function renderContent() {
    if (activeSection === "settings") {
      return <PortfolioSettings />;
    }

    if (activeSection === "projects") {
  return <ProjectsManager />;
}

    if (activeSection === "overview") {
      return (
        <>
          <section className="admin-welcome">
            <div>
              <p className="admin-eyebrow">YOUR WORKSPACE</p>
              <h2>Welcome to your dashboard</h2>
              <p>
                Manage your portfolio content, showcase your projects, and
                keep your professional profile up to date.
              </p>
            </div>
            <div className="admin-welcome-icon">
              <ShieldCheck size={32} />
            </div>
          </section>

          <section className="admin-stat-grid" aria-label="Portfolio summary">
            <article className="admin-stat-card">
              <span className="admin-stat-icon blue"><FolderKanban size={21} /></span>
              <p>Total projects</p>
              <strong>—</strong>
              <span className="admin-stat-note">Project library</span>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-icon violet"><FileText size={21} /></span>
              <p>Case studies</p>
              <strong>—</strong>
              <span className="admin-stat-note">Detailed project stories</span>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-icon amber"><MessageSquareQuote size={21} /></span>
              <p>Testimonials</p>
              <strong>—</strong>
              <span className="admin-stat-note">Professional reviews</span>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-icon green"><ImageIcon size={21} /></span>
              <p>Portfolio media</p>
              <strong>—</strong>
              <span className="admin-stat-note">Project and profile images</span>
            </article>
          </section>

          <section className="admin-content-card">
            <div className="admin-card-heading">
              <div>
                <h3>Quick actions</h3>
                <p>Choose what you want to manage.</p>
              </div>
            </div>
            <div className="admin-quick-grid">
              <button className="admin-quick-action" onClick={() => selectSection("projects")}>
                <span className="admin-quick-icon"><Plus size={21} /></span>
                <span><strong>Manage projects</strong><small>Add projects, screenshots, and links.</small></span>
                <ArrowUpRight size={18} />
              </button>
              <button className="admin-quick-action" onClick={() => selectSection("case-studies")}>
                <span className="admin-quick-icon"><FileText size={21} /></span>
                <span><strong>Edit case studies</strong><small>Document features and technical decisions.</small></span>
                <ArrowUpRight size={18} />
              </button>
              <button className="admin-quick-action" onClick={() => selectSection("testimonials")}>
                <span className="admin-quick-icon"><MessageSquareQuote size={21} /></span>
                <span><strong>Manage testimonials</strong><small>Manage professional reviews.</small></span>
                <ArrowUpRight size={18} />
              </button>
              <button className="admin-quick-action" onClick={() => selectSection("settings")}>
                <span className="admin-quick-icon"><Settings2 size={21} /></span>
                <span><strong>Edit portfolio profile</strong><small>Update your details, picture, and resume.</small></span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </section>

          <section className="admin-security-note">
            <ShieldCheck size={20} />
            <div>
              <strong>Administrator workspace</strong>
              <p>
                Your dashboard requires administrator login. Protected API
                requests are also validated by the backend.
              </p>
            </div>
          </section>
        </>
      );
    }
    if (activeSection === "testimonials") {
      return <TestimonialsManager />;
    }

    const sectionDetails = {
      "case-studies": {
        title: "Case Studies",
        description:
          "Document each project's problem, solution, architecture, challenges, and lessons learned.",
        icon: FileText,
        status: "The case-study editor will connect to your project records.",
      },
    };

    const details = sectionDetails[activeSection] || sectionDetails["case-studies"];
    const SectionIcon = details.icon;

    return (
      <section className="admin-section-placeholder">
        <span className="admin-placeholder-icon">
          <SectionIcon size={30} />
        </span>
        <p className="admin-eyebrow">CONTENT MANAGEMENT</p>
        <h2>{details.title}</h2>
        <p className="admin-placeholder-description">
          {details.description}
        </p>
        <div className="admin-placeholder-status">
          <span />
          {details.status}
        </div>
        <button
          className="admin-secondary-button"
          onClick={() => selectSection("overview")}
        >
          Back to overview
        </button>
      </section>
    );

  

    return (
      <section className="admin-section-placeholder">
        <span className="admin-placeholder-icon"><SectionIcon size={30} /></span>
        <p className="admin-eyebrow">CONTENT MANAGEMENT</p>
        <h2>{details.title}</h2>
        <p className="admin-placeholder-description">{details.description}</p>
        <div className="admin-placeholder-status"><span />{details.status}</div>
        <button className="admin-secondary-button" onClick={() => selectSection("overview")}>
          Back to overview
        </button>
      </section>
    );
  }

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          className="admin-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">A</span>
          <span><strong>Portfolio</strong><small>ADMIN STUDIO</small></span>
          <button className="admin-close-sidebar" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => selectSection(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {isActive && <span className="admin-nav-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-tip">
            <span className="admin-tip-icon"><ShieldCheck size={19} /></span>
            <strong>Your portfolio, your story.</strong>
            <p>Keep your work and professional achievements up to date.</p>
          </div>
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut size={18} /><span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <p className="admin-breadcrumb">Admin / {activeItem.label}</p>
              <h1>{activeItem.label}</h1>
            </div>
          </div>
          <div className="admin-account">
            <span className="admin-account-avatar">A</span>
            <span className="admin-account-details">
              <strong>Administrator</strong><small>{adminEmail}</small>
            </span>
          </div>
        </header>

        <main className="admin-page-content">{renderContent()}</main>

        <footer className="admin-footer">
          <span>Portfolio Admin Studio</span><span>Private workspace</span>
        </footer>
      </div>
    </div>
  );
}
