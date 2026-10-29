
import { useEffect, useState } from "react";
import {
  Mail,
  MessageCircle,
  Send,
  ArrowUpRight,
  CheckCircle2,
  User,
  AtSign,
  MessageSquare,
  LoaderCircle,
  MapPin,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import "../styles/contact.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const DEFAULT_EMAIL = "abelwisdom904@gmail.com";
const DEFAULT_WHATSAPP = "2349164045329";

function Contact() {
  const [settings, setSettings] = useState({
    email: DEFAULT_EMAIL,
    phone: DEFAULT_WHATSAPP,
    location: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);

        if (!response.ok) return;

        const result = await response.json();

        if (!cancelled && result.success && result.settings) {
          setSettings((current) => ({
            ...current,
            ...result.settings,
          }));
        }
      } catch (error) {
        console.error("Unable to load contact settings:", error);
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const email = settings.email?.trim() || DEFAULT_EMAIL;

  // Convert a saved phone number into the international format
  // required by WhatsApp, removing spaces and other characters.
  const whatsappNumber = (settings.phone || DEFAULT_WHATSAPP).replace(
    /\D/g,
    ""
  );

  const displayPhone = settings.phone?.trim() || "+234 916 404 5329";

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setFeedback("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSending) return;

    setIsSending(true);
    setFeedback("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          reply_to: form.email,
          subject: form.subject,
          message: form.message,
          to_email: email,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setFeedback("Message sent successfully! Thank you for reaching out.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      setFeedback(
        "We couldn't send your message. Please try again or contact me directly by email."
      );
    } finally {
      setIsSending(false);
    }
  }

  function openWhatsApp() {
    const message = encodeURIComponent(
      "Hello Abel! I found your portfolio and would like to discuss an opportunity with you."
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-heading">
          <p className="section-label">GET IN TOUCH</p>
          <h2 className="section-title">
            Let's build something <span>great together.</span>
          </h2>
          <p className="section-description">
            Have a project in mind, a job opportunity, or simply want to
            connect? I'd be happy to hear from you.
          </p>
        </div>

        <div className="contact-layout">
          <aside className="contact-info">
            <div className="contact-info-intro">
              <span className="contact-icon">
                <MessageSquare size={23} />
              </span>
              <h3>Let's start a conversation</h3>
              <p>
                I'm open to full-stack development opportunities,
                collaborations, and interesting projects.
              </p>
            </div>

            <a className="contact-method" href={`mailto:${email}`}>
              <span className="contact-method-icon">
                <Mail size={20} />
              </span>
              <span className="contact-method-text">
                <small>Email me</small>
                <strong>{email}</strong>
              </span>
              <ArrowUpRight size={18} className="contact-method-arrow" />
            </a>

            <a
              className="contact-method"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hello Abel! I found your portfolio and would like to connect."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-method-icon whatsapp-icon">
                <MessageCircle size={20} />
              </span>
              <span className="contact-method-text">
                <small>Chat on WhatsApp</small>
                <strong>{displayPhone}</strong>
              </span>
              <ArrowUpRight size={18} className="contact-method-arrow" />
            </a>

            {settings.location?.trim() && (
              <div className="contact-method">
                <span className="contact-method-icon">
                  <MapPin size={20} />
                </span>
                <span className="contact-method-text">
                  <small>Location</small>
                  <strong>{settings.location}</strong>
                </span>
              </div>
            )}

            {(settings.githubUrl || settings.linkedinUrl) && (
              <div className="contact-social-links">
                {settings.githubUrl && (
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-method"
                  >
                    GitHub <ArrowUpRight size={17} />
                  </a>
                )}

                {settings.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-method"
                  >
                    LinkedIn <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            )}

            <div className="contact-availability">
              <span className="availability-dot" />
              <div>
                <strong>Open to opportunities</strong>
                <p>Let's discuss how we can work together.</p>
              </div>
            </div>

            <button
              type="button"
              className="button button-secondary contact-whatsapp-button"
              onClick={openWhatsApp}
            >
              <MessageCircle size={18} />
              Start a WhatsApp chat
              <ArrowUpRight size={17} />
            </button>
          </aside>

          <div className="contact-form-card card">
            <div className="contact-form-heading">
              <h3>Send me a message</h3>
              <p>Fill in the details below to start a conversation.</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <label className="contact-field">
                  <span>Your name</span>
                  <span className="contact-input-wrap">
                    <User size={17} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      autoComplete="name"
                    />
                  </span>
                </label>

                <label className="contact-field">
                  <span>Email address</span>
                  <span className="contact-input-wrap">
                    <AtSign size={17} />
                    <input
                      type="email"
                      name="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      autoComplete="email"
                    />
                  </span>
                </label>
              </div>

              <label className="contact-field">
                <span>Subject</span>
                <input
                  type="text"
                  name="subject"
                  placeholder="Job opportunity, project, or collaboration"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                />
              </label>

              <label className="contact-field">
                <span>Your message</span>
                <textarea
                  name="message"
                  placeholder="Tell me a little about what you have in mind..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                />
              </label>

              <button
                type="submit"
                className="button button-primary contact-submit"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <LoaderCircle size={18} className="contact-spinner" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Send Message
                  </>
                )}
              </button>

              {feedback && (
                <p className="contact-feedback" role="status">
                  <CheckCircle2 size={18} />
                  {feedback}
                </p>
              )}

              <p className="contact-form-note">
                Your message is sent through our contact form. You don't need
                to open your email app.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
