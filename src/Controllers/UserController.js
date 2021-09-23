const { application } = require("express");
const db = require("../Models/User");
const Users = db.users;

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
			password: req.body.password,
			email: req.body.email,
			departmentID: req.body.departmentID,
			level: req.body.level,
			sectionID: req.body.sectionID,
		};

		let createdUser = Users.create(user)
			.then((data) => {
				res.send(data);
			})
			.catch((err) => {
				console.error(`Failed to create user: ${err}`);
				return res
					.status(500)
					.json({ message: "could not insert user into database" });
			});

		return res.status(200).send(createdUser);
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
