import { Request, Response } from 'express';
import prisma from '../services/prisma';

import { Funcionario as EmployeeType } from '@prisma/client';

export const addEmployee = async (req: Request, res: Response) => {
  const newEmployee: EmployeeType = req.body;
  try {
    const employee = await prisma.funcionario.create({
      data: {
        ...newEmployee,
        dataContratacao: new Date(newEmployee.dataContratacao),
        salario: parseFloat(newEmployee.salario.toString()),
      },
    });
    res.status(201).json(employee);
  } catch (err: unknown) {
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const searchQuery = req.query.search as string || '';

  const sortField = req.query.sortField as string || 'nome';
  const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc';

  const whereClause: any = {};
  if (searchQuery) {
    whereClause.OR = [
      { nome: { contains: searchQuery, mode: 'insensitive' as any } },
      { sobrenome: { contains: searchQuery, mode: 'insensitive' as any } },
      { email: { contains: searchQuery, mode: 'insensitive' as any } },
      { cargo: { contains: searchQuery, mode: 'insensitive' as any } },
      { departamento: { contains: searchQuery, mode: 'insensitive' as any } },
    ];
  }

  const orderByClause: any = {};
  const validSortFields = ['id', 'nome', 'sobrenome', 'email', 'telefone', 'dataContratacao', 'cargo', 'departamento', 'salario', 'criadoEm', 'atualizadoEm'];
  if (sortField && validSortFields.includes(sortField)) {
    orderByClause[sortField] = sortOrder;
  } else {
    orderByClause.nome = 'asc';
  }

  try {
    const employees = await prisma.funcionario.findMany({
      skip: skip,
      take: limit,
      where: whereClause,
      orderBy: orderByClause,
    });

    const formattedEmployees = employees.map(emp => ({
        ...emp,
        salario: parseFloat(emp.salario.toString()),
        dataContratacao: emp.dataContratacao.toISOString().split('T')[0]
    }));


    const totalEmployees = await prisma.funcionario.count({
      where: whereClause,
    });

    res.status(200).json({
      total: totalEmployees,
      page,
      limit,
      data: formattedEmployees,
    });
  } catch (err: unknown) {
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
      const formattedEmployee = {
        ...employee,
        salario: parseFloat(employee.salario.toString()),
        dataContratacao: employee.dataContratacao.toISOString().split('T')[0]
      };
      res.status(200).json(formattedEmployee);
    } else {
      res.status(404).json({ message: 'Funcionário não encontrado' });
    }
  } catch (err: unknown) {
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
        dataContratacao: updatedData.dataContratacao ? new Date(updatedData.dataContratacao) : undefined,
        salario: updatedData.salario ? parseFloat(updatedData.salario.toString()) : undefined,
        atualizadoEm: new Date(),
      },
    });
    const formattedEmployee = {
        ...employee,
        salario: parseFloat(employee.salario.toString()),
        dataContratacao: employee.dataContratacao.toISOString().split('T')[0]
    };
    res.status(200).json(formattedEmployee);
  } catch (err: unknown) {
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
    res.status(204).send();
  } catch (err: unknown) {
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

export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const totalEmployees = await prisma.funcionario.count();

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const newHiresThisMonth = await prisma.funcionario.count({
            where: {
                dataContratacao: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth,
                },
            },
        });

        const upcomingVacations = 0;

        res.status(200).json({
            totalEmployees,
            newHiresThisMonth,
            upcomingVacations,
        });

    } catch (err: unknown) {
        console.error('Erro ao buscar métricas do dashboard:', err);
        if (err instanceof Error) {
            return res.status(500).json({ message: 'Erro interno do servidor: ' + err.message });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
