import mongoose from 'mongoose';

const UserSchema = {
  email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String
	},
	phoneNumber: {
		type: String,
		required: true
	},
	createAt: {
		type: Date,
		default: new Date()
	}
}

const UserModel = mongoose.model('user', UserSchema);
export default UserModel;