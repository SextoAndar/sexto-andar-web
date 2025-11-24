import { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import './EditProfileForm.css';

function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError('Digite sua senha atual para alterar a senha');
      return;
    }

    if (formData.email !== user.email && !formData.currentPassword) {
      setError('Digite sua senha atual para alterar o email');
      return;
    }

    setIsLoading(true);

    try {
      // Monta objeto com apenas campos alterados
      const updateData = {};
      
      if (formData.fullName !== user.fullName) {
        updateData.fullName = formData.fullName;
      }
      
      if (formData.phoneNumber !== user.phoneNumber) {
        updateData.phoneNumber = formData.phoneNumber;
      }
      
      if (formData.email !== user.email) {
        updateData.email = formData.email;
        updateData.currentPassword = formData.currentPassword;
      }
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await onSave(updateData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const needsPassword = formData.email !== user.email || formData.newPassword;

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h3>Editar Perfil</h3>

      {error && <div className="error-message">{error}</div>}

      <Input
        type="text"
        label="Nome Completo"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <Input
        type="tel"
        label="Telefone"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />

      <Input
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <div className="password-section">
        <h4>Alterar Senha (opcional)</h4>
        
        {needsPassword && (
          <Input
            type="password"
            label="Senha Atual"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Digite sua senha atual"
            required={needsPassword}
            autoComplete="current-password"
          />
        )}

        <Input
          type="password"
          label="Nova Senha"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Deixe em branco para não alterar"
          autoComplete="new-password"
        />

        {formData.newPassword && (
          <Input
            type="password"
            label="Confirmar Nova Senha"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Digite a nova senha novamente"
            required
            autoComplete="new-password"
          />
        )}
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}

export default EditProfileForm;
