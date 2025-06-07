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
        salario: parseFloat(newEmployee.salario.toString()), // Convertendo para string antes de parseFloat
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
  // Verifica se o campo de ordenação é válido para evitar erros do Prisma
  const validSortFields = ['id', 'nome', 'sobrenome', 'email', 'telefone', 'dataContratacao', 'cargo', 'departamento', 'salario', 'criadoEm', 'atualizadoEm'];
  if (sortField && validSortFields.includes(sortField)) {
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

    // Explicitamente converter salario para um número e dataContratacao para string
    // antes de enviar para o frontend.
    const formattedEmployees = employees.map(emp => ({
        ...emp,
        // Garante que emp.salario seja uma string antes de chamar parseFloat
        salario: parseFloat(emp.salario.toString()),
        // Converte dataContratacao para string no formato 'YYYY-MM-DD' para consistência
        // com o input type="date" do frontend e o formato esperado.
        dataContratacao: emp.dataContratacao.toISOString().split('T')[0]
    }));


    const totalEmployees = await prisma.funcionario.count({
      where: whereClause, // Conta o total de itens com o filtro aplicado
    });

    res.status(200).json({
      total: totalEmployees,
      page,
      limit,
      data: formattedEmployees, // Envia os funcionários formatados
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
      // Converte salario para number e dataContratacao para string 'YYYY-MM-DD' antes de enviar
      const formattedEmployee = {
        ...employee,
        salario: parseFloat(employee.salario.toString()),
        dataContratacao: employee.dataContratacao.toISOString().split('T')[0]
      };
      res.status(200).json(formattedEmployee);
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
        salario: updatedData.salario ? parseFloat(updatedData.salario.toString()) : undefined, // Garante que salário seja um número
        atualizadoEm: new Date(), // Atualiza a data de modificação
      },
    });
    // Converte salario para number e dataContratacao para string 'YYYY-MM-DD' antes de enviar
    const formattedEmployee = {
        ...employee,
        salario: parseFloat(employee.salario.toString()),
        dataContratacao: employee.dataContratacao.toISOString().split('T')[0]
    };
    res.status(200).json(formattedEmployee);
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

/**
 * @route GET /api/employees/metrics
 * @description Retorna métricas agregadas para o dashboard (total de funcionários, novas contratações).
 * @access Private (apenas para usuários autenticados)
 */
export const getDashboardMetrics = async (req: Request, res: Response) => {
    try {
        const totalEmployees = await prisma.funcionario.count();

        // Contar novas contratações no mês atual
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); // Último dia do mês

        const newHiresThisMonth = await prisma.funcionario.count({
            where: {
                dataContratacao: {
                    gte: firstDayOfMonth, // Greater than or equal to
                    lte: lastDayOfMonth, // Less than or equal to
                },
            },
        });

        // "Próximas Férias" - Apenas um placeholder por enquanto, exigiria uma tabela de Férias real.
        const upcomingVacations = 0; // Simulando 0, ou você pode definir um valor mockado.

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
