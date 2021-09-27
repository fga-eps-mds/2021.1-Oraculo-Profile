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

	const adminUser = {
		email: "admin@email.com",
		password: "admin1234",
		departmentID: 1,
		level: 1,
		sectionID: 2,
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

	it("POST /register - create admin user", async () => {
		const res = await request(app).post("/register").send(adminUser);
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

	it("POST /test - post with token", async () => {
		const res = await request(app).post("/test").set("x-access-token", token);
		expect(res.statusCode).toBe(404);
	});

	it("POST /users/all - should not retrieve users list", async () => {
		const res = await request(app).post("/users/all");
		expect(res.statusCode).toEqual(401);
	});

	it("POST /users/all - post without valid token", async () => {
		const res = await request(app).post("/users/all").set("x-access-token", "invalid");
		expect(res.statusCode).toEqual(500);
	});

	it("POST /users/all - post without token", async () => {
		const res = await request(app).post("/users/all");
		expect(res.statusCode).toEqual(401);
	});

	it("POST /users/all - should retrieve users list", async () => {
		// login first
		const res = await request(app).post("/login").send({
			email: adminUser.email,
			password: adminUser.password,
		});

		// list users
		const res1 = await request(app)
			.post("/users/all")
			.set("x-access-token", res.body.token)
			.send();

		expect(res1.statusCode).toEqual(200);
	});

	it("POST /users/all - test with a less privileged user", async () => {
		const res = await request(app).post("/login").send({
			email: user.email,
			password: user.password,
		});

		const res1 = await request(app)
			.post("/users/all")
			.set("x-access-token", res.body.token)
			.send();

		expect(res1.statusCode).toEqual(401);
	});
});

afterAll((done) => {
	done();
});
