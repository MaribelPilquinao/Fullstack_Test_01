import { Router } from 'express';
import {
    getMyProfile,
    handleLogin,
    handleRegister,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/authMiddeware';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', authMiddleware, getMyProfile);

export default router;