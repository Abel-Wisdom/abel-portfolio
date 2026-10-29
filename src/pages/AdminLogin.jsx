
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowLeft, LoaderCircle } from "lucide-react";
import "./AdminLogin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || "Unable to log in.");
      }

      sessionStorage.setItem("portfolio_admin_token", result.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <Link to="/" className="admin-login-back">
          <ArrowLeft size={17} />
          Back to portfolio
        </Link>

        <div className="admin-login-brand">
          <span className="admin-login-brand-icon">
            <LockKeyhole size={23} />
          </span>
          <span>Portfolio Admin</span>
        </div>

        <div className="admin-login-heading">
          <p className="admin-login-eyebrow">PRIVATE ACCESS</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage your portfolio projects and case studies.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Admin email</label>
          <div className="admin-login-input-wrap">
            <Mail size={18} aria-hidden="true" />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="admin-login-spinner" size={18} />
                Signing in...
              </>
            ) : (
              "Sign in to dashboard"
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          Restricted to the portfolio administrator.
        </p>
      </section>
    </main>
  );
}
