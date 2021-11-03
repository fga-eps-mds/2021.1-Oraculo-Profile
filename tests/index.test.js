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
  departmentID: 0,
  level: 2,
  sectionID: 3,
};

const user1 = {
  name: "Silva",
  email: "useroraculo1@email.com",
  password: "oraculo12345",
  departmentID: 8,
  level: 2,
  sectionID: 0,
};

const anotherAdmin = {
  name: "Erick",
  email: "anotheradmin@gmail.com",
  password: "admin1234",
  departmentID: 4,
  level: 1,
  sectionID: 0,
};

const userInvalidInformation1 = {
  name: "Invalid User",
  email: "invalid@gmail.com",
  password: "admin1234",
  departmentID: 0,
  level: 1,
  sectionID: 0,
};

describe("Sub Test", () => {
  const test1 = 1;
  const test2 = 2;
  const { loadEnvironment } = require("../src/Database");

  it("Test empty database URL", (done) => {
    const result = loadEnvironment(test1);
    expect(result).toBe(null);
    done();
  });

  it("Test PROD environment var", (done) => {
    const result = loadEnvironment(test2);
    expect(result.dialectOptions).toBeDefined();
    done();
  });
});

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

  it("POST /register - should not create user (invalid section and department", async () => {
    const res = await request(app)
      .post("/register")
      .set("x-access-token", adminToken)
      .send(userInvalidInformation1);

    expect(res.statusCode).toEqual(400);
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
    expect(res.statusCode).toEqual(511);
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

    expect(res1.statusCode).toEqual(511);
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

  it("GET /departments - should return a list of all available departments", async () => {
    const res = await request(app).get("/departments");
    expect(res.statusCode).toEqual(200);
  });

  it("GET /sections - should return a list of all available sections", async () => {
    const res = await request(app).get("/sections");
    expect(res.statusCode).toEqual(200);
  });

  it("GET /levels - should return a list of all available user levels", async () => {
    const res = await request(app).get("/levels");
    expect(res.statusCode).toEqual(200);
  });

  it("POST /sections - should create a section", async () => {
    const res = await request(app)
      .post("/sections")
      .set("x-access-token", adminToken)
      .send({ name: 'teste', department_id: 1 });
    expect(res.statusCode).toEqual(200);
  });

  it("POST /sections - should not create a section", async () => {
    const res = await request(app)
      .post("/sections")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toEqual(400);
  });

  it("POST /departments - should create a department", async () => {
    const res = await request(app)
      .post("/departments")
      .set("x-access-token", adminToken)
      .send({ name: 'teste' });
    expect(res.statusCode).toEqual(200);
  });

  it("POST /departments - should not create a department", async () => {
    const res = await request(app)
      .post("/departments")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toEqual(400);
  });

  it("POST /departments/change-department/:id - should edit a department", async () => {
    const res = await request(app)
      .post("/departments/change-department/1")
      .set("x-access-token", adminToken)
      .send({ name: 'teste1' });
    expect(res.statusCode).toEqual(200);
  });

  it("POST /departments/change-department/:id - should not edit a department", async () => {
    const res = await request(app)
      .post("/departments/change-department/1")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toEqual(400);
  });

  it("POST /departments/change-department/:id - should not edit a department (no id)", async () => {
    const res = await request(app)
      .post("/departments/change-department/")
      .set("x-access-token", adminToken)
      .send({ name: 'teste1' });
    expect(res.statusCode).toEqual(400);
  });

  it("POST /sections/change-section/:id - should edit a section", async () => {
    const res = await request(app)
      .post("/sections/change-section/1")
      .set("x-access-token", adminToken)
      .send({ name: 'teste1' });
    expect(res.statusCode).toEqual(200);
  });

  it("POST /sections/change-section/:id - should not edit a section", async () => {
    const res = await request(app)
      .post("/sections/change-section/1")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toEqual(400);
  });

  it("POST /sections/change-section/:id - should not edit a section (no id)", async () => {
    const res = await request(app)
      .post("/sections/change-section/")
      .set("x-access-token", adminToken)
      .send({ name: 'teste1' });
    expect(res.statusCode).toEqual(400);
  });

  it("POST /user/change-password - should update a password", async () => {
    const res = await request(app)
      .post("/user/change-password")
      .set("x-access-token", adminToken)
      .send({ password: user1.password });
    expect(res.statusCode).toEqual(200);
  });

  it("POST /user/change-password - should not insert password", async () => {
    const res = await request(app)
      .post("/user/change-password")
      .set("x-access-token", adminToken)
      .send();
    expect(res.statusCode).toEqual(500);
  });

  it("POST /user/change-user - should not update user information", async () => {
    const res = await request(app)
      .post("/user/change-user")
      .set("x-access-token", adminToken)
      .send({
        name: "test",
        email: "mail",
      });

    expect(res.statusCode).toEqual(400);
  });

  it("POST /user/change-user - should not update user information (inexistent section)", async () => {
    const res = await request(app)
      .post("/user/change-user")
      .set("x-access-token", adminToken)
      .send({
        name: "test",
        email: "mail",
        section_id: 500,
      });

    expect(res.statusCode).toEqual(404);
  });

  it("POST /user/change-user - should update user information", async () => {
    const res = await request(app)
      .post("/user/change-user")
      .set("x-access-token", adminToken)
      .send({
        name: "test",
        email: "test@mail.com",
        section_id: 2,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
  });

  it("POST /user/change-user - should not update user information (invalid field type)", async () => {
    const res = await request(app)
      .post("/user/change-user")
      .set("x-access-token", adminToken)
      .send({
        name: null,
        email: "test@mail.com",
        section_id: 2,
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBeDefined();
  });

  it("GET /user/:id/info - should not return user info (invalid user id)", async () => {
    const id = NaN;
    const res = await request(app)
      .get(`/user/${id}/info`)
      .set("x-access-token", adminToken);

    expect(res.statusCode).toEqual(500);
  });

  it("GET /user/:id/info - should return all user info", async () => {
    const res = await request(app).get("/user/1/info").set("x-access-token", adminToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
  });

  it("GET /user/:id/info - should not return all user info", async () => {
    // login with a less privileged user
    const res = await request(app)
      .post("/login")
      .send({ email: user1.email, password: user1.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();

    let token = res.body.token;

    const res1 = await request(app).get("/user/1/info").set("x-access-token", token);
    expect(res1.statusCode).toEqual(200);
  });
});

afterAll((done) => {
  done();
});
