const app = require("../src");
const request = require("supertest");
const db = require("../src/Database");
const { listUsers } = require("../src/Controller/UserController");

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

test("find 1 users", async () => {
  const result = await listUsers.findAll(1);
  expect(result.length).toEqual(1);
});

describe("Test login route", () => {
  it("POST /login", async () => {
    const res = await request(app).post("/login");
    expect(res.statusCode).toEqual(401);
  });
});

describe("Test register user", () => {
  it("POST /register", async () => {
    const res = await request(app).post("/register");
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBe(user.password);
    expect(res.body.department).toBe(user.department);
    expect(res.body.level).toBe(user.level);
    expect(res.body.sectionID).toBe(user.sectionID);
  });
});

describe("Test database client setup", () => {
  it("Should start database client", async () => {
    const data = await db.initializeDatabase();
    expect(data).toEqual(0);
  });
});
