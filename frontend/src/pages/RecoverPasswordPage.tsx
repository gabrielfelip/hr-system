import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios configurada

/**
 * Página para solicitar a recuperação de senha (fluxo simulado).
 */
const RecoverPasswordPage: React.FC = () => {
  const [email, setEmail] = useState(''); // Usado como "username" para a simulação
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /**
   * Lida com o envio do formulário de recuperação de senha.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro
    setMessage(''); // Limpa mensagens de sucesso
    try {
      // Envia o "email" (username) para a API de recuperação de senha simulada
      const response = await api.post('/auth/recover-password', { email });
      setMessage(response.data.message); // Exibe a mensagem de sucesso/informação
      setEmail(''); // Limpa o campo
    } catch (err: unknown) { // <-- CORREÇÃO: 'any' foi trocado por 'unknown' para tipagem segura
      // Tratamento de erro mais robusto em TypeScript
      // Verifica se o erro é uma instância de erro do Axios (que tem uma propriedade 'response')
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { // Se for um erro padrão do JavaScript
        setError(err.message);
      } else { // Para qualquer outro tipo de erro desconhecido
        setError('Ocorreu um erro desconhecido ao solicitar a recuperação de senha.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Recuperar Senha</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', color: '#555' }}>Informe seu usuário (simulando e-mail) para iniciar o processo de recuperação de senha.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="recoverEmail" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuário (ou E-mail Cadastrado):</label>
          <input
            type="text"
            id="recoverEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Enviar Link de Recuperação
        </button>
      </form>
      <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Voltar para o Login</Link>
      </p>
    </div>
  );
};

export default RecoverPasswordPage;
