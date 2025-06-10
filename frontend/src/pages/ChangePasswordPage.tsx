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
  const [loading, setLoading] = useState(false); 

  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  const [passwordRequirements, setPasswordRequirements] = useState({
    minChars: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    notCurrent: false, 
  });

  const checkPasswordRequirements = (password: string, oldPassword: string) => {
    const reqs = {
      minChars: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),

      notCurrent: password.length > 0 && password !== oldPassword, 
    };
    setPasswordRequirements(reqs);

    if (password.length > 0 && !reqs.minChars) {
        setNewPasswordError('A senha deve ter pelo menos 8 caracteres.');
    } else if (password.length > 0 && !reqs.hasUpper && !reqs.hasLower && !reqs.hasNumber && !reqs.hasSpecial) {
        setNewPasswordError('A senha precisa de mais complexidade.');
    } else {
        setNewPasswordError(null); 
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordRequirements(value, currentPassword);
    if (confirmNewPassword && value !== confirmNewPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
    } else {
      setConfirmPasswordError(null);
    }
    setError('');
  };

  const handleConfirmNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword && value !== newPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
    } else {
      setConfirmPasswordError(null);
    }
    setError('');
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    checkPasswordRequirements(newPassword, value); 
    setError('');
  };


  const validateForm = () => {
    let isValid = true;
    
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    setError('');

    if (!currentPassword.trim()) {
        setError('A senha atual é obrigatória.');
        isValid = false;
    }

    checkPasswordRequirements(newPassword, currentPassword);
    
    const allRequirementsMet = 
        passwordRequirements.minChars && 
        passwordRequirements.hasUpper && 
        passwordRequirements.hasLower && 
        passwordRequirements.hasNumber && 
        passwordRequirements.hasSpecial &&
        passwordRequirements.notCurrent; 

    if (!newPassword.trim()) { 
        setNewPasswordError('A nova senha é obrigatória.');
        isValid = false;
    } else if (!allRequirementsMet) {
        setNewPasswordError('A nova senha não atende a todos os requisitos.');
        isValid = false;
    }

    if (!confirmNewPassword.trim()) {
      setConfirmPasswordError('A confirmação da nova senha é obrigatória.');
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
      isValid = false;
    } 
    
    if (!isValid) {
        setError('Por favor, corrija os erros no formulário.');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setMessage(''); 

    if (!validateForm()) {
      return; 
    }
    
    setLoading(true); 
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage(response.data.message); 
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setNewPasswordError(null);
      setConfirmPasswordError(null);
      setPasswordRequirements({ 
        minChars: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false, notCurrent: false
      });

      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (err: unknown) { 
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) { 
        setError(err.message);
      } else { 
        setError('Ocorreu um erro desconhecido ao alterar a senha.');
      }
    } finally {
      setLoading(false); 
    }
  };

  const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <li style={{ display: 'flex', alignItems: 'center', color: met ? '#28a745' : '#6c757d', marginBottom: '5px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        {met ? (
          <polyline points="20 6 9 17 4 12" /> 
        ) : (
          <circle cx="12" cy="12" r="10" /> 
        )}
      </svg>
      {text}
    </li>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',      
    }}>
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
          <div style={{ marginBottom: '15px', textAlign: 'left', position: 'relative' }}>
            <label htmlFor="currentPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Senha Atual:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={handleCurrentPasswordChange} 
              onBlur={() => { // Valida ao sair
                if (!currentPassword.trim()) setError('A senha atual é obrigatória.');
                else setError('');
              }}
              required
              placeholder="Digite sua senha atual"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: `1px solid ${error.includes('senha atual') ? '#dc3545' : '#ccc'}`, 
                borderRadius: '5px', 
                marginTop: '5px' 
              }}
            />
             {error.includes('senha atual') && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{error}</p>}
          </div>

          <div style={{ marginBottom: '15px', textAlign: 'left', position: 'relative' }}>
            <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Nova Senha:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              onBlur={() => checkPasswordRequirements(newPassword, currentPassword)} 
              required
              placeholder="Crie sua nova senha"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: `1px solid ${newPasswordError ? '#dc3545' : '#ccc'}`, 
                borderRadius: '5px', 
                marginTop: '5px' 
              }}
            />
            {newPasswordError && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{newPasswordError}</p>}
            
            
            <ul style={{ listStyle: 'none', padding: '10px 0 0 0', margin: '0', fontSize: '0.9rem' }}>
                <RequirementItem met={passwordRequirements.minChars} text="Pelo menos 8 caracteres" />
                <RequirementItem met={passwordRequirements.hasUpper} text="Pelo menos 1 letra maiúscula" />
                <RequirementItem met={passwordRequirements.hasLower} text="Pelo menos 1 letra minúscula" />
                <RequirementItem met={passwordRequirements.hasNumber} text="Pelo menos 1 número" />
                <RequirementItem met={passwordRequirements.hasSpecial} text="Pelo menos 1 caractere especial" />
                <RequirementItem met={passwordRequirements.notCurrent} text="Não pode ser igual à senha atual" />
            </ul>
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left', position: 'relative' }}>
            <label htmlFor="confirmNewPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Confirmar Nova Senha:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
              onBlur={() => { 
                if (newPassword !== confirmNewPassword) {
                  setConfirmPasswordError('As senhas não coincidem.');
                } else {
                  setConfirmPasswordError(null);
                }
              }}
              required
              placeholder="Confirme sua nova senha"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: `1px solid ${confirmPasswordError ? '#dc3545' : '#ccc'}`, 
                borderRadius: '5px', 
                marginTop: '5px' 
              }}
            />
            {confirmPasswordError && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading} 
            style={{
              width: '100%',
              padding: '15px 20px', 
              backgroundColor: loading ? '#6c757d' : '#059669', 
              color: 'white',
              border: 'none',
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
              display: 'inline-flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.transform = 'translateY(-3px)'; }}}
            onMouseOut={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}}
          >
            {loading ? 'Alterando...' : 'Alterar Senha'} 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;