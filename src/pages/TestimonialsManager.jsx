import { useEffect, useState } from "react";
import {
  MessageSquareQuote,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";
import "../styles/TestimonialsManager.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const emptyForm = {
  name: "",
  role: "",
  company: "",
  quote: "",
  photoUrl: "",
  published: false,
};

function authHeaders() {
  const token = sessionStorage.getItem("portfolio_admin_token");
  return { Authorization: `Bearer ${token}` };
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function handleUnauthorized(response) {
    if (response.status !== 401 && response.status !== 403) {
      return false;
    }

    sessionStorage.removeItem("portfolio_admin_token");
    window.location.href = "/admin";
    return true;
  }

  async function loadTestimonials() {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/testimonials/admin`, {
        headers: authHeaders(),
      });

      if (await handleUnauthorized(response)) return;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load testimonials.");
      }

      setTestimonials(result.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Failed to load testimonials.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEditing(testimonial) {
    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      quote: testimonial.quote || "",
      photoUrl: testimonial.photoUrl || "",
      published: testimonial.published === true,
    });

    setEditingId(testimonial.id);
    setNotice(null);

    document
      .getElementById("testimonial-editor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setNotice({
        type: "error",
        message: "Reviewer photos must be JPG, PNG, or WebP images.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice({
        type: "error",
        message: "The photo must be smaller than 10 MB.",
      });
      return;
    }

    setUploadingPhoto(true);
    setNotice(null);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch(
        `${API_URL}/uploads/testimonial-photo`,
        {
          method: "POST",
          headers: authHeaders(),
          body: data,
        }
      );

      if (await handleUnauthorized(response)) return;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Photo upload failed.");
      }

      setForm((current) => ({
        ...current,
        photoUrl: result.url,
      }));

      setNotice({
        type: "success",
        message: "Reviewer photo uploaded successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Photo upload failed.",
      });
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function saveTestimonial(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/testimonials/${editingId}`
          : `${API_URL}/testimonials`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (await handleUnauthorized(response)) return;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save testimonial.");
      }

      setNotice({
        type: "success",
        message: result.message || "Testimonial saved successfully.",
      });

      resetForm();
      await loadTestimonials();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not save testimonial.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(testimonial) {
    setNotice(null);

    try {
      const response = await fetch(
        `${API_URL}/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: testimonial.name,
            role: testimonial.role || "",
            company: testimonial.company || "",
            quote: testimonial.quote,
            photoUrl: testimonial.photoUrl || "",
            published: !testimonial.published,
          }),
        }
      );

      if (await handleUnauthorized(response)) return;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update publication status.");
      }

      setNotice({
        type: "success",
        message: testimonial.published
          ? "Testimonial unpublished."
          : "Testimonial published.",
      });

      await loadTestimonials();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not update publication status.",
      });
    }
  }

  async function deleteTestimonial(testimonial) {
    const confirmed = window.confirm(
      `Delete the testimonial from ${testimonial.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(testimonial.id);
    setNotice(null);

    try {
      const response = await fetch(
        `${API_URL}/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      if (await handleUnauthorized(response)) return;

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete testimonial.");
      }

      if (editingId === testimonial.id) resetForm();

      setNotice({
        type: "success",
        message: "Testimonial deleted successfully.",
      });

      await loadTestimonials();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not delete testimonial.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading && testimonials.length === 0) {
    return (
      <section className="admin-content-card testimonials-loading">
        <div className="admin-loading-spinner" />
        <p>Loading testimonials...</p>
      </section>
    );
  }

  return (
    <div className="testimonials-manager">
      <section className="testimonials-manager-intro">
        <div>
          <p className="admin-eyebrow">SOCIAL PROOF</p>
          <h2>Testimonials</h2>
          <p>
            Manage genuine reviews from clients, colleagues, mentors, or
            collaborators. Only published testimonials appear on your public
            portfolio.
          </p>
        </div>

        <div className="testimonials-manager-icon">
          <MessageSquareQuote size={28} />
        </div>
      </section>

      {notice && (
        <div
          className={`tm-notice ${notice.type}`}
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

      <section className="tm-summary-grid">
        <article className="tm-summary-card">
          <span>Total testimonials</span>
          <strong>{testimonials.length}</strong>
        </article>
        <article className="tm-summary-card">
          <span>Published</span>
          <strong>
            {testimonials.filter((item) => item.published).length}
          </strong>
        </article>
        <article className="tm-summary-card">
          <span>Drafts</span>
          <strong>
            {testimonials.filter((item) => !item.published).length}
          </strong>
        </article>
      </section>

      <section
        className="admin-content-card tm-editor-card"
        id="testimonial-editor"
      >
        <div className="tm-card-heading">
          <div>
            <h3>{editingId ? "Edit testimonial" : "Add a testimonial"}</h3>
            <p>
              Enter the review as provided by the reviewer. Do not invent
              endorsements.
            </p>
          </div>

          {editingId ? <Pencil size={21} /> : <Plus size={21} />}
        </div>

        <form className="tm-form" onSubmit={saveTestimonial}>
          <div className="tm-fields-grid">
            <label className="tm-field">
              <span>Reviewer name *</span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Full name"
                maxLength={120}
                required
              />
            </label>

            <label className="tm-field">
              <span>Job title / role</span>
              <input
                name="role"
                value={form.role}
                onChange={updateField}
                placeholder="e.g. Software Engineer"
                maxLength={160}
              />
            </label>

            <label className="tm-field tm-field-full">
              <span>Company / organisation</span>
              <input
                name="company"
                value={form.company}
                onChange={updateField}
                placeholder="Company or organisation name"
                maxLength={160}
              />
            </label>

            <label className="tm-field tm-field-full">
              <span>Review text *</span>
              <textarea
                name="quote"
                value={form.quote}
                onChange={updateField}
                placeholder="Enter the review exactly as provided by the reviewer."
                rows={5}
                maxLength={3000}
                required
              />
              <small>{form.quote.length}/3000 characters</small>
            </label>
          </div>

          <div className="tm-photo-editor">
            <div className="tm-photo-preview">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Reviewer preview" />
              ) : (
                <UserRound size={34} />
              )}
            </div>

            <div className="tm-photo-copy">
              <strong>Reviewer photo</strong>
              <p>Optional · JPG, PNG, or WebP · Maximum 10 MB</p>

              <label className="admin-secondary-button tm-photo-button">
                <Upload size={16} />
                {uploadingPhoto
                  ? "Uploading photo..."
                  : form.photoUrl
                    ? "Change photo"
                    : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadPhoto}
                  disabled={uploadingPhoto}
                  hidden
                />
              </label>

              {form.photoUrl && (
                <button
                  className="tm-remove-photo"
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, photoUrl: "" }))
                  }
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <label className="tm-publish-control">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={updateField}
            />
            <span>
              <strong>Publish this testimonial</strong>
              <small>
                {form.published
                  ? "This review will be visible on your public portfolio."
                  : "This review will remain a private draft."}
              </small>
            </span>
          </label>

          <div className="tm-form-actions">
            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                <X size={17} />
                Cancel edit
              </button>
            )}

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || uploadingPhoto}
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Testimonial"}
            </button>
          </div>
        </form>
      </section>

      <section className="tm-list-section">
        <div className="tm-list-heading">
          <div>
            <h3>Your testimonials</h3>
            <p>Manage existing reviews and their publication status.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadTestimonials}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="admin-content-card tm-empty-state">
            <span>
              <MessageSquareQuote size={28} />
            </span>
            <h3>No testimonials yet</h3>
            <p>
              Add a genuine review using the form above. It will appear here
              after you save it.
            </p>
          </div>
        ) : (
          <div className="tm-list">
            {testimonials.map((testimonial) => (
              <article className="admin-content-card tm-item" key={testimonial.id}>
                <div className="tm-item-main">
                  <div className="tm-item-avatar">
                    {testimonial.photoUrl ? (
                      <img
                        src={testimonial.photoUrl}
                        alt={`${testimonial.name}`}
                      />
                    ) : (
                      <UserRound size={25} />
                    )}
                  </div>

                  <div className="tm-item-content">
                    <div className="tm-item-title-row">
                      <h4>{testimonial.name}</h4>
                      <span
                        className={`tm-status ${
                          testimonial.published ? "published" : "draft"
                        }`}
                      >
                        {testimonial.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    {(testimonial.role || testimonial.company) && (
                      <p className="tm-item-role">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <p className="tm-item-quote">{testimonial.quote}</p>
                  </div>
                </div>

                <div className="tm-item-actions">
                  <button
                    type="button"
                    className="tm-action-button"
                    onClick={() => togglePublished(testimonial)}
                    title={
                      testimonial.published
                        ? "Unpublish testimonial"
                        : "Publish testimonial"
                    }
                  >
                    {testimonial.published ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                    {testimonial.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="tm-action-button"
                    onClick={() => startEditing(testimonial)}
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="tm-action-button danger"
                    onClick={() => deleteTestimonial(testimonial)}
                    disabled={deletingId === testimonial.id}
                  >
                    <Trash2 size={17} />
                    {deletingId === testimonial.id ? "Deleting..." : "Delete"}
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