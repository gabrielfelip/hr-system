import { Router } from 'express';
import { registerUser, loginUser, changePassword, recoverPassword } from '../controllers/authController'; 
import { authenticateToken } from '../middlewares/authMiddleware'; 
const router = Router();

router.post('/register', registerUser); 
router.post('/login', loginUser); 
router.post('/change-password', authenticateToken, changePassword); 
router.post('/recover-password', recoverPassword); 

export default router;