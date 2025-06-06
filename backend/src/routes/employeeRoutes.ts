import { Router } from 'express';
import { addEmployee, listEmployees, getEmployee, updateEmployeeData, removeEmployee } from '../controllers/employeeController'; // [cite: 7, 8]
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware'; // [cite: 4]

const router = Router();

// Rotas protegidas. Apenas administradores podem adicionar, atualizar e deletar. [cite: 3]
// Usuários comuns podem apenas listar e ver detalhes. [cite: 3]
router.post('/', authenticateToken, authorizeRole('0'), addEmployee); // Apenas Administrador [cite: 7]
router.get('/', authenticateToken, listEmployees); // Todos autenticados [cite: 8]
router.get('/:id', authenticateToken, getEmployee); // Todos autenticados [cite: 8]
router.put('/:id', authenticateToken, authorizeRole('0'), updateEmployeeData); // Apenas Administrador [cite: 8]
router.delete('/:id', authenticateToken, authorizeRole('0'), removeEmployee); // Apenas Administrador [cite: 8]

export default router;