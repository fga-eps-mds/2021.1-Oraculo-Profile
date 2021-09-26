const app = require("../src");
const request = require("supertest");
const { verifyJWT } = require("../src/Utils/JWT");
const { initializeDatabase } = require("../src/Database");
const express = require("express");
const jwt = require("jsonwebtoken");

describe("Main test", () => {
	const newRoutes = express.Router();
	newRoutes.post("/test", verifyJWT);
	app.use(newRoutes);

	const token = jwt.sign({ name: "Teste", description: "Teste" }, process.env.SECRET, {
		expiresIn: 240,
	});

	const user = {
		email: "useroraculo@email.com",
		password: "oraculo123",
		departmentID: 3,
		level: 2,
		sectionID: 3,
	};

	const user1 = {
		email: "useroraculo1@email.com",
		password: "oraculo12345",
		departmentID: 3,
		level: 2,
		sectionID: 3,
	};

	beforeAll(async () => {
		await initializeDatabase();
		await request(app).post("/register").send(user);
		return;
	});

	it("Test express server app", (done) => {
		expect(app).toBeDefined();
		done();
		return;
	});

	it("POST /register - should not create because user already exists", async () => {
		const res = await request(app).post("/register").send(user);
		expect(res.statusCode).toEqual(400);
		return res;
	});

	it("POST /register - without all needed fields", async () => {
		const incompleteUser = {
			email: "tester@email.com",
		};

		const res = await request(app).post("/register").send(incompleteUser);
		expect(res.statusCode).toEqual(400);
		return res;
	});

	it("POST /register - create a new user", async () => {
		const res = await request(app).post("/register").send(user1);
		expect(res.statusCode).toEqual(200);
	});

	it("POST /login - should login", async () => {
		const res = await request(app)
			.post("/login")
			.send({ email: user.email, password: user.password });

		expect(res.statusCode).toBe(200);
		return res;
	});

	it("POST /login - inexistent user", async () => {
		const res = await request(app)
			.post("/login")
			.send({ email: "user@gmail.com", password: "12345" });

		expect(res.statusCode).toBe(401);
		return res;
	});

	it("POST /login - should not login (invalid credentials)", async () => {
		const res = await request(app)
			.post("/login")
			.send({ email: user.email, password: "wrongpassword" });

		expect(res.statusCode).toBe(401);
		return res;
	});

	it("POST /login - without password field", async () => {
		const res = await request(app).post("/login").send({ email: user.email });
		expect(res.statusCode).toBe(400);
		return;
	});

	it("POST /login - invalid field type", async () => {
		const res = await request(app).post("/login").send({});
		expect(res.statusCode).toBe(400);
		return;
	});

	it("POST /test - post without token", async () => {
		const res = await request(app).post("/test");
		expect(res.statusCode).toBe(401);
	});

	it("POST /test - post without token", async () => {
		const res = await request(app).post("/test").set("x-access-token", token);
		expect(res.statusCode).toBe(404);
	});
});

afterAll((done) => {
	done();
});
