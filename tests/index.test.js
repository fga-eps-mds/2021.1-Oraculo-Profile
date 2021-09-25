const db = require("../src/Database");

test("Initialize database client", () => {
	return db.initializeDatabase().then(
		(ok) => {
			expect(ok).toBe(0);
		},
		(err) => {
			expect(err).toBe(1);
		}
	);
});
