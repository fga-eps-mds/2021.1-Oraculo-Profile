const app = require("../src");
const request = require("supertest");
const { initializeDatabase } = require("../src/Database");

const adminUser = {
  name: "Carlos",
  email: "admin@email.com",
  password: "admin1234",
  departmentID: 1,
  level: 1,
  sectionID: 2,
};

const userInvalidInformation = {
  name: "John",
  email: "blabla@hotmail.com",
  password: "password",
  departmentID: -1,
  level: 100,
  sectionID: 3,
};

const user = {
  name: "Jane",
  email: "useroraculo@email.com",
  password: "oraculo123",
  departmentID: 3,
  level: 2,
  sectionID: 3,
};

const user1 = {
  name: "Silva",
  email: "useroraculo1@email.com",
  password: "oraculo12345",
  departmentID: 3,
  level: 2,
  sectionID: 3,
};

const anotherAdmin = {
  name: "Erick",
  email: "anotheradmin@gmail.com",
  password: "admin1234",
  departmentID: 4,
  level: 1,
  sectionID: 1,
};

describe("Main test", () => {
  let adminToken = "";

  beforeAll(async () => {
    await initializeDatabase();
    const res = await request(app)
      .post("/login")
      .send({ email: adminUser.email, password: adminUser.password });

    expect(res.statusCode).toBe(200);
    adminToken = res.body.token;
    expect(adminToken).toBeDefined();
  });

  it("Test if we have a token", (done) => {
    expect(adminToken).toBeDefined();
    done();
  });

  it("Test express server app", (done) => {
    expect(app).toBeDefined();
    done();
  });

  it("POST /register - should create a user", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(user);

    expect(res.statusCode).toBe(200);
  });

  it("POST /register - shoud not create invalid user", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(userInvalidInformation);
    expect(res.statusCode).toEqual(400);
  });

  it("POST /register - should not create because user already exists", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(user);

    expect(res.statusCode).toEqual(500);
  });

  it("POST /register - should not create user because doesn't have all needed fields", async () => {
    const incompleteUser = {
      email: "tester@email.com",
    };

    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(incompleteUser);

    expect(res.statusCode).toEqual(400);
  });

  it("POST /register - should create a new user", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(user1);
    expect(res.statusCode).toEqual(200);
  });

  it("POST /register - should create another admin user", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(anotherAdmin);
    expect(res.statusCode).toEqual(200);
  });

  it("POST /login - should login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: user1.email, password: user1.password });

    expect(res.statusCode).toBe(200);
  });

  it("POST /login - inexistent user", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "user@gmail.com", password: "12345" });

    expect(res.statusCode).toBe(401);
  });

  it("POST /login - should not login (invalid credentials)", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: user1.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
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

  it("GET /users/all - should not retrieve users list (no admin token)", async () => {
    const res = await request(app).get("/users/all");
    expect(res.statusCode).toEqual(401);
  });

  it("GET /users/all - post without valid token", async () => {
    const res = await request(app).get("/users/all").set("x-access-token", "invalid");
    expect(res.statusCode).toEqual(500);
  });

  it("GET /users/all - should retrieve users list", async () => {
    // list users
    const res = await request(app)
      .get("/users/all")
      .set("x-access-token", adminToken)
      .send();

    expect(res.statusCode).toEqual(200);
  });

  it("GET /users/all - should not list users (more privileges needed)", async () => {
    const res = await request(app).post("/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);

    const res1 = await request(app)
      .get("/users/all")
      .set("x-access-token", res.body.token)
      .send();

    expect(res1.statusCode).toEqual(401);
  });

  it("GET /users/all - should not list users (invalid token)", async () => {
    const res1 = await request(app)
      .get("/users/all")
      .set("x-access-token", "my_invalid_token_123")
      .send();

    expect(res1.statusCode).toEqual(500);
  });

  it("GET /user/access-level - should return user access level", async () => {
    const res = await request(app)
      .get("/user/access-level")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toBe(200);
  });

  it("GET /user/info - should return information of admin user", async () => {
    const res = await request(app).get("/user/info").set("X-Access-Token", adminToken);
    expect(res.statusCode).toEqual(200);
  });

  it("POST /user/rest - should update a password", async () => {
    const res = await request(app)
      .post("/user/reset")
      .set("x-access-token", adminToken)
      .send(user1.password);

    expect(res.statusCode).toBe(200);
  });

  it("POST /user/reset - invalid user", async () => {
    const res = await request(app)
      .post("/user/reset")
      .set("x-access-token", adminToken)
      .send(user1.email);
    expect(res.statusCode).toEqual(400);
  });
});

afterAll((done) => {
  done();
});
