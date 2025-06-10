import { Router } from 'express';
import { addEmployee, listEmployees, getEmployee, updateEmployeeData, removeEmployee, getDashboardMetrics } from '../controllers/employeeController'; 
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/metrics', authenticateToken, getDashboardMetrics);


router.post('/', authenticateToken, authorizeRole('0'), addEmployee);
router.get('/', authenticateToken, listEmployees);
router.get('/:id', authenticateToken, getEmployee);
router.put('/:id', authenticateToken, authorizeRole('0'), updateEmployeeData);
router.delete('/:id', authenticateToken, authorizeRole('0'), removeEmployee);

export default router;
