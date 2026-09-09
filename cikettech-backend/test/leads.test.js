const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

async function getToken() {
  const res = await request(app)
    .post("/api/admin/auth/login")
    .send({ email: "admin@cikettech.com", password: DEMO_PASSWORD });
  return res.body.token;
}

describe("public lead capture reaches the admin inquiries collection", () => {
  test("a quote request creates a Sales Inquiry admins can see", async () => {
    const submit = await request(app).post("/api/quote").send({
      name: "Lead Tester",
      email: "lead@example.com",
      product: "Smart Day Counter",
      org: "Test Co",
      message: "Need pricing for 5 units",
    });
    expect(submit.status).toBe(201);
    const id = submit.body.inquiry.id;

    const token = await getToken();
    const list = await request(app).get("/api/admin/inquiries").set("Authorization", `Bearer ${token}`);
    const found = list.body.find((i) => i.id === id);
    expect(found).toBeTruthy();
    expect(found.type).toBe("Sales Inquiry");
    expect(found.product).toBe("Smart Day Counter");
    expect(found.status).toBe("New");
  });

  test("quote requests are validated", async () => {
    const res = await request(app).post("/api/quote").send({ name: "No Email Or Product" });
    expect(res.status).toBe(400);
  });

  test("a contact form submission also creates an inquiry", async () => {
    const submit = await request(app).post("/api/contact").send({
      firstName: "Contact",
      lastName: "Tester",
      email: "contact@example.com",
      company: "Test Co",
      message: "General question",
      category: "General",
    });
    expect(submit.status).toBe(201);

    const token = await getToken();
    const list = await request(app).get("/api/admin/inquiries").set("Authorization", `Bearer ${token}`);
    const found = list.body.find((i) => i.email === "contact@example.com");
    expect(found).toBeTruthy();
    expect(found.type).toBe("General");
  });
});
