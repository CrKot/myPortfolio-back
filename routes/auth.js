import express from 'express';
import passport from 'passport';

import UserController from '../controllers/UserController.js';
const User = new UserController();

const router = express.Router();

router.post('/sign-up', User.signUp);
router.post('/sign-in', User.signIn);
router.post('/get-user', passport.authenticate('jwt', { session: false }), User.getUser);

export default router;