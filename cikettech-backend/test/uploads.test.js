const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

async function adminToken() {
  const response = await request(app)
    .post("/api/admin/auth/login")
    .send({ email: "admin@cikettech.com", password: DEMO_PASSWORD });
  return response.body.token;
}

describe("admin upload validation", () => {
  test("rejects disallowed extensions and MIME types", async () => {
    const token = await adminToken();
    const response = await request(app)
      .post("/api/admin/uploads")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("not an executable"), { filename: "malware.exe", contentType: "application/octet-stream" });
    expect(response.status).toBe(400);
  });

  test("rejects a file whose bytes do not match its declared image type", async () => {
    const token = await adminToken();
    const response = await request(app)
      .post("/api/admin/uploads")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("not a png"), { filename: "fake.png", contentType: "image/png" });
    expect(response.status).toBe(400);
  });

  test("accepts a valid PNG", async () => {
    const token = await adminToken();
    const pngHeader = Buffer.from("89504e470d0a1a0a", "hex");
    const response = await request(app)
      .post("/api/admin/uploads")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", pngHeader, { filename: "pixel.png", contentType: "image/png" });
    expect(response.status).toBe(201);
  });
});
