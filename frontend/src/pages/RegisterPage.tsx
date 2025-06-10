import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
interface ValidationErrors {
  username?: string;
  nome?: string;
  password?: string;
  tipo?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'0' | '1'>('1'); 

  const [error, setError] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const [showPassword, setShowPassword] = useState(false); 
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({}); 
  
  const [passwordRequirements, setPasswordRequirements] = useState({
    minChars: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const checkPasswordRequirements = (pwd: string) => {
    const reqs = {
      minChars: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };
    setPasswordRequirements(reqs);

    return Object.values(reqs).every(Boolean);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name: keyof ValidationErrors, value: string) => {
    let errorMessage = '';
    switch (name) {
      case 'username':
        if (!value.trim()) errorMessage = 'Usuário é obrigatório.';
        break;
      case 'nome':
        if (!value.trim()) errorMessage = 'Nome completo é obrigatório.';
        break;
      case 'password':
        if (!value.trim()) errorMessage = 'Senha é obrigatória.';
        break;
      default:
        break;
    }
    setValidationErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage; 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(''); 

    if (name === 'username') setUsername(value);
    else if (name === 'nome') setNome(value);
    else if (name === 'password') {
      setPassword(value);
      checkPasswordRequirements(value); 
    }
    else if (name === 'tipo') setTipo(value as '0' | '1');

    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        validateField(name as keyof ValidationErrors, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ValidationErrors, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: ValidationErrors = {};

    // Validações individuais
    if (validateField('username', username)) isValid = false;
    if (validateField('nome', nome)) isValid = false;
    if (validateField('password', password)) isValid = false; 

    const allPasswordReqsMet = checkPasswordRequirements(password);
    if (!allPasswordReqsMet) {
      newErrors.password = 'A senha não atende a todos os requisitos.';
      isValid = false;
    }

    setValidationErrors(newErrors);
    
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
      const response = await api.post('/auth/register', { username, password, nome, tipo });
      setMessage(response.data.message);
      setUsername('');
      setPassword('');
      setNome('');
      setTipo('1');
      setValidationErrors({});
      setPasswordRequirements({ minChars: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false });

      setTimeout(() => navigate('/login'), 2000); 
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao registrar usuário.');
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
        padding: '50px', 
        maxWidth: '450px', 
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

        <h2 style={{ color: '#2c3e50', fontSize: '2.5rem', fontWeight: '700', marginBottom: '30px' }}>Cadastro de Usuário</h2>
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label htmlFor="regUsername" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', color: '#555' }}>Usuário (Login):</label>
            <div style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="regUsername"
                name="username"
                value={username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: `1px solid ${validationErrors.username ? '#dc3545' : '#ddd'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              {validationErrors.username && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.username}</p>}
            </div>
          </div>


          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <label htmlFor="regNome" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', color: '#555' }}>Nome Completo:</label>
            <div style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
              </svg>
              <input
                type="text"
                id="regNome"
                name="nome"
                value={nome}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: `1px solid ${validationErrors.nome ? '#dc3545' : '#ddd'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              {validationErrors.nome && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.nome}</p>}
            </div>
          </div>


          <div style={{ marginBottom: '15px', textAlign: 'left', position: 'relative' }}>
            <label htmlFor="regPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Senha:</label>
            <div style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="regPassword"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 45px',
                  border: `1px solid ${validationErrors.password ? '#dc3545' : '#ddd'}`,
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
            {validationErrors.password && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.password}</p>}
            

            <ul style={{ listStyle: 'none', padding: '10px 0 0 0', margin: '0', fontSize: '0.9rem' }}>
                <RequirementItem met={passwordRequirements.minChars} text="Pelo menos 8 caracteres" />
                <RequirementItem met={passwordRequirements.hasUpper} text="Pelo menos 1 letra maiúscula" />
                <RequirementItem met={passwordRequirements.hasLower} text="Pelo menos 1 letra minúscula" />
                <RequirementItem met={passwordRequirements.hasNumber} text="Pelo menos 1 número" />
                <RequirementItem met={passwordRequirements.hasSpecial} text="Pelo menos 1 caractere especial" />
            </ul>
          </div>


          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="regTipo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Tipo de Usuário:</label>
            <select
              id="regTipo"
              name="tipo"
              value={tipo}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px', 
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="1">Usuário Comum</option>
              <option value="0">Administrador</option>
            </select>
          </div>

          {error && <p style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
          {message && <p style={{ color: '#28a745', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{message}</p>}
          <button
            type="submit"
            disabled={loading} 
            style={{
              width: '100%',
              padding: '14px', 
              backgroundColor: loading ? '#6c757d' : '#007bff', 
              color: 'white',
              border: 'none',
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#0056b3'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
            onMouseOut={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#007bff'; e.currentTarget.style.transform = 'translateY(0)'; }}}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem' }}>
          Já tem uma conta? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;