import { useState, useRef } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import Select from '../common/Select/Select';
import Checkbox from '../common/Checkbox/Checkbox';
import './LoginForm.css';

function LoginForm({ onSubmit, onClose, isLoading }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [signupData, setSignupData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    userType: 'Inquilino',
    password: '',
    acceptTerms: false
  });
  const [signupErrors, setSignupErrors] = useState({});

  const loginUsernameRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupPasswordRef = useRef(null);

  const validateUsername = (username) => {
    if (username.length < 3) {
      return 'Mínimo de 3 caracteres.';
    }
    if (username.length > 50) {
      return 'Máximo de 50 caracteres.';
    }
    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      return 'Apenas letras, números e underscore (_).';
    }
    return ''; // No error
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Mínimo de 8 caracteres.';
    }
    return ''; // No error
  };

  const validateFullName = (fullName) => {
    if (!fullName.trim()) {
      return 'Nome completo é obrigatório.';
    }
    if (fullName.length > 100) {
      return 'Máximo de 100 caracteres.';
    }
    return ''; // No error
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email é obrigatório.';
    }
    if (email.length > 255) {
      return 'Máximo de 255 caracteres.';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Formato de email inválido.';
    }
    return ''; // No error
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber.trim()) {
      return ''; // Optional, so empty is valid
    }
    if (phoneNumber.length > 20) {
      return 'Máximo de 20 caracteres (incluindo não-numéricos).';
    }
    const cleanedNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
      return 'Número deve ter entre 10 e 15 dígitos.';
    }
    return ''; // No error
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'username') {
      const error = validateUsername(value);
      setLoginErrors(prev => ({ ...prev, username: error }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'fullName') {
      const error = validateFullName(value);
      setSignupErrors(prev => ({ ...prev, fullName: error }));
    }
    if (name === 'email') {
      const error = validateEmail(value);
      setSignupErrors(prev => ({ ...prev, email: error }));
    }
    if (name === 'phone') {
      const error = validatePhoneNumber(value);
      setSignupErrors(prev => ({ ...prev, phone: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'login') {
      // ... (login logic)
    } else { // activeTab === 'signup'
      const usernameError = validateUsername(signupData.username);
      const passwordError = validatePassword(signupData.password);
      const fullNameError = validateFullName(signupData.fullName);
      const emailError = validateEmail(signupData.email);
      const phoneError = validatePhoneNumber(signupData.phone);
      const acceptTermsError = signupData.acceptTerms ? '' : 'Você deve aceitar os termos de uso.';

      // Combine all signup errors for pre-submission validation
      const newSignupErrors = {
        username: usernameError,
        password: passwordError,
        fullName: fullNameError,
        email: emailError,
        phone: phoneError,
        acceptTerms: acceptTermsError,
      };
      setSignupErrors(newSignupErrors);

      // Check if any critical errors exist
      if (usernameError || passwordError || fullNameError || emailError || phoneError || acceptTermsError || !signupData.acceptTerms) {
        return;
      }

      // ... (submit logic)
    }
  };

  const isLoginButtonDisabled = isLoading || !!loginErrors.username;
  const isSignupButtonDisabled = isLoading || !!signupErrors.username || !!signupErrors.password || !!signupErrors.fullName || !!signupErrors.email || !!signupErrors.phone || !!signupErrors.acceptTerms || !signupData.acceptTerms;

  const userTypeOptions = [
    { value: 'Inquilino', label: 'Inquilino' },
    { value: 'Proprietário', label: 'Proprietário' }
  ];

  return (
    <div className="login-modal-content">
      <div className="login-modal-header">
        <h2>
          Bem-vindo ao <span className="brand-highlight">Sexto Andar</span>
        </h2>
        <p className="login-subtitle">Faça login ou crie sua conta para continuar</p>
      </div>

      <div className="login-tabs">
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Entrar
        </button>
        <button
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Criar Conta
        </button>
      </div>

      {activeTab === 'login' ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Username"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
            placeholder="Seu username"
            required
            autoComplete="username"
            ref={loginUsernameRef}
          />
          {loginErrors.username && <div className="error-message-text">{loginErrors.username}</div>}
          <Input
            type="password"
            label="Senha"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="Sua senha"
            required
            autoComplete="current-password"
            ref={loginPasswordRef}
          />
          <Button type="submit" variant="primary" disabled={isLoginButtonDisabled}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Username"
            name="username"
            value={signupData.username}
            onChange={handleSignupChange}
            placeholder="Escolha um username"
            required
            autoComplete="username"
          />
          {signupErrors.username && <div className="error-message-text">{signupErrors.username}</div>}
          <Input
            type="text"
            label="Nome Completo"
            name="fullName"
            value={signupData.fullName}
            onChange={handleSignupChange}
            placeholder="Seu nome completo"
            required
            autoComplete="name"
          />
          {signupErrors.fullName && <div className="error-message-text">{signupErrors.fullName}</div>}
          <Input
            type="email"
            label="Email"
            name="email"
            value={signupData.email}
            onChange={handleSignupChange}
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
          {signupErrors.email && <div className="error-message-text">{signupErrors.email}</div>}
          <Input
            type="tel"
            label="Telefone"
            name="phone"
            value={signupData.phone}
            onChange={handleSignupChange}
            placeholder="(11) 99999-9999"
            required
            autoComplete="tel"
          />
          {signupErrors.phone && <div className="error-message-text">{signupErrors.phone}</div>}
          <Select
            label="Tipo de Usuário"
            name="userType"
            value={signupData.userType}
            onChange={handleSignupChange}
            options={userTypeOptions}
            required
          />
          <Input
            type="password"
            label="Senha"
            name="password"
            value={signupData.password}
            onChange={handleSignupChange}
            placeholder="Crie uma senha segura"
            required
            autoComplete="new-password"
            ref={signupPasswordRef}
          />
          {signupErrors.password && <div className="error-message-text">{signupErrors.password}</div>}
          <Checkbox
            name="acceptTerms"
            checked={signupData.acceptTerms}
            onChange={handleSignupChange}
            label={
              <>
                Aceito os <a href="#" onClick={(e) => e.preventDefault()}>termos de uso</a> e <a href="#" onClick={(e) => e.preventDefault()}>política de privacidade</a>
              </>
            }
            required
          />
          {signupErrors.acceptTerms && <div className="error-message-text">{signupErrors.acceptTerms}</div>}
          <Button type="submit" variant="primary" disabled={isSignupButtonDisabled}>
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
      )}

      {activeTab === 'login' && (
        <div className="login-footer">
          <a href="#" className="forgot-password">Esqueci minha senha</a>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
