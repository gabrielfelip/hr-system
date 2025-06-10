import { Request, Response } from 'express';
import prisma from '../services/prisma'; 
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, nome, tipo } = req.body; 

  if (!username || !password || !nome || !tipo) { 
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: username, password, nome, tipo' });
  }

  try {
    const existingUser = await prisma.usuario.findUnique({ 
    where: { username },
    });

    if (existingUser) { 
      return res.status(409).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await hashPassword(password); 
    const newUser = await prisma.usuario.create({
      data: {
        username,
        password: hashedPassword,
        nome,
        tipo,
        status: 'A', 
        quantAcesso: 0,
      },
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso', user: { username: newUser.username, nome: newUser.nome, tipo: newUser.tipo } }); 
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' }); 
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body; 

  if (!username || !password) { 
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }

  try {
    const user = await prisma.usuario.findUnique({ 
      where: { username },
    });

    if (!user) { 
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.status === 'I') { 
      return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
    }
    if (user.status === 'B') { 
     return res.status(403).json({ message: 'Usuário bloqueado. Contate o administrador.' });
    }

    const isPasswordValid = await comparePassword(password, user.password); 
    if (!isPasswordValid) { 
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    await prisma.usuario.update({ 
      where: { username },
      data: { quantAcesso: { increment: 1 } },
    });

    const token = generateToken({ username: user.username, tipo: user.tipo as '0' | '1' }); 
    res.status(200).json({ message: 'Login bem-sucedido', token, user: { username: user.username, nome: user.nome, tipo: user.tipo } }); 
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' }); 
  }
};

export const changePassword = async (req: Request, res: Response) => { 
  const { currentPassword, newPassword } = req.body;
  const username = req.user?.username; 

  if (!username) { 
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }
  if (!currentPassword || !newPassword) { 
    return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
  }

  try {
    const user = await prisma.usuario.findUnique({ 
      where: { username },
    });

    if (!user) { 
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password); 
    if (!isCurrentPasswordValid) { 
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const newHashedPassword = await hashPassword(newPassword); 
    await prisma.usuario.update({ 
      where: { username },
      data: { password: newHashedPassword },
    });

    res.status(200).json({ message: 'Senha alterada com sucesso.' }); 
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' }); 
  }
};

export const recoverPassword = async (req: Request, res: Response) => { 
    const { email } = req.body;

    if (!email) { 
        return res.status(400).json({ message: 'E-mail para recuperação de senha é obrigatório.' });
    }

    try {
        const user = await prisma.usuario.findUnique({ 
          where: { username: email }, 
        });

        if (!user) { 
            return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
        }

        
        console.log(`[SIMULAÇÃO] E-mail de recuperação enviado para: ${email}. Usuário: ${user.nome}`); 

        res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' }); 
    } catch (error) {
        console.error('Erro na recuperação de senha (simulado):', error);
        res.status(500).json({ message: 'Erro interno do servidor durante a recuperação de senha.' }); 
    }
};