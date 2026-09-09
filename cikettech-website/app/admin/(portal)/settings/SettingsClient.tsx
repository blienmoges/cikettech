"use client";

import React, { useEffect, useState } from "react";
import { SaveIcon, UserIcon, LockIcon, GearIcon, LinkIcon } from "../../../components/admin-icons";
import { adminFetch, getCurrentUser } from "../../../lib/api";

type SocialLinks = { facebook: string; linkedin: string; twitter: string; instagram: string };

type Settings = {
  name: string;
  email: string;
  role: string;
  language: string;
  emailNotifications: boolean;
  socialLinks: SocialLinks;
};

export default function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const [name, setName] = useState(initialSettings.name);
  const [email, setEmail] = useState(initialSettings.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState(initialSettings.language);
  const [emailNotifications, setEmailNotifications] = useState(initialSettings.emailNotifications);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialSettings.socialLinks);
  const [saving, setSaving] = useState(false);
  // The signed-in user's real role — settings.role is a single shared record,
  // not per-user, so it can't be trusted once more than one account exists.
  const [role, setRole] = useState(initialSettings.role);
  useEffect(() => {
    const current = getCurrentUser()?.role;
    if (current) setRole(current);
  }, []);

  function updateSocial(key: keyof SocialLinks, value: string) {
    setSocialLinks((s) => ({ ...s, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    if (newPassword && !currentPassword) {
      alert("Enter your current password to set a new one.");
      return;
    }
    setSaving(true);
    try {
      if (newPassword) {
        const pwRes = await adminFetch(`/api/admin/auth/password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!pwRes.ok) {
          const data = await pwRes.json().catch(() => ({}) as { error?: string });
          alert(data.error || "Could not update password.");
          setSaving(false);
          return;
        }
      }

      const res = await adminFetch(`/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, language, emailNotifications, socialLinks }),
      });
      if (!res.ok) throw new Error("Save failed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Settings saved.");
    } catch {
      alert("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave}>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin profile, password, and preferences.</p>
        </div>
        <button type="submit" className="primary-button admin-new-btn" disabled={saving}>
          <SaveIcon /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="admin-settings-col">
        <div className="admin-card">
          <h3>
            <UserIcon /> Profile Information
          </h3>
          <div className="admin-card-divider" />
          <div className="admin-feature-cols">
            <label>
              Full Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
          <label>
            Role
            <input value={role} disabled />
          </label>
        </div>

        <div className="admin-card">
          <h3>
            <LockIcon /> Change Password
          </h3>
          <div className="admin-card-divider" />
          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <div className="admin-feature-cols">
            <label>
              New Password
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="admin-card">
          <h3>
            <GearIcon /> Preferences
          </h3>
          <div className="admin-card-divider" />
          <label>
            Default Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Amharic</option>
            </select>
          </label>
          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Email me about new customer inquiries
          </label>
        </div>

        <div className="admin-card">
          <h3>
            <LinkIcon /> Social Media Links
          </h3>
          <div className="admin-card-divider" />
          <p className="admin-hint">Shown as icons in the public site footer. Leave blank to hide.</p>
          <div className="admin-feature-cols">
            <label>
              Facebook
              <input
                placeholder="https://facebook.com/cikettech"
                value={socialLinks.facebook}
                onChange={(e) => updateSocial("facebook", e.target.value)}
              />
            </label>
            <label>
              LinkedIn
              <input
                placeholder="https://linkedin.com/company/cikettech"
                value={socialLinks.linkedin}
                onChange={(e) => updateSocial("linkedin", e.target.value)}
              />
            </label>
          </div>
          <div className="admin-feature-cols">
            <label>
              X (Twitter)
              <input
                placeholder="https://x.com/cikettech"
                value={socialLinks.twitter}
                onChange={(e) => updateSocial("twitter", e.target.value)}
              />
            </label>
            <label>
              Instagram
              <input
                placeholder="https://instagram.com/cikettech"
                value={socialLinks.instagram}
                onChange={(e) => updateSocial("instagram", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
