import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extender o Request para incluir o usuário decodificado
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        tipo: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }

  req.user = decoded; // Armazena o payload do token na requisição
  next();
};

export const authorizeRole = (requiredRole: '0' | '1') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    if (req.user.tipo !== requiredRole) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para realizar esta ação.' });
    }
    next();
  };
};