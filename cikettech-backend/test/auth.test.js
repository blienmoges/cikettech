const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

const EMAIL = "admin@cikettech.com";

describe("admin auth", () => {
  test("rejects an unknown email", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: "nobody@cikettech.com", password: "whatever123" });
    expect(res.status).toBe(401);
  });

  test("rejects the wrong password", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  test("issues a token for correct credentials", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: DEMO_PASSWORD });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user.email).toBe(EMAIL);
  });

  test("/me validates a real token and rejects a garbage one", async () => {
    const login = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: DEMO_PASSWORD });
    const token = login.body.token;

    const ok = await request(app).get("/api/admin/auth/me").set("Authorization", `Bearer ${token}`);
    expect(ok.status).toBe(200);
    expect(ok.body.user.email).toBe(EMAIL);

    const bad = await request(app).get("/api/admin/auth/me").set("Authorization", "Bearer not-a-real-token");
    expect(bad.status).toBe(401);
  });

  test("mutating admin routes require a token, reading them does not", async () => {
    const unauthedGet = await request(app).get("/api/admin/products");
    expect(unauthedGet.status).toBe(200);

    const unauthedPost = await request(app).post("/api/admin/products").send({ name: "No Token Product" });
    expect(unauthedPost.status).toBe(401);

    const login = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: DEMO_PASSWORD });
    const token = login.body.token;

    const authedPost = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "With Token Product", status: "Draft" });
    expect(authedPost.status).toBe(201);
    expect(authedPost.body.name).toBe("With Token Product");
  });

  test("password change requires the correct current password, then the new one logs in", async () => {
    const login = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: DEMO_PASSWORD });
    const token = login.body.token;

    const wrongCurrent = await request(app)
      .put("/api/admin/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "not-the-password", newPassword: "BrandNewPass123" });
    expect(wrongCurrent.status).toBe(401);

    const changed = await request(app)
      .put("/api/admin/auth/password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: DEMO_PASSWORD, newPassword: "BrandNewPass123" });
    expect(changed.status).toBe(200);

    const oldLogin = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: DEMO_PASSWORD });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: EMAIL, password: "BrandNewPass123" });
    expect(newLogin.status).toBe(200);
  });

  test("forgot-password issues a token that reset-password can consume", async () => {
    const forgot = await request(app).post("/api/admin/auth/forgot-password").send({ email: EMAIL });
    expect(forgot.status).toBe(200);

    // The token isn't emailed anywhere reachable in tests (no email provider is
    // configured), so exercise the consume path directly against the store.
    const { createResetToken, consumeResetToken } = require("../src/data/admin/passwordResets");
    const token = createResetToken(EMAIL);

    const badReset = await request(app)
      .post("/api/admin/auth/reset-password")
      .send({ token: "garbage-token", password: "AnotherNewPass123" });
    expect(badReset.status).toBe(400);

    const goodReset = await request(app)
      .post("/api/admin/auth/reset-password")
      .send({ token, password: "AnotherNewPass123" });
    expect(goodReset.status).toBe(200);

    const reusedToken = consumeResetToken(token);
    expect(reusedToken).toBeNull();
  });
});
