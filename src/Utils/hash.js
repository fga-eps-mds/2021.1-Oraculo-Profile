const bcrypt = require("bcrypt");

async function hashPassword(pass, saltRounds = 10) {
	const salt = await bcrypt.genSalt(saltRounds);
	return bcrypt.hash(pass, salt);
}

module.exports = { hashPassword };
