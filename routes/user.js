import express from 'express';

import UserController  from '../controllers/UserController.js';
const User = new UserController();

const router = express.Router();

router.patch('/', User.updateUser);
router.patch('/phone/', User.updatePhone);
router.patch('/password/', User.updatePassword);
router.patch('/email/', User.updateEmail);
router.delete('/', User.deleteUser);

export default router;