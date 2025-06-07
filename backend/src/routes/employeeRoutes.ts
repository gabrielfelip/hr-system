import { Router } from 'express';
import { addEmployee, listEmployees, getEmployee, updateEmployeeData, removeEmployee, getDashboardMetrics } from '../controllers/employeeController'; // Importa a nova função
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const router = Router();

// Rota para obter métricas do Dashboard (pode ser acessada por qualquer usuário autenticado)
router.get('/metrics', authenticateToken, getDashboardMetrics);

// Rotas CRUD protegidas para Funcionários.
// Apenas administradores podem adicionar, atualizar e deletar.
// Usuários comuns podem apenas listar e ver detalhes.
router.post('/', authenticateToken, authorizeRole('0'), addEmployee);
router.get('/', authenticateToken, listEmployees);
router.get('/:id', authenticateToken, getEmployee);
router.put('/:id', authenticateToken, authorizeRole('0'), updateEmployeeData);
router.delete('/:id', authenticateToken, authorizeRole('0'), removeEmployee);

export default router;
