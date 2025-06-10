import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [currentSort, setCurrentSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'nome', order: 'asc' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.tipo === '0';

  useEffect(() => {
    fetchEmployees();
    navigate(location.pathname, { replace: true, state: {} }); 
  }, [navigate, location.pathname]);

  const fetchEmployees = async () => {
    setError('');
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao buscar funcionários.');
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  const handleDeleteEmployee = async (id: number | undefined) => {
    if (!id) return;
    setError('');
    setMessage('');

    if (window.confirm('Tem certeza que deseja excluir este funcionário? Esta ação é irreversível.')) {
      try {
        await api.delete(`/employees/${id}`);
        setMessage('Funcionário excluído com sucesso!');
        fetchEmployees();
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

  const handleSortClick = (field: string) => {
    setCurrentSort(prevSort => {
      const newOrder = prevSort.field === field && prevSort.order === 'asc' ? 'desc' : 'asc';
      return { field, order: newOrder };
    });
  };

  const filteredAndSortedEmployees = useMemo(() => {
    let currentFiltered = employees;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(employee =>
        employee.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.sobrenome.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.cargo.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.departamento.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filterDepartment) {
      const lowerCaseFilterDepartment = filterDepartment.toLowerCase();
      currentFiltered = currentFiltered.filter(employee =>
        employee.departamento.toLowerCase().includes(lowerCaseFilterDepartment)
      );
    }

    return [...currentFiltered].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (currentSort.field === 'nome') {
        valA = `${a.nome} ${a.sobrenome}`.toLowerCase();
        valB = `${b.nome} ${b.sobrenome}`.toLowerCase();
      } else if (currentSort.field === 'departamento') {
        valA = a.departamento.toLowerCase();
        valB = b.departamento.toLowerCase();
      } else if (currentSort.field === 'cargo') {
        valA = a.cargo.toLowerCase();
        valB = b.cargo.toLowerCase();
      } else if (currentSort.field === 'salario') {
        valA = parseFloat(String(a.salario));
        valB = parseFloat(String(b.salario));
      } else if (currentSort.field === 'email') {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      }

      if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, searchTerm, filterDepartment, currentSort]);

  const gridColumnTemplate = isAdmin
    ? '60px 2.5fr 2fr 1.5fr 120px 100px'
    : '60px 2.5fr 2fr 1.5fr 120px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        padding: '30px',
        maxWidth: '1200px',
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

        <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', fontWeight: '700', marginBottom: '25px', marginTop: '10px' }}>Lista de Funcionários</h2>

        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          backgroundColor: '#fdfdff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <label style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Buscar (Nome/Email/Cargo):</span>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '500', color: '#555', marginBottom: '5px' }}>Departamento:</span>
            <input
              type="text"
              placeholder="Ex: TI, RH"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </label>
          {(searchTerm || filterDepartment || currentSort.field !== 'nome' || currentSort.order !== 'asc') && ( 
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDepartment('');
                  setCurrentSort({ field: 'nome', order: 'asc' });
                  navigate(location.pathname, { replace: true, state: {} }); 
                }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  width: '100%'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0056b3'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#007bff'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>

        {filteredAndSortedEmployees.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            Nenhum funcionário encontrado com os critérios de busca.
          </p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginTop: '20px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: gridColumnTemplate,
              backgroundColor: '#2c3e50',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '15px 20px',
              borderBottom: '1px solid #4a6a8b',
              borderRadius: '10px 10px 0 0',
              gap: '10px',
              alignItems: 'center',
            }}>
              <div style={{ textAlign: 'center' }}></div>
              <div style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleSortClick('nome')}>
                Nome Completo
                {currentSort.field === 'nome' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {currentSort.order === 'asc' ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
                  </svg>
                )}
              </div>
              <div style={{ textAlign: 'left', cursor: 'pointer', paddingLeft: '30px', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleSortClick('email')}>
                Email
                {currentSort.field === 'email' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {currentSort.order === 'asc' ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
                  </svg>
                )}
              </div>
              <div style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleSortClick('departamento')}>
                Departamento
                {currentSort.field === 'departamento' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {currentSort.order === 'asc' ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
                  </svg>
                )}
              </div>
              <div style={{ textAlign: 'right', cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '10px', gap: '15px' }} onClick={() => handleSortClick('salario')}>
                Salário
                {currentSort.field === 'salario' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {currentSort.order === 'asc' ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
                  </svg>
                )}
              </div>
              {isAdmin && <div style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Ações</div>}
            </div>

            {filteredAndSortedEmployees.map((employee, index) => (
              <div
                key={employee.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridColumnTemplate,
                  padding: '12px 20px',
                  backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f8f8f8',
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease',                 
                  gap: '20px',
                  minHeight: '80px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40" height="40" viewBox="0 0 24 24" fill="#6c757d" stroke="#6c757d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                    className="lucide lucide-circle-user-round"
                    style={{ borderRadius: '30%', border: '10px solid #ddd' }}
                  >
                    <path d="M18 20a6 6 0 0 0-12 0"/>
                    <circle cx="12" cy="10" r="4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>

                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                  <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{employee.nome} {employee.sobrenome}</span>
                  <span style={{ color: '#007bff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{employee.cargo}</span>
                </div>
                <div style={{ textAlign: 'left', color: '#666', fontSize: '0.9rem', minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{employee.email}</div>
                <div style={{ textAlign: 'left', paddingLeft: '35px', color: '#666', fontSize: '0.9rem', minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{employee.departamento}</div>
                <div style={{ color: '#059669', paddingRight: '40px', fontSize: '0.95rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>R$ {parseFloat(String(employee.salario)).toFixed(2)}</div>

                {isAdmin && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '5px',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100%',
                  }}>
                    <button
                      onClick={() => handleEditClick(employee)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#FFD700',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E0B600'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#DC3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C82333'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC3545'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;