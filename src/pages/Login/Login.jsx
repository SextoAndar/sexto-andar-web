import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      console.log('Dados de login:', formData);
      // Aqui você fará a chamada para sua API de autenticação
      // Exemplo: await authService.login(formData);
      
      // Por enquanto, apenas simula o login
      alert('Login realizado com sucesso!');
      // navigate('/dashboard'); // Redireciona após login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Sexto Andar</h1>
          <p>Faça login para continuar</p>
        </div>
        <LoginForm onSubmit={handleLogin} />
        <div className="login-footer">
          <a href="#" className="forgot-password">Esqueceu sua senha?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
