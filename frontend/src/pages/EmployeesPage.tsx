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

interface ValidationErrors {
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  dataContratacao?: string;
  cargo?: string;
  departamento?: string;
  salario?: string;
}

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<Employee>(initialFormData);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [generalError, setGeneralError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.tipo === '0';

  useEffect(() => {
    setGeneralError('');
    setMessage('');
    setValidationErrors({});

    if (id) {
      const employeeId = parseInt(id);
      if (!isNaN(employeeId)) {
        setEditingEmployeeId(employeeId);
        fetchEmployeeData(employeeId);
      } else {
        setGeneralError('ID do funcionário inválido na URL.');
        setFormData(initialFormData);
        setEditingEmployeeId(null);
      }
    } else {
      setFormData(initialFormData);
      setEditingEmployeeId(null);
      setLoading(false);
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId: number) => {
    setLoading(true);
    setGeneralError('');
    try {
      const response = await api.get(`/employees/${employeeId}`);
      const employeeData = response.data;

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
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 401) { }
          else if (err.response.status === 404) {
            setGeneralError(err.response.data?.message || 'Funcionário não encontrado.');
            setFormData(initialFormData);
            setEditingEmployeeId(null);

            navigate('/employees', { replace: true }); 
          } else {
            setGeneralError(err.response.data?.message || 'Erro ao carregar dados do funcionário.');
          }
        } else {
          setGeneralError('Erro de rede ou servidor não respondeu.');
        }
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Ocorreu um erro desconhecido ao buscar dados do funcionário.');
      }
      setFormData(initialFormData);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: keyof ValidationErrors, value: string | number) => {
    let error = '';
    switch (name) {
      case 'nome':
        if (!value.toString().trim()) error = 'Nome é obrigatório.';
        break;
      case 'sobrenome':
        if (!value.toString().trim()) error = 'Sobrenome é obrigatório.';
        break;
      case 'email':
        if (!value.toString().trim()) {
          error = 'Email é obrigatório.';
        } else if (!/\S+@\S+\.\S+/.test(value.toString())) {
          error = 'Formato de email inválido.';
        }
        break;
      case 'telefone':
        const cleanedPhone = value.toString().replace(/\D/g, '');
        if (cleanedPhone && cleanedPhone.length < 10) {
          error = 'Telefone inválido (mínimo 10 dígitos).';
        }
        break;
      case 'dataContratacao':
        if (!value.toString()) error = 'Data de Contratação é obrigatória.';
        break;
      case 'cargo':
        if (!value.toString().trim()) error = 'Cargo é obrigatório.';
        break;
      case 'departamento':
        if (!value.toString().trim()) error = 'Departamento é obrigatório.';
        break;
      case 'salario':
        const numericSalario = Number(value);
        if (isNaN(numericSalario) || numericSalario <= 0) {
          error = 'Salário deve ser um número positivo.';
        }
        break;
      default:
        break;
    }
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof ValidationErrors, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ValidationErrors, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: ValidationErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'id' && key !== 'status' && key !== 'criadoEm' && key !== 'atualizadoEm') {
        const value = (formData as any)[key];
        const error = validateField(key as keyof ValidationErrors, value);
        if (error) {
          newErrors[key as keyof ValidationErrors] = error;
          isValid = false;
        }
      }
    });
    
    setValidationErrors(newErrors);
    
    if (!isValid) {
      setGeneralError('Por favor, corrija os erros no formulário.');
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

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

      navigate('/employees', { replace: true }); 
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status !== 401) {
        setGeneralError(err.response.data?.message || 'Erro ao salvar funcionário. Verifique os dados.');
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Ocorreu um erro desconhecido ao salvar o funcionário.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <p style={{ textAlign: 'center', color: '#dc3545', padding: '50px' }}>Você não tem permissão para acessar esta página.</p>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        padding: '50px',
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
            top: '10px',
            left: '13px',
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

        {generalError && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{generalError}</p>}
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
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    onBlur={handleBlur} 
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.nome ? '#dc3545' : '#ccc'}`, 
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="Nome do funcionário"
                  />
                  {validationErrors.nome && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.nome}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Sobrenome:</span>
                  <input
                    type="text"
                    name="sobrenome"
                    value={formData.sobrenome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.sobrenome ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="Sobrenome do funcionário"
                  />
                  {validationErrors.sobrenome && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.sobrenome}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.email ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="exemplo@empresa.com"
                  />
                  {validationErrors.email && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.email}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Telefone:</span>
                  
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.telefone ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="(XX) XXXX-XXXX"
                  />
                  {validationErrors.telefone && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.telefone}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Data Contratação:</span>
                  <input
                    type="date"
                    name="dataContratacao"
                    value={formData.dataContratacao || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.dataContratacao ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                  />
                  {validationErrors.dataContratacao && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.dataContratacao}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Cargo:</span>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.cargo ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="Ex: Desenvolvedor, Analista"
                  />
                  {validationErrors.cargo && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.cargo}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Departamento:</span>
                  <input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.departamento ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="Ex: TI, RH, Marketing"
                  />
                  {validationErrors.departamento && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.departamento}</p>}
                </label>

                <label style={{ display: 'block', textAlign: 'left' }}>
                  <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Salário:</span>
                  <input
                    type="number"
                    name="salario"
                    value={Number(formData.salario)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${validationErrors.salario ? '#dc3545' : '#ccc'}`,
                      borderRadius: '5px',
                      marginTop: '5px'
                    }}
                    placeholder="0.00"
                  />
                  {validationErrors.salario && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.salario}</p>}
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

                    onClick={() => navigate('/employees', { replace: true })} 
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