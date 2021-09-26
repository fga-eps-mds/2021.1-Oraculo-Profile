const app = require("../src");
const request = require("supertest");
const db = require("../src/Database");

const user = {
	email: `${Math.random().toString(36).substr(2, 5)}@gmail.com`,
	password: "123456",
	department: 3,
	level: 4,
	sectionID: 2,
};

test("Test express server app", (done) => {
	expect(app).toBeDefined();
	done();
});

describe("Test login route", () => {
	it("POST /login", async () => {
		const res = await request(app).post("/login");
		expect(res.statusCode).toEqual(401);
	});
});

describe("Test register user", () => {
	it("POST /register", async () => {
		// post without data should not
		const res = await request(app).post("/register");
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("error users could , all fields are required!");
	});
});

describe("Test database client setup", () => {
	it("Should start database client", async () => {
		const data = await db.initializeDatabase();
		expect(data).toEqual(0);
	});
});
