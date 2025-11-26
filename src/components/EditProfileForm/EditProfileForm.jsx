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
  const [error, setError] = useState(''); // General form error (e.g., from API)
  const [formErrors, setFormErrors] = useState({}); // Field-specific validation errors

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    // Clear field-specific error when user types
    setFormErrors(prev => ({ ...prev, [name]: '' })); 

    if (name === 'fullName') {
      const error = validateFullName(value);
      setFormErrors(prev => ({ ...prev, fullName: error }));
    }
    if (name === 'email') {
      const error = validateEmail(value);
      setFormErrors(prev => ({ ...prev, email: error }));
    }
    if (name === 'phoneNumber') {
      const error = validatePhoneNumber(value);
      setFormErrors(prev => ({ ...prev, phoneNumber: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-submission validation
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const phoneNumberError = validatePhoneNumber(formData.phoneNumber);
    if (fullNameError || emailError || phoneNumberError) {
      setFormErrors(prev => ({
        ...prev,
        fullName: fullNameError,
        email: emailError,
        phoneNumber: phoneNumberError,
      }));
      return;
    }
    // ... other validations ...
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
  const isSubmitDisabled = isLoading || !!formErrors.fullName || !!formErrors.email || !!formErrors.phoneNumber;

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
      {formErrors.fullName && <div className="error-message-text">{formErrors.fullName}</div>}

      <Input
        type="tel"
        label="Telefone"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        autoComplete="tel"
      />
      {formErrors.phoneNumber && <div className="error-message-text">{formErrors.phoneNumber}</div>}

      <Input
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />
      {formErrors.email && <div className="error-message-text">{formErrors.email}</div>}

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
        <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}

export default EditProfileForm;
