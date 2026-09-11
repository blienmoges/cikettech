const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

async function getToken() {
  const res = await request(app)
    .post("/api/admin/auth/login")
    .send({ email: "admin@cikettech.com", password: DEMO_PASSWORD });
  return res.body.token;
}

describe("admin products CRUD", () => {
  test("list returns the seeded products", async () => {
    const token = await getToken();
    const res = await request(app).get("/api/admin/products").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("full create -> read -> update -> delete lifecycle persists through the database", async () => {
    const token = await getToken();
    const auth = (req) => req.set("Authorization", `Bearer ${token}`);

    const created = await auth(request(app).post("/api/admin/products")).send({
      name: "Test Lifecycle Widget",
      status: "Draft",
      snippet: "A widget created by the automated test suite.",
    });
    expect(created.status).toBe(201);
    const id = created.body.id;
    expect(id).toBeTruthy();

    const fetched = await auth(request(app).get(`/api/admin/products/${id}`));
    expect(fetched.status).toBe(200);
    expect(fetched.body.name).toBe("Test Lifecycle Widget");

    const updated = await auth(request(app).put(`/api/admin/products/${id}`)).send({ status: "Published" });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("Published");
    expect(updated.body.id).toBe(id); // id must never change on update

    const deleted = await auth(request(app).delete(`/api/admin/products/${id}`));
    expect(deleted.status).toBe(200);

    const afterDelete = await auth(request(app).get(`/api/admin/products/${id}`));
    expect(afterDelete.status).toBe(404);
  });

  test("unauthenticated create, update, and delete are all rejected", async () => {
    const create = await request(app).post("/api/admin/products").send({ name: "Should Fail" });
    expect(create.status).toBe(401);

    const update = await request(app).put("/api/admin/products/1").send({ status: "Published" });
    expect(update.status).toBe(401);

    const remove = await request(app).delete("/api/admin/products/1");
    expect(remove.status).toBe(401);
  });
});

describe("settings", () => {
  test("reading and writing settings require a token", async () => {
    const get = await request(app).get("/api/admin/settings");
    expect(get.status).toBe(401);

    const token = await getToken();
    const authenticatedGet = await request(app)
      .get("/api/admin/settings")
      .set("Authorization", `Bearer ${token}`);
    expect(authenticatedGet.status).toBe(200);
    expect(authenticatedGet.body.email).toBeTruthy();

    const unauthedPut = await request(app).put("/api/admin/settings").send({ name: "Hacker" });
    expect(unauthedPut.status).toBe(401);

    const authedPut = await request(app)
      .put("/api/admin/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Admin Name" });
    expect(authedPut.status).toBe(200);
    expect(authedPut.body.name).toBe("Updated Admin Name");
  });
});

describe("public content endpoints", () => {
  test("only published news/projects/awards are exposed publicly", async () => {
    const news = await request(app).get("/api/news");
    expect(news.status).toBe(200);
    expect(news.body.every((n) => n.status === "Published")).toBe(true);

    const projects = await request(app).get("/api/projects");
    expect(projects.status).toBe(200);
    expect(projects.body.every((p) => p.status === "Published" && p.visibility !== "Internal")).toBe(true);

    const awards = await request(app).get("/api/awards");
    expect(awards.status).toBe(200);
    expect(awards.body.every((a) => a.status === "Published")).toBe(true);
  });

  test("an unpublished/nonexistent id 404s on the public endpoint", async () => {
    const res = await request(app).get("/api/news/999999");
    expect(res.status).toBe(404);
  });
});
