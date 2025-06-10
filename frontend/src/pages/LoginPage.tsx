import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
    }}>
      <div style={{
        padding: '50px', 
        maxWidth: '450px', 
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '12px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)', 
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2c3e50', fontSize: '2.5rem', fontWeight: '700', marginBottom: '30px' }}>Login</h2> 
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', position: 'relative' }}> 
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', color: '#555' }}>Usuário:</label>
            <div style={{ position: 'relative' }}> 
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Digite seu nome de usuário"
                style={{
                  width: '100%', 
                  padding: '12px 12px 12px 45px', 
                  border: '1px solid #ddd',
                  borderRadius: '8px', 
                  fontSize: '1rem',
                  boxSizing: 'border-box' 
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '20px', position: 'relative' }}> 
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', color: '#555' }}>Senha:</label>
            <div style={{ position: 'relative' }}> 
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'} 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
                style={{
                  width: '100%', 
                  padding: '12px 45px 12px 45px', 
                  border: '1px solid #ddd',
                  borderRadius: '8px', 
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  zIndex: 10
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                    <path d="M2 12s3-7 10-7 10 7 10 7"/><path d="M7 7c-1.25-1.25-2.5-2.5-3.25-3.25"/><path d="M15 15s-3 7-10 7-10-7-10-7"/><path d="M9 9c1.25 1.25 2.5 2.5 3.25 3.25"/><path d="M2 2l20 20"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                    <path d="M2 12s3-7 10-7 10 7 10 7"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>} 
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0056b3'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#007bff'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Entrar
          </button>
        </form>
        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem' }}> 
          Não tem uma conta? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Cadastre-se</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.95rem' }}> 
          Esqueceu a senha? <Link to="/recover-password" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Recuperar Senha</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;