import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importe useNavigate
import api from '../services/api';

interface ValidationErrors {
  email?: string;
}

const RecoverPasswordPage: React.FC = () => {
  const navigate = useNavigate(); // Use o hook useNavigate
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = (name: keyof ValidationErrors, value: string) => {
    let errorMessage = '';
    if (!value.trim()) {
      errorMessage = 'Campo obrigatório.';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) { // Validação de formato de email
        errorMessage = 'Formato de email inválido.';
    }
    setValidationErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmail(value);
    setError(''); // Limpa erro geral ao digitar
    validateField(name as keyof ValidationErrors, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ValidationErrors, value);
  };

  const validateForm = () => {
    let isValid = true;
    if (validateField('email', email)) isValid = false; // Valida o campo 'email'

    // Força atualização visual dos erros (garante que todos os erros sejam exibidos)
    setValidationErrors((prev) => ({ ...prev, email: validationErrors.email || '' }));
    
    if (!isValid) {
      setError('Por favor, preencha o campo corretamente.');
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

    setLoading(true); // Inicia o carregamento
    try {
      // Nota: Esta rota é apenas simulada. A recuperação real exigiria um backend para enviar e-mail.
      const response = await api.post('/auth/recover-password', { email }); // Usa 'email' no payload
      setMessage(response.data.message);
      setEmail(''); // Limpa o campo após o envio
      setTimeout(() => navigate('/login'), 3000); // Redireciona para o login após 3 segundos
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response: { data?: { message?: string } } }).response?.data?.message) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido ao solicitar recuperação de senha.');
      }
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // REMOVIDO: minHeight: '100vh',
      // REMOVIDO: background: 'linear-gradient(to bottom right, #f0f4f8, #e0e7ed)',
    }}>
      <div style={{
        padding: '50px', // O padding foi alterado para 30px no meu último código, mas no seu está 50px. Mantenho o que está no seu, que é 50px.
        maxWidth: '450px', // Ajustado para corresponder ao padrão
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '12px', // Bordas arredondadas
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)', // Sombra
        position: 'relative', // Para posicionar o botão de voltar
        textAlign: 'center'
      }}>
        {/* Botão de Voltar */}
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

        <h2 style={{ color: '#2c3e50', fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px' }}>Recuperar Senha</h2>
        <p style={{ color: '#607d8b', fontSize: '0.95rem', marginBottom: '30px' }}>
          Informe seu e-mail para iniciar o processo de recuperação de senha.
          {/* Removido "(simulando e-mail)" se a intenção é que seja real ou menos confuso */}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label htmlFor="recoverEmail" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left', color: '#555' }}>E-mail Cadastrado:</label> {/* Mudado para 'E-mail Cadastrado' */}
            <div style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                    type="email" // Alterado para type="email" para validação nativa do navegador
                    id="recoverEmail"
                    name="email" // Alterado name para 'email'
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="seu.email@exemplo.com" // Ajustado placeholder
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 45px',
                        border: `1px solid ${validationErrors.email ? '#dc3545' : '#ddd'}`, // Borda vermelha se erro
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
            {validationErrors.email && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{validationErrors.email}</p>}
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
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>
        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.95rem' }}>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Voltar para o Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;