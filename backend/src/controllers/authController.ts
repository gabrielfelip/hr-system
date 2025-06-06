import { Request, Response } from 'express';
import prisma from '../services/prisma'; // Importa a instância do Prisma Client
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, nome, tipo } = req.body; // [cite: 3]

  if (!username || !password || !nome || !tipo) { // [cite: 3]
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: username, password, nome, tipo' });
  }

  try {
    const existingUser = await prisma.usuario.findUnique({ // [cite: 3]
      where: { username },
    });

    if (existingUser) { // [cite: 3]
      return res.status(409).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await hashPassword(password); // [cite: 3]
    const newUser = await prisma.usuario.create({ // [cite: 3]
      data: {
        username,
        password: hashedPassword,
        nome,
        tipo,
        status: 'A', // Default para Ativo
        quantAcesso: 0,
      },
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso', user: { username: newUser.username, nome: newUser.nome, tipo: newUser.tipo } }); // [cite: 3]
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' }); // [cite: 3]
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body; // [cite: 3]

  if (!username || !password) { // [cite: 3]
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }

  try {
    const user = await prisma.usuario.findUnique({ // [cite: 3]
      where: { username },
    });

    if (!user) { // [cite: 3]
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.status === 'I') { // [cite: 3]
      return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
    }
    if (user.status === 'B') { // [cite: 3]
      return res.status(403).json({ message: 'Usuário bloqueado. Contate o administrador.' });
    }

    const isPasswordValid = await comparePassword(password, user.password); // [cite: 3]
    if (!isPasswordValid) { // [cite: 3]
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    await prisma.usuario.update({ // [cite: 3]
      where: { username },
      data: { quantAcesso: { increment: 1 } },
    });

    const token = generateToken({ username: user.username, tipo: user.tipo as '0' | '1' }); // [cite: 4]
    res.status(200).json({ message: 'Login bem-sucedido', token, user: { username: user.username, nome: user.nome, tipo: user.tipo } }); // [cite: 3, 4]
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' }); // [cite: 3]
  }
};

export const changePassword = async (req: Request, res: Response) => { // [cite: 5]
  const { currentPassword, newPassword } = req.body;
  const username = req.user?.username; // Obtido do middleware de autenticação

  if (!username) { // [cite: 5]
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }
  if (!currentPassword || !newPassword) { // [cite: 5]
    return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
  }

  try {
    const user = await prisma.usuario.findUnique({ // [cite: 5]
      where: { username },
    });

    if (!user) { // [cite: 5]
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password); // [cite: 5]
    if (!isCurrentPasswordValid) { // [cite: 5]
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const newHashedPassword = await hashPassword(newPassword); // [cite: 5]
    await prisma.usuario.update({ // [cite: 5]
      where: { username },
      data: { password: newHashedPassword },
    });

    res.status(200).json({ message: 'Senha alterada com sucesso.' }); // [cite: 5]
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' }); // [cite: 5]
  }
};

export const recoverPassword = async (req: Request, res: Response) => { // [cite: 6]
    const { email } = req.body; // No nosso caso, usaremos o username para simular

    if (!email) { // [cite: 6]
        return res.status(400).json({ message: 'E-mail para recuperação de senha é obrigatório.' });
    }

    // Simulação do fluxo:
    try {
        const user = await prisma.usuario.findUnique({ // [cite: 6]
          where: { username: email }, // Assumindo que o "email" seja o username para o mock
        });

        if (!user) { // [cite: 6]
            // Para segurança, sempre retorne uma mensagem genérica, mesmo que o usuário não exista
            return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
        }

        // Gerar um token de recuperação (ou um código) e armazená-lo temporariamente
        // Enviar e-mail simulado com o link/código
        console.log(`[SIMULAÇÃO] E-mail de recuperação enviado para: ${email}. Usuário: ${user.nome}`); // [cite: 6]

        res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' }); // [cite: 6]
    } catch (error) {
        console.error('Erro na recuperação de senha (simulado):', error);
        res.status(500).json({ message: 'Erro interno do servidor durante a recuperação de senha.' }); // [cite: 6]
    }
};