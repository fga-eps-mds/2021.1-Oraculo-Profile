const User = require("../Model/User");
const crypto = require("crypto");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
const { options } = require("../Model/User");

async function createUser(req, res) {
	if (
		!req.body.password &&
		!req.body.email &&
		!req.body.departmentID &&
		!req.body.level &&
		!req.body.sectionID
	) {
		return res.status(400).send({
			message: "error users could , all fields are required!",
		});
	}

	try {
		const user = {
			permission: req.body.permission,
			password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
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

		if (!department || !level) {
			return res.status(401).send({ error: "invalid department or level" });
		}

		let newUser = await User.create({
			email: user.email,
			password: user.password,
		});

		if (!newUser) {
			return res.status(500).send({ error: "could not insert user" });
		}

		await newUser.addDepartment(department);
		await newUser.addLevel(level);

		return res.status(200).send(newUser);
	} catch (error) {
		console.log(`failed to create user: ${error}`);
		return res.status(400).json({ error: "could not create user" });
	}
}

async function loginUser(req, res) {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("All input is required");
		}

		const user = await User.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign({ user_id: user._id, email }, process.env.SECRET, {
				expiresIn: "1h",
			});

			user.token = token;

			res.status(200).json(user);
		}

		res.status(400).send("Invalid Credentials");
	} catch (err) {
		console.log(err);
	}
}

async function listUsers(req, res) {
	try {
	} catch (error) {}
}

module.exports = {
	createUser,
	loginUser,
	listUsers,
};
