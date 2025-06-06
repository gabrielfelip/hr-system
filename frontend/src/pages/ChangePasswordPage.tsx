import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios configurada

/**
 * Página para alteração de senha do usuário autenticado.
 */
const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Lida com o envio do formulário de alteração de senha.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro
    setMessage(''); // Limpa mensagens de sucesso

    // Valida se a nova senha e a confirmação coincidem
    if (newPassword !== confirmNewPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      // Envia a senha atual e a nova senha para a API
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage(response.data.message); // Exibe mensagem de sucesso
      // Limpa os campos do formulário
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Opcional: Redireciona para o dashboard após um pequeno atraso
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) { // 'err' é do tipo 'unknown'
      // Implementação do tratamento de erro seguro
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { // Se for um erro padrão do JavaScript
        setError(err.message);
      } else { // Para qualquer outro tipo de erro desconhecido
        setError('Ocorreu um erro desconhecido ao alterar a senha.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {/* Botão Voltar Sutil com Ícone SVG */}
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

      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="currentPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha Atual:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nova Senha:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirmar Nova Senha:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center' }}>{message}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Alterar Senha
        </button>
      </form>
      <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>Voltar para o Dashboard</Link>
      </p>
    </div>
  );
};

export default ChangePasswordPage;
