import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import api from '../services/api'; // Importa a instância do Axios configurada

/**
 * Interface para representar a estrutura de um objeto Funcionário.
 * Os campos opcionais 'id', 'status', 'criadoEm', 'atualizadoEm' são definidos como tal
 * porque são geralmente gerados pelo backend.
 */
interface Employee {
  id?: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  dataContratacao: string; // Formato de string 'YYYY-MM-DD'
  cargo: string;
  departamento: string;
  salario: number | string; // <-- ATUALIZAÇÃO AQUI: salario pode vir como number ou string
  status?: 'A' | 'I'; // 'A' para Ativo, 'I' para Inativo
  criadoEm?: string;
  atualizadoEm?: string;
}

/**
 * Página para gerenciar funcionários (CRUD).
 * Permite listar, adicionar, editar e excluir funcionários.
 * Algumas operações são restritas a administradores.
 */
const EmployeesPage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [employees, setEmployees] = useState<Employee[]>([]); // Estado para armazenar a lista de funcionários
  const [formData, setFormData] = useState<Employee>({ // Estado para os dados do formulário de adição/edição
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    dataContratacao: '',
    cargo: '',
    departamento: '',
    salario: 0,
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null); // ID do funcionário sendo editado
  const [error, setError] = useState(''); // Mensagens de erro
  const [message, setMessage] = useState(''); // Mensagens de sucesso
  // Obtém informações do usuário logado para verificar permissões
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.tipo === '0'; // true se o usuário for um administrador

  // Efeito para carregar a lista de funcionários ao montar o componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  /**
   * Busca a lista de funcionários da API.
   */
  const fetchEmployees = async () => {
    setError('');
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (err: unknown) {
      // Tratamento de erro mais robusto em TypeScript
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao buscar funcionários.');
      }
    }
  };

  /**
   * Lida com a mudança nos campos do formulário.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Lida com a submissão do formulário para adicionar um novo funcionário.
   */
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/employees', formData);
      setMessage('Funcionário adicionado com sucesso!');
      // Limpa o formulário e recarrega a lista
      setFormData({ nome: '', sobrenome: '', email: '', telefone: '', dataContratacao: '', cargo: '', departamento: '', salario: 0 });
      fetchEmployees();
    } catch (err: unknown) {
      // Tratamento de erro mais robusto em TypeScript
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao adicionar funcionário. Verifique suas permissões ou os dados.');
      }
    }
  };

  /**
   * Define o funcionário a ser editado no formulário.
   */
  const handleEditClick = (employee: Employee) => {
    setEditingEmployeeId(employee.id || null);
    // Formata a data para o formato 'YYYY-MM-DD' esperado pelo input type="date"
    setFormData({ ...employee, dataContratacao: employee.dataContratacao ? employee.dataContratacao.split('T')[0] : '' });
  };

  /**
   * Lida com a submissão do formulário para atualizar um funcionário existente.
   */
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!editingEmployeeId) return; // Não faz nada se não houver um funcionário sendo editado

    try {
      await api.put(`/employees/${editingEmployeeId}`, formData);
      setMessage('Funcionário atualizado com sucesso!');
      // Limpa o estado de edição, o formulário e recarrega a lista
      setEditingEmployeeId(null);
      setFormData({ nome: '', sobrenome: '', email: '', telefone: '', dataContratacao: '', cargo: '', departamento: '', salario: 0 });
      fetchEmployees();
    } catch (err: unknown) {
      // Tratamento de erro mais robusto em TypeScript
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar funcionário. Verifique suas permissões ou os dados.');
      }
    }
  };

  /**
   * Lida com a exclusão de um funcionário.
   */
  const handleDeleteEmployee = async (id: number | undefined) => {
    if (!id) return;
    setError('');
    setMessage('');
    // Confirmação antes de deletar
    if (window.confirm('Tem certeza que deseja excluir este funcionário? Esta ação é irreversível.')) {
      try {
        await api.delete(`/employees/${id}`);
        setMessage('Funcionário excluído com sucesso!');
        fetchEmployees(); // Recarrega a lista após a exclusão
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
          setError((err as { response: { data: { message: string } } }).response.data.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao excluir funcionário. Verifique suas permissões.');
        }
      }
    }
  };

  return (
    // O container principal agora tem 'position: relative' para o botão absoluto
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f4f8, #e0e7ed)', // Fundo com gradiente suave
      padding: '20px'
    }}>
      {/* Container do Card Principal */}
      <div style={{
        padding: '30px', // Ajustado padding para dar mais espaço
        maxWidth: '1000px', // Largura máxima do container
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '12px', // Bordas mais arredondadas
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)', // Sombra mais pronunciada e suave
        position: 'relative', // Para o botão voltar absoluto
        textAlign: 'center' // Centraliza o texto dentro do card
      }}>
        {/* Botão Voltar Sutil com Ícone SVG - Posicionado dentro do container */}
        <button
          onClick={() => navigate(-1)} // Volta para a página anterior
          style={{
            background: 'none',
            border: 'none',
            color: '#6c757d',
            cursor: 'pointer',
            padding: '8px',
            transition: 'color 0.2s ease, transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'absolute',
            top: '20px', // Posição do topo dentro do card
            left: '20px', // Posição da esquerda dentro do card
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#007bff';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#6c757d';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
        </button>

        <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', fontWeight: '700', marginBottom: '25px', marginTop: '10px' }}>Gerenciar Funcionários</h2> {/* Ajustado margem superior para compensar o botão */}
        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

        {isAdmin && (
          <div style={{ marginBottom: '40px', border: '1px solid #e0e0e0', padding: '30px', borderRadius: '10px', backgroundColor: '#fdfdff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#333', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>{editingEmployeeId ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h3>
            <form onSubmit={editingEmployeeId ? handleUpdateEmployee : handleAddEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Nome:</span>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="Nome do funcionário" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Sobrenome:</span>
                  <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="Sobrenome do funcionário" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Email:</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="exemplo@empresa.com" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Telefone:</span>
                  <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="(XX) XXXX-XXXX" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Data Contratação:</span>
                  <input type="date" name="dataContratacao" value={formData.dataContratacao} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Cargo:</span>
                  <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="Ex: Desenvolvedor, Analista" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Departamento:</span>
                  <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="Ex: TI, RH, Marketing" />
                </label>
                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Salário:</span>
                  <input type="number" name="salario" value={formData.salario} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="0.00" />
                </label>
              </div>
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#1E40AF', // Azul mais corporativo
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px', // Mais arredondado
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    marginRight: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para o botão
                    display: 'inline-flex', // Para alinhamento de ícone (se houver)
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1C3A8D'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1E40AF'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {editingEmployeeId ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}
                  {/* Ícone de Adicionar/Atualizar (Exemplo: + para adicionar, Save para atualizar) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </button>
                {editingEmployeeId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmployeeId(null);
                      setFormData({ nome: '', sobrenome: '', email: '', telefone: '', dataContratacao: '', cargo: '', departamento: '', salario: 0 });
                    }}
                    style={{
                      padding: '12px 25px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px', // Mais arredondado
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para o botão
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#5a6268'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#6c757d'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Cancelar Edição
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <h3 style={{ color: '#333', fontSize: '1.8rem', fontWeight: '600', marginBottom: '20px' }}>Lista de Funcionários</h3>
        {employees.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>Nenhum funcionário cadastrado. Use o formulário acima para adicionar um!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: 'white', fontSize: '0.95rem' }}> {/* Fundo escuro para o cabeçalho */}
                  <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'left' }}>Nome Completo</th> {/* Ajustado padding */}
                  <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'left' }}>Email</th>
                  <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'left' }}>Cargo</th>
                  <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'left' }}>Departamento</th>
                  <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'left' }}>Salário</th>
                  {isAdmin && <th style={{ border: '1px solid #4a6a8b', padding: '15px', textAlign: 'center' }}>Ações</th>} {/* Centralizado ações */}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-100'} // Mantido classes Tailwind para listras e hover
                  >
                    <td style={{ border: '1px solid #eee', padding: '12px' }}>{employee.nome} {employee.sobrenome}</td> {/* Ajustado padding */}
                    <td style={{ border: '1px solid #eee', padding: '12px' }}>{employee.email}</td>
                    <td style={{ border: '1px solid #eee', padding: '12px' }}>{employee.cargo}</td>
                    <td style={{ border: '1px solid #eee', padding: '12px' }}>{employee.departamento}</td>
                    <td style={{ border: '1px solid #eee', padding: '12px' }}>R$ {parseFloat(String(employee.salario)).toFixed(2)}</td>
                    {isAdmin && (
                      <td style={{ border: '1px solid #eee', padding: '12px', whiteSpace: 'nowrap', textAlign: 'center' }}> {/* Centralizado ações */}
                        <button
                          onClick={() => handleEditClick(employee)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#FFD700', // Amarelo Dourado para Editar
                            color: '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                            marginRight: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            display: 'inline-flex', // Para ícone
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E0B600'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFD700'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#DC3545', // Vermelho Escuro
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease, transform 0.2s ease',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            display: 'inline-flex', // Para ícone
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#C82333'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#DC3545'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default EmployeesPage;
