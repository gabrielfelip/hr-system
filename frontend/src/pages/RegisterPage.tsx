import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios configurada

/**
 * Página de registro de novo usuário.
 */
const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'0' | '1'>('1'); // Padrão: Usuário Comum ('1')
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  /**
   * Lida com o envio do formulário de registro.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa mensagens de erro
    setMessage(''); // Limpa mensagens de sucesso
    try {
      // Envia os dados do novo usuário para a API de registro
      const response = await api.post('/auth/register', { username, password, nome, tipo });
      setMessage(response.data.message); // Exibe mensagem de sucesso
      // Opcional: Redireciona para a página de login após um pequeno atraso
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) { // <-- CORREÇÃO: 'any' foi trocado por 'unknown' para tipagem segura
      // Tratamento de erro mais robusto em TypeScript
      // Verifica se o erro é uma instância de erro do Axios (que tem uma propriedade 'response')
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { // Se for um erro padrão do JavaScript
        setError(err.message);
      } else { // Para qualquer outro tipo de erro desconhecido
        setError('Ocorreu um erro desconhecido ao registrar usuário.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="regUsername" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuário (Login):</label>
          <input
            type="text"
            id="regUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="regNome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo:</label>
          <input
            type="text"
            id="regNome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="regPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
          <input
            type="password"
            id="regPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="regTipo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Usuário:</label>
          <select
            id="regTipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as '0' | '1')}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="1">Usuário Comum</option>
            <option value="0">Administrador</option>
          </select>
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
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        Já tem uma conta? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Faça login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
