const request = require("supertest");
const app = require("../src/app");

describe("CORS", () => {
  test("allows credentialed requests from configured frontend origins", async () => {
    const response = await request(app)
      .options("/api/analytics/events")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");

    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });
});