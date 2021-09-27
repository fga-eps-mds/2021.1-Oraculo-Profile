const { User } = require("../Model/User");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
const { Section } = require("../Model/Section");
const { hashPassword } = require("../Utils/hash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const privilegeTypes = {
	admin: 1,
	common: 2,
};

async function createUser(req, res) {
	if (
		!req.body.password ||
		!req.body.email ||
		!req.body.departmentID ||
		!req.body.level ||
		!req.body.sectionID
	) {
		return res.status(400).send({
			error: "lacks of information to register user",
		});
	}

	try {
		const rawPassword = req.body.password;

		const user = {
			permission: req.body.permission,
			password: await hashPassword(rawPassword),
			email: req.body.email,
			departmentID: req.body.departmentID,
			levelID: req.body.level,
			sectionID: req.body.sectionID,
		};

		// Search for user department and level
		const department = await Department.findOne({
			where: { id: user.departmentID },
		});

		const level = await Level.findOne({
			where: { id: user.levelID },
		});

		const section = await Section.findOne({ where: { id: user.sectionID } });
		if (!department || !level || !section) {
			return res.status(401).send({ error: "invalid user information provided" });
		}

		const newUser = await User.create({
			email: user.email,
			password: user.password,
		});

		if (!newUser) {
			return res.status(500).send({ error: "could not insert user" });
		}

		await newUser.addDepartment(department);
		await newUser.addLevel(level);
		await newUser.addSection(section);

		return res.status(200).send(newUser);
	} catch (error) {
		console.log(`failed to create user: ${error}`);
		return res.status(400).json({ error: "could not create user" });
	}
}

async function loginUser(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "missing login information" });
		}

		const user = await User.findOne({ where: { email: email } });

		if (user == null) {
			return res.status(401).json({ error: "invalid email or password" });
		}

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign({ user_id: user.id, email }, process.env.SECRET, {
				expiresIn: "1h",
			});

			return res.status(200).json({ auth: true, token });
		}

		return res.status(401).json({ error: "invalid credentials" });
	} catch (err) {
		console.error(`could not perform login: ${err}`);
		return res.status(500).json({ error: "could not login user" });
	}
}

async function getUsersList(req, res) {
	try {
		const user = await User.findByPk(req.decoded.user_id, {
			include: {
				association: "levels",
			},
			where: { email: req.decoded.email },
		});

		if (!user) {
			return res.status(401).json({ error: "invalid user" });
		}

		const level = user.levels[0];

		if (level.id == privilegeTypes.admin) {
			const allUsers = await User.findAll({ attributes: ["email", "created_at"] });
			if (!allUsers) {
				throw "could not find all users";
			}

			return res.status(200).json(allUsers);
		}

		return res
			.status(401)
			.json({ error: "you don't have permissions to list all users" });
	} catch (err) {
		console.log(`server error: ${err}`);
		return res.status(500).json({ error: "could not get users list" });
	}
}

module.exports = {
	createUser,
	loginUser,
	getUsersList,
};
