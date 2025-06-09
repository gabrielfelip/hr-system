import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [newHiresThisMonth, setNewHiresThisMonth] = useState(0);
  const [upcomingVacations, setUpcomingVacations] = useState(0);

  const isAdmin = user.tipo === '0';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/employees/metrics');
        setTotalEmployees(response.data.totalEmployees);
        setNewHiresThisMonth(response.data.newHiresThisMonth);
        setUpcomingVacations(response.data.upcomingVacations);
      } catch (err: unknown) {
        console.error('Erro ao buscar métricas do dashboard:', err);
      }
    };

    if (isAdmin) { 
      fetchMetrics();
    } else {
      setTotalEmployees(0);
      setNewHiresThisMonth(0);
      setUpcomingVacations(0);
    }
  }, [isAdmin]); 

  return (

    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',     
    }}>

      <div style={{
        padding: '40px 45px',
        maxWidth: '850px',
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

        <h2 style={{
          color: '#2c3e50',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '10px',
          marginTop: '20px'
        }}>
          Bem-vindo(a), <span style={{ color: '#007bff' }}>{user.nome}!</span>
        </h2>
        <p style={{
          color: '#607d8b',
          fontSize: '1.1rem',
          marginBottom: '30px'
        }}>
          Você está logado como: <strong style={{ color: '#007bff' }}>{isAdmin ? 'Administrador' : 'Usuário Comum'}</strong>
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '40px'
        }}>

          {/* Card Total de Funcionários */}
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h4 style={{ color: '#1E40AF', fontSize: '0.95rem', marginBottom: '5px' }}>Total de Funcionários</h4>
            <p style={{ color: '#1E40AF', fontSize: '1.8rem', fontWeight: 'bold' }}>{totalEmployees}</p>
          </div>

          {/* Card Novas Contratações (Mês) - Não Clicável Agora */}
          <div
            style={{
              backgroundColor: '#e0fff2',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <h4 style={{ color: '#059669', fontSize: '0.95rem', marginBottom: '5px' }}>Novas Contratações (Mês)</h4>
            <p style={{ color: '#059669', fontSize: '1.8rem', fontWeight: 'bold' }}>{newHiresThisMonth}</p>
          </div>

          {/* Card Próximas Férias - Não Clicável Agora */}
          <div
            style={{
              backgroundColor: '#fffaf0',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <h4 style={{ color: '#D97706', fontSize: '0.95rem', marginBottom: '5px' }}>Próximas Férias</h4>
            <p style={{ color: '#D97706', fontSize: '1.8rem', fontWeight: 'bold' }}>{upcomingVacations}</p>
          </div>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

            {/* --- ORGANIZAÇÃO DOS CARDS DE AÇÃO --- */}

            {/* CARD 'GERENCIAR FUNCIONÁRIOS' (Mantido para todos) */}
            <li style={{ minHeight: '150px' }}>
              <Link
                to="/employees"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '25px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                  height: '100%',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users" style={{ marginBottom: '10px' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Gerenciar Funcionários
              </Link>
            </li>

            {/* CARD 'ADICIONAR FUNCIONÁRIO' (Apenas para administradores) */}
            {isAdmin && (
              <li style={{ minHeight: '150px' }}>
                <Link
                  to="/employees/add"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '25px',
                    backgroundColor: '#1E40AF',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                    height: '100%',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1C3A8D';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E40AF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus" style={{ marginBottom: '10px' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  Adicionar Funcionário
                </Link>
              </li>
            )}

            {/* CARD 'ALTERAR SENHA' */}
            <li style={{ minHeight: '150px' }}>
              <Link
                to="/change-password"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '25px',
                  backgroundColor: '#047857',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                  height: '100%',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#065F46';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#047857';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" style={{ marginBottom: '10px' }}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Alterar Senha
              </Link>
            </li>

            {/* CARD 'SAIR' */}
            <li style={{ minHeight: '150px' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '25px',
                  backgroundColor: '#B91C1C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#991B1B';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out" style={{ marginBottom: '10px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="17 16 22 12 17 8"/><line x1="22" x2="10" y1="12" y2="12"/></svg>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DashboardPage;