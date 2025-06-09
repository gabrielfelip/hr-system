import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

interface Employee {
  id?: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  dataContratacao: string;
  cargo: string;
  departamento: string;
  salario: number | string;
  status?: 'A' | 'I';
  criadoEm?: string;
  atualizadoEm?: string;
}

const initialFormData: Employee = {
  nome: '',
  sobrenome: '',
  email: '',
  telefone: '',
  dataContratacao: '',
  cargo: '',
  departamento: '',
  salario: 0,
};

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<Employee>(initialFormData);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.tipo === '0';

  useEffect(() => {
    setError('');
    setMessage('');
    
    if (id) {
      const employeeId = parseInt(id);
      if (!isNaN(employeeId)) {
        setEditingEmployeeId(employeeId);
        fetchEmployeeData(employeeId);
      } else {
        setError('ID do funcionário inválido na URL. Redirecionando para adicionar.');
        setFormData(initialFormData);
        setEditingEmployeeId(null);
        // Opcional: Navegar para /employees/add ou /employees após um pequeno delay
        // setTimeout(() => navigate('/employees/add'), 1500); 
      }
    } else {
      setFormData(initialFormData);
      setEditingEmployeeId(null);
      setLoading(false); // Garante que não está carregando se for modo de adição
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId: number) => {
    setLoading(true);
    setError('');
    try {
      // Axios vai rejeitar a Promise para status 4xx/5xx, então cairá no catch.
      const response = await api.get(`/employees/${employeeId}`); 
      
      // Se chegamos aqui, a resposta é 200 OK.
      const employeeData = response.data; // <--- AQUI ESTÁ A MUDANÇA CRUCIAL
                                         // O backend retorna formattedEmployee diretamente, não {data: formattedEmployee}
      
      console.log("Dados do funcionário recebidos da API (response.data):", employeeData);

      const formattedDataContratacao = employeeData.dataContratacao
        ? new Date(employeeData.dataContratacao).toISOString().split('T')[0]
        : '';

      setFormData({
        ...employeeData,
        dataContratacao: formattedDataContratacao,
        salario: employeeData.salario === null || employeeData.salario === undefined ? 0 : Number(employeeData.salario),
        telefone: employeeData.telefone || ''
      });

    } catch (err: unknown) {
      // O erro do 404 do backend virá para este catch.
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 401) {
            // Este caso é tratado pelo interceptor, que redireciona.
            // Não precisamos fazer nada específico aqui além do que o interceptor já faz.
          } else if (err.response.status === 404) {
            setError(err.response.data?.message || 'Funcionário não encontrado.');
            setFormData(initialFormData); // Limpa o formulário
            setEditingEmployeeId(null); // Volta para o modo de adição
            // Opcional: Redirecionar de volta para a lista se o funcionário não for encontrado
            // setTimeout(() => navigate('/employees'), 1500);
          } else {
            setError(err.response.data?.message || 'Erro ao carregar dados do funcionário.');
          }
        } else {
          setError('Erro de rede ou servidor não respondeu.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao buscar dados do funcionário.');
      }
      setFormData(initialFormData); // Garante que o formulário está limpo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (editingEmployeeId) {
        await api.put(`/employees/${editingEmployeeId}`, formData);
        setMessage('Funcionário atualizado com sucesso!');
      } else {
        await api.post('/employees', formData);
        setMessage('Funcionário adicionado com sucesso!');
      }
      setFormData(initialFormData);
      setEditingEmployeeId(null);
      navigate('/employees');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status !== 401) {
        setError(err.response.data?.message || 'Erro ao salvar funcionário. Verifique os dados.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao salvar o funcionário.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <p style={{ textAlign: 'center', color: '#dc3545', padding: '50px' }}>Você não tem permissão para acessar esta página.</p>;
  }

  // O componente renderiza a mensagem de carregamento ou o formulário,
  // com as mensagens de erro/sucesso aparecendo no topo via 'error'/'message' states.
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      <div style={{
        padding: '40px',
        maxWidth: '1000px',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate(-1)}
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
            top: '20px',
            left: '20px',
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

        <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', fontWeight: '700', marginBottom: '25px', marginTop: '10px' }}>Gerenciar Funcionários</h2>

        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

        {loading && editingEmployeeId ? (
          <p style={{ color: '#007bff', fontSize: '1.2rem', padding: '20px' }}>Carregando dados do funcionário...</p>
        ) : (
          <div style={{ marginBottom: '40px', border: '1px solid #e0e0e0', padding: '30px', borderRadius: '10px', backgroundColor: '#fdfdff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#333', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>{editingEmployeeId ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '25px' }}>
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
                  <input type="date" name="dataContratacao" value={formData.dataContratacao || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} />
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
                  <input type="number" name="salario" value={Number(formData.salario)} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }} placeholder="0.00" />
                </label>
              </div>
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: loading ? '#6c757d' : '#1E40AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    marginRight: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#1C3A8D'; e.currentTarget.style.transform = 'translateY(-3px)'; }}}
                  onMouseOut={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#1E40AF'; e.currentTarget.style.transform = 'translateY(0)'; }}}
                >
                  {loading ? 'Processando...' : (editingEmployeeId ? 'Atualizar Funcionário' : 'Adicionar Funcionário')}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                </button>
                {editingEmployeeId && (
                  <button
                    type="button"
                    onClick={() => navigate('/employees')}
                    disabled={loading}
                    style={{
                      padding: '12px 25px',
                      backgroundColor: loading ? '#6c757d' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#5a6268'; e.currentTarget.style.transform = 'translateY(-3px)'; }}}
                    onMouseOut={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#6c757d'; e.currentTarget.style.transform = 'translateY(0)'; }}}
                  >
                    Cancelar Edição
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;