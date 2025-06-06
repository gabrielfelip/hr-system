import { Request, Response } from 'express';
import prisma from '../services/prisma'; // Importa a instância do Prisma Client

// Como o Prisma gera os tipos, podemos importá-los diretamente
import { Funcionario as EmployeeType } from '@prisma/client';

export const addEmployee = async (req: Request, res: Response) => {
  const newEmployee: EmployeeType = req.body;
  try {
    const employee = await prisma.funcionario.create({
      data: {
        ...newEmployee,
        dataContratacao: new Date(newEmployee.dataContratacao), // Converte string para Date
        // Garante que salário seja um número ao salvar no DB, pois o Prisma usa Decimal
        salario: parseFloat(newEmployee.salario as any),
      },
    });
    res.status(201).json(employee);
  } catch (err: unknown) { // Tratamento de erro seguro
    console.error('Erro ao adicionar funcionário:', err);
    if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'P2002' && (err as any).meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Já existe um funcionário com este e-mail.' });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const listEmployees = async (req: Request, res: Response) => {
  // Parâmetros de paginação
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Parâmetro de busca
  const searchQuery = req.query.search as string || '';

  // Parâmetros de ordenação
  const sortField = req.query.sortField as string || 'nome'; // Campo padrão 'nome'
  const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc'; // Ordem padrão 'asc'

  // Construção do filtro de busca (WHERE clause)
  const whereClause: any = {};
  if (searchQuery) {
    whereClause.OR = [
      { nome: { contains: searchQuery, mode: 'insensitive' as any } }, // Busca por nome (case-insensitive)
      { sobrenome: { contains: searchQuery, mode: 'insensitive' as any } }, // Busca por sobrenome
      { email: { contains: searchQuery, mode: 'insensitive' as any } },   // Busca por email
      { cargo: { contains: searchQuery, mode: 'insensitive' as any } },   // Busca por cargo
      { departamento: { contains: searchQuery, mode: 'insensitive' as any } }, // Busca por departamento
    ];
  }

  // Construção da ordenação (ORDER BY clause)
  const orderByClause: any = {};
  if (sortField) {
    orderByClause[sortField] = sortOrder;
  } else {
    // Ordenação padrão se nenhum campo for especificado
    orderByClause.nome = 'asc';
  }

  try {
    const employees = await prisma.funcionario.findMany({
      skip: skip,
      take: limit,
      where: whereClause, // Aplica o filtro de busca
      orderBy: orderByClause, // Aplica a ordenação
    });

    const totalEmployees = await prisma.funcionario.count({
      where: whereClause, // Conta o total de itens com o filtro aplicado
    });

    res.status(200).json({
      total: totalEmployees,
      page,
      limit,
      data: employees,
    });
  } catch (err: unknown) { // Tratamento de erro seguro
    console.error('Erro ao listar funcionários:', err);
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const employee = await prisma.funcionario.findUnique({
      where: { id },
    });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Funcionário não encontrado' });
    }
  } catch (err: unknown) { // Tratamento de erro seguro
    console.error('Erro ao buscar funcionário:', err);
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateEmployeeData = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedData: Partial<EmployeeType> = req.body;

  try {
    const employee = await prisma.funcionario.update({
      where: { id },
      data: {
        ...updatedData,
        dataContratacao: updatedData.dataContratacao ? new Date(updatedData.dataContratacao) : undefined, // Converte string para Date se presente
        salario: updatedData.salario ? parseFloat(updatedData.salario as any) : undefined, // Garante que salário seja um número
        atualizadoEm: new Date(), // Atualiza a data de modificação
      },
    });
    res.status(200).json(employee);
  } catch (err: unknown) { // Tratamento de erro seguro
    console.error('Erro ao atualizar funcionário:', err);
    if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'P2025') {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'P2002' && (err as any).meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Já existe outro funcionário com este e-mail.' });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const removeEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.funcionario.delete({
      where: { id },
    });
    res.status(204).send(); // No Content
  } catch (err: unknown) { // Tratamento de erro seguro
    console.error('Erro ao deletar funcionário:', err);
    if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'P2025') {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
