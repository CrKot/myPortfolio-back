import mongoose from 'mongoose';

const mongooseConection = async(DBtype) => {
	if (DBtype) {
		const uri = `mongodb+srv://${process.env.DB_USER_CLOUD}:${process.env.DB_PASSWORD_CLOUD}@cluster0.ejq9e.mongodb.net/${process.env.DB_NAME_CLOUD}?retryWrites=true&w=majority`
		await mongoose.connect(uri, {
			authSource: "admin",
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => console.log('Connect atlas'))
		.catch((e) => console.log(e))
	} else {
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
}

export default mongooseConection;
