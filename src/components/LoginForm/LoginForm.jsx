import { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import './LoginForm.css';

function LoginForm({ onSubmit }) {
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
        placeholder="Digite sua senha"
        required
      />
      <Button type="submit" variant="primary">
        Entrar
      </Button>
    </form>
  );
}

export default LoginForm;
