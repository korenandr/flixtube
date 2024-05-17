const request = require("supertest");
const app = require("../src/index");

describe("video storage microservice", () => {

    test("microservice can handle requests", async () => {

        const response = await request(app).get("/live");
        expect(response.status).toBe(200);
    });

    test("upload route is handled", async () => {

        const response = await request(app).post("/upload");
        expect(response.status).toBe(200);
    });
});