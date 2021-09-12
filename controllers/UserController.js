import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import errorMap from '../util/errorMap.js';
import User from '../models/User.js';
import validateFields from '../util/validation.js';

import Name from '../value_objects/Name.js';
import PhoneNumber from '../value_objects/PhoneNumber.js';
import EmailAddress from '../value_objects/EmailAddress.js';
import Password from '../value_objects/Password.js';

class UserController {
  async signUp(req, res) {
		const { firstName, lastName, email, phoneNumber, password } = req.body;
		const fieldsToValidate = [
			{
				name: 'имя',
				value: firstName,
				valueObject: Name
			},
			{
				name: 'фамилия',
				value: lastName,
				valueObject: Name
			},
			{
				name: 'номер телефона',
				value: phoneNumber,
				valueObject: PhoneNumber
			},
			{
				name: 'электронный адрес',
				value: email,
				valueObject: EmailAddress
			},
			{
				name: 'пароль',
				value: password,
				valueObject: Password
			}
		]

		const validationErrors = validateFields(fieldsToValidate)
		if (validationErrors.length) {
			return res.send({ success: false, errors: validationErrors })
		}

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
	async signOut(req, res) {

		req.logOut()
		return res.send({ success: true })
	  }
	
	  async updateUser(req, res) {
		const { id } = req.user
		const { propsToUpdate } = req.body

		// validation
		const fieldsToValidate = [{
		  name: 'имя',
		  value: propsToUpdate.firstName,
		  valueObject: Name
		}, {
		  name: 'фамилия',
		  value: propsToUpdate.lastName,
		  valueObject: Name
		}]
	
		const validationErrors = validateFields(fieldsToValidate)
		if (validationErrors.length) {
		  return res.send({ success: false, errors: validationErrors })
		}
	
		const user = await User.findOne({ _id: id })
		if (!user) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.userNotFound }] })
		}
	  
		user.firstName = propsToUpdate.firstName
		user.lastName = propsToUpdate.lastName
	
		try {
		  await user.save()
		  return res.send({ success: true, user: propsToUpdate})
		} catch {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.userData }] })
		}
	  }
	
	  async updatePhone(req, res) {
		const { id } = req.user
		const phone = req.body.phone

		// validation
		const fieldsToValidate = [{
		  name: 'Номер телефона',
		  value: phone,
		  valueObject: PhoneNumber
		}]
	
		const validationErrors = validateFields(fieldsToValidate)
		if (validationErrors.length) {
		  return res.send({ success: false, errors: validationErrors })
		}
	
		const user = await User.findOne({ _id: id })
		if (!user) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.userNotFound }] })
		}
	
		user.phoneNumber = phone
	
		try {
		  await user.save()
		  return res.send({ success: true })
		} catch {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.phone }] })
		}
	  }
	
	  async updatePassword(req, res) {
		const { id } = req.user
		const { newPassword, currentPassword } = req.body
	
		// validation
		const fieldsToValidate = [{
		  name: 'пароль',
		  value: newPassword,
		  valueObject: Password
		}]
	
		const validationErrors = validateFields(fieldsToValidate)
		if (validationErrors.length) {
		  return res.send({ success: false, errors: validationErrors })
		}
	
		const user = await User.findOne({ _id: id })
		if (!user) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.userNotFound }] })
		}
	
		const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
		if (!isPasswordCorrect) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.password }] })
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10)
		user.password = hashedPassword
		try {
		  user.save()
		  return res.send({ success: true })
		} catch {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.password }] })
		}
	  }
	
	  async updateEmail(req, res) {
		const { id } = req.user
		const newEmail = req.body.email

		// validation
		const fieldsToValidate = [{
		  name: 'электронный адрес',
		  value: newEmail,
		  valueObject: EmailAddress
		}]
	
		const validationErrors = validateFields(fieldsToValidate)
		if (validationErrors.length) {
		  return res.send({ success: false, errors: validationErrors })
		}
	
		const user = await User.findOne({ _id: id })
		if (!user) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.userNotFound }] })
		}
		user.email = newEmail
	
		try {
		  user.save()
		  return res.send({ success: true, newEmail})
		} catch {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.email }] })
		}
	  }
	
	  async deleteUser(req, res) {
		const { id } = req.user
	
		const user = await User.findOne({ _id: id })
		if (!user) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.userNotFound }] })
		}
	
		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
		if (!isPasswordCorrect) {
		  return res.send({ success: false, errors: [{ message: errorMap.user.updateFailed.password }] })
		}
		
		try {
		  await User.deleteOne({ _id: id })
		  res.send({ success: true })
		} catch {
		  res.send({ success: false, errors: [{ message: errorMap.user.userNotDeleted }] })
		}
	  }
}

export default UserController;
