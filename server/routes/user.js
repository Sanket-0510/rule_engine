import express from 'express';
const userRouter = express.Router();
import {getUserRules, getUserProfile} from '../controllers/user.js';
import { auth } from '../utils/auth.js';


userRouter.get('/profile', auth, getUserProfile);

userRouter.get('/rules', auth, getUserRules);

export default userRouter;