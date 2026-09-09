const request = require("supertest");
const app = require("../src/app");
const { DEMO_PASSWORD } = require("../src/data/admin/users");

async function getToken() {
  const res = await request(app)
    .post("/api/admin/auth/login")
    .send({ email: "admin@cikettech.com", password: DEMO_PASSWORD });
  return res.body.token;
}

describe("AI assistant is driven by the admin-editable knowledge base", () => {
  test("answers a question using a seeded, published knowledge base entry", async () => {
    const res = await request(app)
      .post("/api/assistant/message")
      .send({ text: "What does CIKETTECH do?" });
    expect(res.status).toBe(200);
    expect(res.body.reply).toMatch(/designs, develops, and manufactures/i);
  });

  test("falls back to a generic reply when no knowledge base entry matches", async () => {
    const res = await request(app)
      .post("/api/assistant/message")
      .send({ text: "zxqvbnm completely unrelated gibberish" });
    expect(res.status).toBe(200);
    expect(res.body.reply).not.toMatch(/designs, develops, and manufactures/i);
  });

  test("does not use a Draft knowledge base entry", async () => {
    const token = await getToken();

    const created = await request(app)
      .post("/api/admin/knowledge-base")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Warranty Policy",
        contentType: "FAQ",
        related: "Global (Applies to all)",
        status: "Draft",
        questionEn: "What is the warranty policy for CIKETTECH products?",
        answerEn: "All CIKETTECH hardware ships with a 3-year limited warranty.",
      });
    const id = created.body.id;

    const draftReply = await request(app)
      .post("/api/assistant/message")
      .send({ text: "What is the warranty policy?" });
    expect(draftReply.body.reply).not.toMatch(/3-year limited warranty/);

    await request(app)
      .put(`/api/admin/knowledge-base/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Published" });

    const publishedReply = await request(app)
      .post("/api/assistant/message")
      .send({ text: "What is the warranty policy?" });
    expect(publishedReply.body.reply).toMatch(/3-year limited warranty/);
  });

  test("editing a published entry's answer changes the assistant's live reply", async () => {
    const token = await getToken();

    const created = await request(app)
      .post("/api/admin/knowledge-base")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Shipping Times",
        contentType: "FAQ",
        related: "Global (Applies to all)",
        status: "Published",
        questionEn: "How long does shipping take for CIKETTECH orders?",
        answerEn: "Original shipping answer.",
      });
    const id = created.body.id;

    const before = await request(app)
      .post("/api/assistant/message")
      .send({ text: "How long does shipping take?" });
    expect(before.body.reply).toBe("Original shipping answer.");

    await request(app)
      .put(`/api/admin/knowledge-base/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ answerEn: "Updated shipping answer via admin edit." });

    const after = await request(app)
      .post("/api/assistant/message")
      .send({ text: "How long does shipping take?" });
    expect(after.body.reply).toBe("Updated shipping answer via admin edit.");
  });
});
