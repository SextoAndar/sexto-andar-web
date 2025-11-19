import { useState, useRef } from 'react';
import authService from '../../services/authService';
import EditProfileForm from '../EditProfileForm/EditProfileForm';
import './ProfileModal.css';

function ProfileModal({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('geral');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [imgSrc, setImgSrc] = useState(
    user.hasProfilePicture
      ? `http://localhost:8001/auth/profile/picture/${user.id}`
      : '/default-pp.png'
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  const handleLogout = async () => {
    await authService.logout();
    window.location.reload();
  };

  const handleSaveProfile = async (updateData) => {
    try {
      const updatedUser = await authService.updateProfile(updateData);
      setCurrentUser(updatedUser);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
      window.location.reload(); // Recarrega para atualizar header
    } catch (error) {
      // Se erro de sessão expirada
      if (error.message === 'SESSION_EXPIRED') {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        await authService.logout();
        window.location.reload();
        return;
      }
      
      // Mostra mensagem de erro amigável
      alert(`Erro ao atualizar perfil: ${error.message}`);
      console.error('Erro detalhado:', error);
    }
  };


  // Atualiza preview da foto
  const refreshProfilePicture = (hasProfilePicture) => {
    if (hasProfilePicture) {
      setImgSrc(`http://localhost:8001/auth/profile/picture/${currentUser.id}?t=${Date.now()}`);
    } else {
      setImgSrc('/default-pp.png');
    }
  };

  // Upload handler
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo 5MB');
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Formato inválido! Use JPEG, PNG ou GIF');
      return;
    }
    setIsUploading(true);
    try {
      const result = await authService.uploadProfilePicture(file);
      setCurrentUser(result.user);
      refreshProfilePicture(true);
      alert('Foto de perfil atualizada!');
    } catch (err) {
      alert('Erro ao enviar foto: ' + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remover foto
  const handleDeletePhoto = async () => {
    if (!window.confirm('Remover foto de perfil?')) return;
    setIsUploading(true);
    try {
      const result = await authService.deleteProfilePicture();
      setCurrentUser(result.user);
      refreshProfilePicture(false);
      alert('Foto removida!');
    } catch (err) {
      alert('Erro ao remover foto: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getRoleLabel = (role) => {
    const roles = {
      'USER': 'Usuário',
      'PROPERTY_OWNER': 'Proprietário',
      'ADMIN': 'Administrador'
    };
    return roles[role] || role;
  };

  return (
    <div className="profile-modal-content">
      <div className="profile-header">
        <div style={{ position: 'relative' }}>
          <img
            src={imgSrc}
            alt="Profile"
            className="profile-avatar-large"
            onError={(e) => e.target.src = '/default-pp.png'}
            style={{ cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
            title="Clique para alterar foto"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          />
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handlePhotoChange}
            disabled={isUploading}
          />
          {currentUser.hasProfilePicture && (
            <button
              className="action-btn danger"
              style={{ position: 'absolute', top: 0, right: 0, padding: '0.3rem 0.7rem', fontSize: '0.9rem' }}
              onClick={handleDeletePhoto}
              disabled={isUploading}
              title="Remover foto"
            >
              ✖
            </button>
          )}
        </div>
        <div className="profile-info">
          <h2>{currentUser.fullName}</h2>
          <p className="profile-username">@{currentUser.username}</p>
          <span className="profile-role">{getRoleLabel(currentUser.role)}</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'geral' ? 'active' : ''}`}
          onClick={() => setActiveTab('geral')}
        >
          Visão Geral
        </button>
        <button 
          className={`profile-tab ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Perfil
        </button>
      </div>

      {activeTab === 'geral' && (
        <>
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <p className="stat-number">1</p>
                <p className="stat-label">Favoritos</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <p className="stat-number">3</p>
                <p className="stat-label">Visitações</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <p className="stat-number">12</p>
                <p className="stat-label">Buscas</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-btn secondary">⚙️ Configurações</button>
            <button className="action-btn secondary">🔔 Notificações</button>
            <button className="action-btn danger" onClick={handleLogout}>🚪 Sair</button>
          </div>
        </>
      )}

      {activeTab === 'perfil' && (
        <div className="profile-details">
          {isEditing ? (
            <EditProfileForm
              user={currentUser}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <h3>Informações do Perfil</h3>
              
              <div className="detail-item">
                <label>Nome</label>
                <p>{currentUser.fullName}</p>
              </div>

              <div className="detail-item">
                <label>Email</label>
                <p>{currentUser.email}</p>
              </div>

              <div className="detail-item">
                <label>Telefone</label>
                <p>{currentUser.phoneNumber}</p>
              </div>

              <div className="detail-item">
                <label>Username</label>
                <p>{currentUser.username}</p>
              </div>

              <div className="detail-item">
                <label>Membro desde</label>
                <p>{formatDate(currentUser.created_at)}</p>
              </div>

              <div className="profile-actions" style={{ marginTop: '2rem' }}>
                <button className="action-btn secondary" onClick={() => setIsEditing(true)}>
                  ✏️ Editar Perfil
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={isUploading}
                >
                  📸 {isUploading ? 'Enviando...' : 'Alterar Foto'}
                </button>
                {currentUser.hasProfilePicture && (
                  <button
                    className="action-btn danger"
                    onClick={handleDeletePhoto}
                    disabled={isUploading}
                  >
                    Remover Foto
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Aba de configurações removida */}
    </div>
  );
}

export default ProfileModal;
