const app = require("../src");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { initializeDatabase } = require("../src/Database");

describe("Main test", () => {
	const user = {
		email: "test1@gmail.com",
		password: "password123",
		departmentID: 2,
		level: 0,
		sectionID: 1,
	};

	beforeAll(async () => {
		await request(app).post("/register").send({ user });
		await initializeDatabase();
	});

	it("Test express server app", (done) => {
		expect(app).toBeDefined();
		done();
	});

	it("Test register route", async () => {
		const res = await request(app).post("/register").send(user);
		expect(res.statusCode).toEqual(401);
		return;
	});

	it("Test login route", async () => {
		const res = await request(app)
			.post("/login")
			.send({ email: "user@gmail.com", password: "12345" });
	});
});

afterAll((done) => {
	done();
});
