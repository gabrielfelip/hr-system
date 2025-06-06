import { Router } from 'express';
import { registerUser, loginUser, changePassword, recoverPassword } from '../controllers/authController'; // [cite: 3, 5, 6]
import { authenticateToken } from '../middlewares/authMiddleware'; // [cite: 4]

const router = Router();

router.post('/register', registerUser); // [cite: 3]
router.post('/login', loginUser); // [cite: 3]
router.post('/change-password', authenticateToken, changePassword); // Requer autenticação [cite: 5]
router.post('/recover-password', recoverPassword); // Simulação de recuperação [cite: 6]

export default router;