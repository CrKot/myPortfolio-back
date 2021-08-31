import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongooseConection from './util/mongoose.js';
import authRoutes from './routes/auth.js';
import passport from 'passport';
import session from 'express-session';
import initializeStrategies from './auth/init.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
	credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize())
initializeStrategies(passport)

app.use('/auth', authRoutes)

// Подключаем базу данных
mongooseConection()

app.listen(PORT, () => {
    console.log(`server sterted on port ${process.env.SERVER_PORT}`)
})