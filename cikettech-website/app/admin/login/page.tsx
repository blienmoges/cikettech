import { BrandMark, ShieldIcon, SignalIcon } from "../../components/admin-icons";
import LangButton from "../../components/LangButton";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | CIKETTECH",
  description: "CIKETTECH Admin Portal login.",
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-side">
          <div>
            <div className="admin-login-logo">
              <BrandMark />
              CIKETTECH
            </div>
            <p className="admin-login-tag">Admin Portal</p>
          </div>

          <div className="admin-login-side-copy">
            <h2>Secure Access</h2>
            <p>
              Authorized administrators only. This portal provides centralized management for
              CIKETTECH products, projects, and analytics. All access attempts are logged and
              monitored.
            </p>
          </div>

          <div className="admin-login-side-footer">
            <span>
              <ShieldIcon /> Encrypted
            </span>
            <span>
              <SignalIcon /> System Status: Online
            </span>
          </div>
        </div>

        <div className="admin-login-panel">
          <LangButton className="admin-lang-btn admin-login-lang" />

          <h1>Admin Login</h1>
          <p>Enter your credentials to access the portal.</p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
