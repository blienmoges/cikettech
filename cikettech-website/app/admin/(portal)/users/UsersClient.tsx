"use client";

import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon, UserIcon } from "../../../components/admin-icons";
import { adminFetch, getCurrentUser } from "../../../lib/api";

type User = { email: string; name: string; role: string };

export default function UsersClient() {
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Editor");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const me = getCurrentUser();
    setCurrentEmail(me?.email ?? "");
    const res = await adminFetch("/api/admin/users");
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Could not create user.");
        return;
      }
      setEmail("");
      setName("");
      setPassword("");
      setRole("Editor");
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(target: User, nextRole: string) {
    const res = await adminFetch(`/api/admin/users/${encodeURIComponent(target.email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    const data = await res.json().catch(() => ({}) as { error?: string });
    if (!res.ok) {
      alert(data.error || "Could not update role.");
      return;
    }
    load();
  }

  async function removeUser(target: User) {
    if (!confirm(`Remove ${target.email}?`)) return;
    const res = await adminFetch(`/api/admin/users/${encodeURIComponent(target.email)}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}) as { error?: string });
    if (!res.ok) {
      alert(data.error || "Could not remove user.");
      return;
    }
    load();
  }

  if (loading) return null;

  if (forbidden) {
    return (
      <div className="admin-info-banner">
        <UserIcon />
        <div>
          <strong>Administrators only</strong>
          <p>Your account doesn&apos;t have permission to manage users. Ask an Administrator for access.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>Manage who can access the admin portal and what they&apos;re allowed to do.</p>
        </div>
        <button type="button" className="primary-button admin-new-btn" onClick={() => setShowForm((v) => !v)}>
          <PlusIcon /> Add User
        </button>
      </div>

      {showForm && (
        <form className="admin-card" onSubmit={createUser} style={{ marginBottom: 20 }}>
          <h3>
            <UserIcon /> New User
          </h3>
          <div className="admin-card-divider" />
          <div className="admin-feature-cols">
            <label>
              Full Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
          </div>
          <div className="admin-feature-cols">
            <label>
              Temporary Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </label>
            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Editor</option>
                <option>Administrator</option>
              </select>
            </label>
          </div>
          <button type="submit" className="primary-button admin-new-btn" disabled={saving} style={{ marginTop: 16 }}>
            {saving ? "Creating..." : "Create User"}
          </button>
        </form>
      )}

      <div className="admin-card admin-products-card">
        <div className="admin-table-wrapper flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td className="admin-table-name">
                    {u.name}
                    {u.email === currentEmail && <span className="admin-hint"> (you)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} className="admin-type-select">
                      <option>Editor</option>
                      <option>Administrator</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label="Remove user"
                      className="admin-btn-danger"
                      onClick={() => removeUser(u)}
                      disabled={u.email === currentEmail}
                      title={u.email === currentEmail ? "You can't remove your own account" : "Remove user"}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty-row">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
