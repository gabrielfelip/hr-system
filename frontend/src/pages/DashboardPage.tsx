import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', backgroundColor: '#fff', position: 'relative' }}>
      {/* Botão Voltar Sutil com Ícone SVG */}
      {/* Adicionado o botão voltar que já havíamos implementado */}
      <button
        onClick={() => navigate(-1)} // Volta para a página anterior
        style={{
          background: 'none',     // Fundo transparente
          border: 'none',         // Sem borda
          color: '#6c757d',       // Cor do ícone
          cursor: 'pointer',
          padding: '8px',         // Aumenta a área clicável
          transition: 'color 0.2s ease, transform 0.2s ease', // Transição suave
          display: 'flex',        // Para alinhar o SVG e texto (se houvesse)
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',    // Torna o botão circular
          width: '40px',          // Largura do botão
          height: '40px',         // Altura do botão
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Sombra sutil
          position: 'absolute',   // Posicionamento absoluto
          top: '20px',            // Distância do topo
          left: '20px',           // Distância da esquerda
          zIndex: 10              // Garante que fique acima de outros elementos
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#007bff'; // Muda a cor no hover
          e.currentTarget.style.transform = 'scale(1.1)'; // Pequeno zoom no hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#6c757d';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Voltar" // Dica ao passar o mouse
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
      </button>

      <h2 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>Bem-vindo(a), {user.nome}!</h2>
      <p style={{ color: '#555', marginBottom: '30px', textAlign: 'center' }}>Você está logado como: <strong style={{ color: '#007bff' }}>{user.tipo === '0' ? 'Administrador' : 'Usuário Comum'}</strong></p>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link
              to="/employees"
              style={{
                display: 'flex', // Usar flexbox para alinhar ícone e texto
                alignItems: 'center', // Alinhar verticalmente
                justifyContent: 'center', // Centralizar conteúdo
                gap: '10px', // Espaçamento entre ícone e texto
                padding: '15px 20px', // Aumenta o padding
                backgroundColor: '#1E40AF', // Azul mais corporativo
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px', // Bordas mais arredondadas
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem', // Aumenta um pouco a fonte
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)' // Sombra mais proeminente
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1C3A8D'; // Azul escuro no hover
                e.currentTarget.style.transform = 'translateY(-3px)'; // Efeito de levantar
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1E40AF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Ícone de Usuários/Pessoas para Gerenciar Funcionários */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Gerenciar Funcionários
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link
              to="/change-password"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 20px',
                backgroundColor: '#059669', // Verde Esmeralda mais corporativo
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#047857'; // Verde escuro no hover
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Ícone de Chave/Cadeado para Alterar Senha */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Alterar Senha
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 20px',
                backgroundColor: '#B91C1C', // Vermelho Escuro/Bordô
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#991B1B'; // Vermelho mais escuro no hover
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Ícone de Log-out/Sair */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="17 16 22 12 17 8"/><line x1="22" x2="10" y1="12" y2="12"/></svg>
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardPage;
