const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

const ADMIN_EMAIL = "admin@cikettech.com";
const EDITOR_EMAIL = "editor@cikettech.com";
const EDITOR_PASSWORD = "EditorPass123";

async function login(email, password) {
  const res = await request(app).post("/api/admin/auth/login").send({ email, password });
  return res.body.token;
}

async function adminToken() {
  return login(ADMIN_EMAIL, DEMO_PASSWORD);
}

describe("user management is Administrator-only", () => {
  test("a non-Administrator cannot list, create, or manage users", async () => {
    const noToken = await request(app).get("/api/admin/users");
    expect(noToken.status).toBe(401);

    const token = await adminToken();
    // Create an Editor to test with.
    const created = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: EDITOR_EMAIL, password: EDITOR_PASSWORD, name: "Test Editor", role: "Editor" });
    expect(created.status).toBe(201);
    expect(created.body.role).toBe("Editor");

    const editorToken = await login(EDITOR_EMAIL, EDITOR_PASSWORD);
    const editorListsUsers = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${editorToken}`);
    expect(editorListsUsers.status).toBe(403);
  });

  test("Administrator can list users and see the new Editor", async () => {
    const token = await adminToken();
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.some((u) => u.email === EDITOR_EMAIL)).toBe(true);
    // Password hashes must never be exposed.
    expect(res.body.every((u) => !("passwordHash" in u))).toBe(true);
  });

  test("cannot demote or delete the last Administrator", async () => {
    const token = await adminToken();

    const demote = await request(app)
      .patch(`/api/admin/users/${ADMIN_EMAIL}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "Editor" });
    expect(demote.status).toBe(400);

    const deleteSelf = await request(app)
      .delete(`/api/admin/users/${ADMIN_EMAIL}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteSelf.status).toBe(400);
  });

  test("Administrator can delete the Editor account", async () => {
    const token = await adminToken();
    const res = await request(app)
      .delete(`/api/admin/users/${EDITOR_EMAIL}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

describe("Editors can create/edit content but not delete it", () => {
  const EDITOR2_EMAIL = "editor2@cikettech.com";
  const EDITOR2_PASSWORD = "EditorPass123";
  let editorToken;
  let productId;

  beforeAll(async () => {
    const token = await adminToken();
    await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: EDITOR2_EMAIL, password: EDITOR2_PASSWORD, name: "Editor Two", role: "Editor" });
    editorToken = await login(EDITOR2_EMAIL, EDITOR2_PASSWORD);
  });

  test("Editor can create and update a product", async () => {
    const created = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${editorToken}`)
      .send({ name: "Editor Created Product", status: "Draft" });
    expect(created.status).toBe(201);
    productId = created.body.id;

    const updated = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set("Authorization", `Bearer ${editorToken}`)
      .send({ status: "Published" });
    expect(updated.status).toBe(200);
  });

  test("Editor cannot delete a product", async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set("Authorization", `Bearer ${editorToken}`);
    expect(res.status).toBe(403);
  });

  test("Administrator can delete the same product", async () => {
    const token = await adminToken();
    const res = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
