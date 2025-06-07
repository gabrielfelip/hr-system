import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; 

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    try {
     
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token); 
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      navigate('/dashboard'); 
    } catch (err: unknown) { 
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { 
        setError(err.message);
      } else { 
        setError('Ocorreu um erro desconhecido ao fazer login.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Digite seu nome de usuário"
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
            style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
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
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        Não tem uma conta? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Cadastre-se</Link>
      </p>
      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        Esqueceu a senha? <Link to="/recover-password" style={{ color: '#007bff', textDecoration: 'none' }}>Recuperar Senha</Link>
      </p>
    </div>
  );
};

export default LoginPage;
