import { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import Select from '../common/Select/Select';
import Checkbox from '../common/Checkbox/Checkbox';
import './LoginForm.css';

function LoginForm({ onSubmit, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: 'Inquilino',
    password: '',
    acceptTerms: false
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      onSubmit(loginData);
    } else {
      onSubmit(signupData);
    }
  };

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
            type="email"
            label="Email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            placeholder="seu@email.com"
            required
          />
          <Input
            type="password"
            label="Senha"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="Sua senha"
            required
          />
          <Button type="submit" variant="primary">
            Entrar
          </Button>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Nome Completo"
            name="fullName"
            value={signupData.fullName}
            onChange={handleSignupChange}
            placeholder="Seu nome completo"
            required
          />
          <Input
            type="email"
            label="Email"
            name="email"
            value={signupData.email}
            onChange={handleSignupChange}
            placeholder="seu@email.com"
            required
          />
          <Input
            type="tel"
            label="Telefone"
            name="phone"
            value={signupData.phone}
            onChange={handleSignupChange}
            placeholder="(11) 99999-9999"
            required
          />
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
          />
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
          <Button type="submit" variant="primary">
            Criar Conta
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
