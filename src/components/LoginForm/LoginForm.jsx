import { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import './LoginForm.css';

function LoginForm({ onSubmit, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />
        <Input
          type="password"
          label="Senha"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Sua senha"
          required
        />
        <Button type="submit" variant="primary">
          Entrar
        </Button>
      </form>

      <div className="login-footer">
        <a href="#" className="forgot-password">Esqueci minha senha</a>
      </div>
    </div>
  );
}

export default LoginForm;
