
import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Save,
  X,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Image as ImageIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  Upload,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const emptyProject = {
  title: "",
  slug: "",
  category: "Full-Stack Web Application",
  shortDescription: "",
  description: "",
  thumbnail: "",
  galleryText: "",
  liveUrl: "",
  sourceUrl: "",
  featured: false,
  published: false,
  technologiesText: "",
  caseStudy: {
    overview: "",
    problem: "",
    solution: "",
    role: "",
    architecture: "",
    challenges: "",
    learnings: "",
  },
};

function toForm(project) {
  return {
    title: project.title || "",
    slug: project.slug || "",
    category: project.category || "Full-Stack Web Application",
    shortDescription: project.shortDescription || "",
    description: project.description || "",
    thumbnail: project.thumbnail || "",
    galleryText: (project.gallery || []).join("\n"),
    liveUrl: project.liveUrl || "",
    sourceUrl: project.sourceUrl || "",
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    technologiesText: (project.technologies || []).join(", "),
    caseStudy: {
      ...emptyProject.caseStudy,
      ...(project.caseStudy || {}),
    },
  };
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getHeaders(json = false) {
  const token = sessionStorage.getItem("portfolio_admin_token");

  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (response.status === 401 || response.status === 403) {
    sessionStorage.removeItem("portfolio_admin_token");
    window.location.href = "/admin";
    throw new Error("Your admin session has expired. Please sign in again.");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "The request failed.");
  }

  return result;
}

function Notice({ notice, dismiss }) {
  if (!notice) return null;

  return (
    <div
      className={`pm-notice ${notice.type}`}
      role="status"
      aria-live="polite"
    >
      {notice.type === "success" ? (
        <CheckCircle2 size={19} />
      ) : (
        <AlertCircle size={19} />
      )}
      <span>{notice.message}</span>
      <button type="button" onClick={dismiss} aria-label="Dismiss message">
        <X size={17} />
      </button>
    </div>
  );
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/projects/admin`, {
        headers: getHeaders(),
      });
      const result = await readResponse(response);
      setProjects(result.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not load projects.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function uploadCover(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice({ type: "error", message: "Choose a JPG, PNG, or WebP image." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: "error", message: "Each image must be 10 MB or smaller." });
      return;
    }

    setUploadingCover(true);
    setNotice(null);
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch(`${API_URL}/uploads/project-image`, {
        method: "POST",
        headers: getHeaders(),
        body: data,
      });
      const result = await readResponse(response);
      setForm((current) => ({ ...current, thumbnail: result.url }));
      setNotice({ type: "success", message: "Cover image uploaded. Save the project to keep the change." });
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Could not upload the cover image." });
    } finally {
      setUploadingCover(false);
    }
  }

  async function uploadGallery(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (files.length > 8) {
      setNotice({ type: "error", message: "Choose up to 8 gallery images per upload." });
      return;
    }
    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      setNotice({ type: "error", message: "Gallery images must be JPG, PNG, or WebP." });
      return;
    }
    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      setNotice({ type: "error", message: "Each image must be 10 MB or smaller." });
      return;
    }

    setUploadingGallery(true);
    setNotice(null);
    try {
      const data = new FormData();
      files.forEach((file) => data.append("files", file));
      const response = await fetch(`${API_URL}/uploads/project-gallery`, {
        method: "POST",
        headers: getHeaders(),
        body: data,
      });
      const result = await readResponse(response);
      setForm((current) => {
        const currentUrls = current.galleryText.split("\n").map((url) => url.trim()).filter(Boolean);
        return { ...current, galleryText: [...currentUrls, ...(result.urls || [])].join("\n") };
      });
      setNotice({
        type: "success",
        message: `${(result.urls || []).length} gallery image(s) uploaded. Save the project to keep the changes.`,
      });
    } catch (error) {
      setNotice({ type: "error", message: error.message || "Could not upload gallery images." });
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(urlToRemove) {
    setForm((current) => ({
      ...current,
      galleryText: current.galleryText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url && url !== urlToRemove)
        .join("\n"),
    }));
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("caseStudy.")) {
      const key = name.slice("caseStudy.".length);
      setForm((current) => ({
        ...current,
        caseStudy: { ...current.caseStudy, [key]: value },
      }));
      return;
    }

    setForm((current) => {
      const next = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && !slugManuallyEdited && !editingId) {
        next.slug = makeSlug(value);
      }

      return next;
    });

    if (name === "slug") setSlugManuallyEdited(true);
  }

  function startNewProject() {
    setForm(emptyProject);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setShowForm(true);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editProject(project) {
    setForm(toForm(project));
    setEditingId(project.id);
    setSlugManuallyEdited(true);
    setShowForm(true);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setForm(emptyProject);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setShowForm(false);
  }

 
async function saveProject(event) {
  event.preventDefault();
  setSaving(true);
  setNotice(null);

  const safeText = (value) =>
    typeof value === "string" ? value : "";

  try {
    const technologies = safeText(form.technologiesText)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const gallery = safeText(form.galleryText)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const caseStudy = form.caseStudy || {};

    const payload = {
      title: safeText(form.title).trim(),
      slug: makeSlug(safeText(form.slug)),
      category: safeText(form.category).trim(),
      shortDescription: safeText(form.shortDescription).trim(),
      description: safeText(form.description).trim(),
      thumbnail: safeText(form.thumbnail).trim() || null,
      gallery,
      liveUrl: safeText(form.liveUrl).trim() || null,
      sourceUrl: safeText(form.sourceUrl).trim() || null,
      featured: Boolean(form.featured),
      published: Boolean(form.published),
      technologies,
      caseStudy: {
        overview: safeText(caseStudy.overview).trim(),
        problem: safeText(caseStudy.problem).trim(),
        solution: safeText(caseStudy.solution).trim(),
        role: safeText(caseStudy.role).trim(),
        architecture: safeText(caseStudy.architecture).trim(),
        challenges: safeText(caseStudy.challenges).trim(),
        learnings: safeText(caseStudy.learnings).trim(),
      },
    };

    if (!payload.title) {
      throw new Error("Please enter a project title.");
    }

    if (!payload.category) {
      throw new Error("Please select or enter a project category.");
    }

    const response = await fetch(
      editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`,
      {
        method: editingId ? "PUT" : "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      }
    );

    const result = await readResponse(response);

    setNotice({
      type: "success",
      message: result.message || "Project saved successfully.",
    });

    setForm(emptyProject);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setShowForm(false);

    await loadProjects();
  } catch (error) {
    setNotice({
      type: "error",
      message: error.message || "Could not save the project.",
    });
  } finally {
    setSaving(false);
  }
}


  async function deleteProject(project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This also deletes its associated case study. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(project.id);
    setNotice(null);

    try {
      const response = await fetch(`${API_URL}/projects/${project.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const result = await readResponse(response);

      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );

      if (editingId === project.id) cancelEditing();

      setNotice({
        type: "success",
        message: result.message || "Project deleted successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not delete the project.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const publishedCount = projects.filter((project) => project.published).length;
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="pm-page">
      <section className="pm-intro">
        <div>
          <p className="admin-eyebrow">PORTFOLIO CONTENT</p>
          <h2>Projects</h2>
          <p>
            Manage the projects visitors see, from technical details to
            publication status and case studies.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={startNewProject}
        >
          <Plus size={18} />
          Add project
        </button>
      </section>

      <Notice notice={notice} dismiss={() => setNotice(null)} />

      <div className="pm-stats">
        <article className="pm-stat">
          <span>Total projects</span>
          <strong>{projects.length}</strong>
        </article>
        <article className="pm-stat">
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </article>
        <article className="pm-stat">
          <span>Featured</span>
          <strong>{featuredCount}</strong>
        </article>
      </div>

      {showForm && (
        <form className="admin-content-card pm-form" onSubmit={saveProject}>
          <div className="pm-form-heading">
            <div>
              <p className="admin-eyebrow">
                {editingId ? "UPDATE EXISTING WORK" : "ADD TO YOUR PORTFOLIO"}
              </p>
              <h3>{editingId ? "Edit project" : "New project"}</h3>
            </div>
            <button
              className="pm-icon-button"
              type="button"
              aria-label="Close project form"
              onClick={cancelEditing}
              disabled={saving}
            >
              <X size={20} />
            </button>
          </div>

          <div className="pm-fields">
            <label className="pm-field">
              <span>Project title *</span>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="e.g. ProjectFlow"
                required
              />
            </label>

            <label className="pm-field">
              <span>URL slug *</span>
              <input
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="projectflow"
                required
              />
              <small>Used in your project page URL.</small>
            </label>

            <label className="pm-field">
              <span>Category *</span>
              <select
                name="category"
                value={form.category}
                onChange={updateField}
                required
              >
                <option>Full-Stack Web Application</option>
                <option>Frontend Web Application</option>
                <option>Backend API</option>
                <option>Mobile Application</option>
                <option>Developer Tool</option>
                <option>Other</option>
              </select>
            </label>

            <label className="pm-field pm-field-full">
              <span>Short description *</span>
              <input
                name="shortDescription"
                value={form.shortDescription}
                onChange={updateField}
                placeholder="A concise summary shown on the project card"
                required
              />
            </label>

            <label className="pm-field pm-field-full">
              <span>Full description *</span>
              <textarea
                name="description"
                value={form.description ?? "" }
                onChange={updateField}
                rows={5}
                placeholder="Describe the project, its purpose, and what it does."
                required
              />
            </label>

            <div className="pm-field pm-field-full">
              <span>Cover image</span>
              <div className="pm-upload-row">
                <label className={`admin-secondary-button pm-upload-button ${uploadingCover ? "is-disabled" : ""}`}>
                  <Upload size={17} />
                  {uploadingCover ? "Uploading cover..." : "Upload cover image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} disabled={uploadingCover || saving} hidden />
                </label>
                <small>JPG, PNG, or WebP · Maximum 10 MB</small>
              </div>
              <label className="pm-field pm-url-fallback">
                <span>Or paste an image URL</span>
                <input name="thumbnail" type="url" value={form.thumbnail} onChange={updateField} placeholder="https://..." />
              </label>
              {form.thumbnail && (
                <div className="pm-image-preview">
                  <img src={form.thumbnail} alt="Project cover preview" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <button type="button" className="pm-icon-button" onClick={() => setForm((current) => ({ ...current, thumbnail: "" }))} aria-label="Remove cover image" title="Remove cover image" disabled={saving || uploadingCover}>
                    <X size={17} />
                  </button>
                </div>
              )}
            </div>

            <div className="pm-field pm-field-full">
              <span>Gallery screenshots</span>
              <div className="pm-upload-row">
                <label className={`admin-secondary-button pm-upload-button ${uploadingGallery ? "is-disabled" : ""}`}>
                  <Upload size={17} />
                  {uploadingGallery ? "Uploading screenshots..." : "Upload gallery images"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadGallery} disabled={uploadingGallery || saving} hidden />
                </label>
                <small>Up to 8 images per upload · Maximum 10 MB each</small>
              </div>
              <label className="pm-field pm-url-fallback">
                <span>Or paste image URLs (one per line)</span>
                <textarea name="galleryText" value={form.galleryText} onChange={updateField} rows={3} placeholder="https://example.com/screenshot.png" />
              </label>
              {form.galleryText.split("\n").map((url) => url.trim()).filter(Boolean).length > 0 && (
                <div className="pm-gallery-preview">
                  {form.galleryText.split("\n").map((url) => url.trim()).filter(Boolean).map((url, index) => (
                    <div className="pm-gallery-thumb" key={`${url}-${index}`}>
                      <img src={url} alt={`Gallery screenshot ${index + 1}`} onError={(event) => { event.currentTarget.style.display = "none"; }} />
                      <button type="button" className="pm-icon-button" onClick={() => removeGalleryImage(url)} aria-label={`Remove gallery image ${index + 1}`} title="Remove image" disabled={saving || uploadingGallery}>
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="pm-field">
              <span>Technologies</span>
              <input
                name="technologiesText"
                value={form.technologiesText}
                onChange={updateField}
                placeholder="React, Node.js, PostgreSQL"
              />
              <small>Separate technologies with commas.</small>
            </label>

            <label className="pm-field">
              <span>Live demo URL</span>
              <input
                type="url"
                name="liveUrl"
                value={form.liveUrl}
                onChange={updateField}
                placeholder="https://..."
              />
            </label>

            <label className="pm-field pm-field-full">
              <span>Source code URL</span>
              <input
                type="url"
                name="sourceUrl"
                value={form.sourceUrl}
                onChange={updateField}
                placeholder="https://github.com/..."
              />
            </label>
          </div>

          <div className="pm-switches">
            <label className="pm-toggle">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={updateField}
              />
              <span className="pm-toggle-copy">
                <strong><Star size={16} /> Featured project</strong>
                <small>Highlight this project on your portfolio.</small>
              </span>
            </label>

            <label className="pm-toggle">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={updateField}
              />
              <span className="pm-toggle-copy">
                <strong>
                  {form.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  Publish project
                </strong>
                <small>
                  {form.published
                    ? "Visitors can see this project."
                    : "Keep this project as a private draft."}
                </small>
              </span>
            </label>
          </div>

          <div className="pm-case-study">
            <div>
              <p className="admin-eyebrow">OPTIONAL</p>
              <h3>Case study</h3>
              <p>
                Add the problem, solution, and technical details behind this
                project.
              </p>
            </div>

            <div className="pm-fields">
              {[
                ["overview", "Overview"],
                ["problem", "Problem"],
                ["solution", "Solution"],
                ["role", "Your role"],
                ["architecture", "Architecture"],
                ["challenges", "Challenges"],
                ["learnings", "What you learned"],
              ].map(([key, label]) => (
                <label className="pm-field" key={key}>
                  <span>{label}</span>
                  <textarea
                    name={`caseStudy.${key}`}
                    value={form.caseStudy[key]}
                    onChange={updateField}
                    rows={key === "overview" ? 3 : 2}
                    placeholder={`${label}...`}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pm-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || uploadingCover || uploadingGallery}
            >
              <Save size={17} />
              {uploadingCover || uploadingGallery
                ? "Finish image uploads..."
                : saving
                ? "Saving project..."
                : editingId
                  ? "Save changes"
                  : "Create project"}
            </button>
          </div>
        </form>
      )}

      <section className="admin-content-card pm-list-card">
        <div className="pm-list-heading">
          <div>
            <h3>Your project library</h3>
            <p>Published projects and unpublished drafts.</p>
          </div>
          <button
            type="button"
            className="pm-refresh-button"
            onClick={loadProjects}
            disabled={loading}
            aria-label="Refresh projects"
          >
            <RefreshCw size={17} className={loading ? "pm-spinning" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="pm-empty-state">
            <div className="admin-loading-spinner" />
            <p>Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="pm-empty-state">
            <FolderKanban size={36} />
            <h3>No projects yet</h3>
            <p>Create your first project to start building your portfolio.</p>
            <button
              type="button"
              className="admin-primary-button"
              onClick={startNewProject}
            >
              <Plus size={17} /> Create first project
            </button>
          </div>
        ) : (
          <div className="pm-project-list">
            {projects.map((project) => (
              <article className="pm-project-item" key={project.id}>
                <div className="pm-project-image">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt="" />
                  ) : (
                    <ImageIcon size={26} />
                  )}
                </div>

                <div className="pm-project-info">
                  <div className="pm-project-title-row">
                    <h4>{project.title}</h4>
                    {project.featured && (
                      <span className="pm-badge featured">
                        <Star size={12} /> Featured
                      </span>
                    )}
                    <span
                      className={`pm-badge ${project.published ? "published" : "draft"}`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="pm-project-category">
                    {project.category || "Project"}
                  </p>
                  <p className="pm-project-description">
                    {project.shortDescription}
                  </p>

                  <div className="pm-tech-list">
                    {(project.technologies || []).map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>

                  <div className="pm-project-links">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        Live demo <ExternalLink size={13} />
                      </a>
                    )}
                    {project.sourceUrl && (
                      <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                        Source code <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pm-project-actions">
                  <button
                    type="button"
                    className="pm-icon-button"
                    onClick={() => editProject(project)}
                    aria-label={`Edit ${project.title}`}
                    title="Edit project"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    className="pm-icon-button danger"
                    onClick={() => deleteProject(project)}
                    disabled={deletingId === project.id}
                    aria-label={`Delete ${project.title}`}
                    title="Delete project"
                  >
                    {deletingId === project.id ? (
                      <span className="pm-mini-spinner" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
