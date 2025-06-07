import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 


const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate(); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setMessage(''); 

    if (newPassword !== confirmNewPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage(response.data.message); 
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) { 
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { 
        setError(err.message);
      } else { 
        setError('Ocorreu um erro desconhecido ao alterar a senha.');
      }
    }
  };

  return (
    //container principal da página
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f0f4f8, #e0e7ed)', 
      padding: '20px'
    }}>
      // Container do Card Principal 
      <div style={{
        padding: '30px', 
        maxWidth: '500px', 
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
          fontSize: '2.2rem', 
          fontWeight: '700',
          marginBottom: '25px',
          marginTop: '10px' 
        }}>
          Alterar Senha
        </h2>

        {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
        {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="currentPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Senha Atual:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Digite sua senha atual"
              style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Nova Senha:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Crie sua nova senha"
              style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Confirmar Nova Senha:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              placeholder="Confirme sua nova senha"
              style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '5px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px 20px', 
              backgroundColor: '#059669', 
              color: 'white',
              border: 'none',
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
              display: 'inline-flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
