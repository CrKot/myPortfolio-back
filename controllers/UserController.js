import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import errorMap from '../util/errorMap.js';
import User from '../models/User.js';

class UserController {
  async signUp(req, res) {
		const { firstName, lastName, email, phoneNumber, password } = req.body;

		const user = await User.findOne({ email: email });
		if (user) {
			return res.send({ success: false, errors: [{ message: errorMap.emailIsTaken }] })
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			phoneNumber,
			password: hashedPassword,
		});

		return res.send({ success: true, userId: newUser._id });
	}

	async signIn(req, res, next) {
		passport.authenticate('local', { session: false }, (err, user, info) => {
			if (err) {
				throw err
			}
			if (!user) {
				return res.send({ success: false, errors: [{ message: info }] });
			}

			const token = jwt.sign({ id: user.id, email: user.email }, process.env.SESSION_SECRET);

			return res.send({ token });
		})(req, res, next)
	}
	async getUser(req, res) {
		const { id: userId } = req.user;

		const user = await User.findOne({ _id: userId });
		if (!user) {
			return res.send({ success: false, errors: [{ message: errorMap.userNotFound }] });
		}
		return res.send({ user })
	}
}

export default UserController;
