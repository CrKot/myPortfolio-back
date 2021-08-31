import mongoose from 'mongoose';

const mongooseConection = async() => {
	await mongoose.connect(process.env.DB_CONNECTION, {
		auth: {
			authdb: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		},
		authSource:"admin",
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected mongodb');
	})
	.catch((e) => console.error(e))
}

export default mongooseConection;