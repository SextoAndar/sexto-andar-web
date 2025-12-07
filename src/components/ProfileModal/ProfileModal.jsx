import { useState, useRef, useEffect } from 'react';
import authService from '../../services/authService';
import { getPortfolioStats, getFavoritesCount } from '../../services/propertyService';
import EditProfileForm from '../EditProfileForm/EditProfileForm';
import logger from '../../utils/logger'; // Import logger utility
import { MdBusiness, MdCheckCircle, MdHome, MdApartment, MdAttachMoney, MdFavorite, MdCalendarToday, MdBarChart, MdNotifications, MdLogout, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import './ProfileModal.css';

const StatCard = ({ icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p className="stat-number">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

function ProfileModal({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('geral');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [stats, setStats] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(
    user.hasProfilePicture
      ? `/auth/v1/auth/profile/picture/${user.id}`
      : '/default-pp.png'
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (activeTab === 'geral') {
      if (currentUser.role === 'PROPERTY_OWNER' && !stats) {
        const fetchStats = async () => {
          try {
            const data = await getPortfolioStats();
            setStats(data);
          } catch (error) {
            logger.error('Erro ao buscar estatísticas:', error);
          }
        };
        fetchStats();
      } else if (currentUser.role === 'USER') {
        const fetchFavoritesCount = async () => {
          try {
            const data = await getFavoritesCount();
            setFavoritesCount(data.count);
          } catch (error) {
            logger.error('Erro ao buscar contagem de favoritos:', error);
          }
        };
        fetchFavoritesCount();
      }
    }
  }, [activeTab, currentUser.role, stats]);

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
      if (error.message === 'SESSION_EXPIRED') {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        await authService.logout();
        window.location.reload();
        return;
      }
      alert(`Erro ao atualizar perfil: ${error.message}`);
      logger.error('Erro detalhado:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta permanentemente? Esta ação é IRREVERSÍVEL.')) {
      return; // Usuário cancelou
    }

    if (!window.confirm('Você está CONSCIENTE de que todos os seus dados, propriedades, propostas e visitas serão APAGADOS de forma PERMANENTE?')) {
      return; // Usuário cancelou
    }

    try {
      await authService.deleteAccount();
      alert('Sua conta foi excluída permanentemente. Você será desconectado.');
      onClose(); // Close the profile modal
      window.location.href = '/'; // Redirect to home/login page
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao excluir sua conta. Por favor, tente novamente.';
      if (error.message.includes('Não autenticado')) {
        errorMessage = 'Sessão expirada ou não autorizado. Por favor, faça login novamente.';
        onClose();
        window.location.href = '/';
      } else if (error.message) {
        errorMessage = error.message; // Use the specific error message from authService
      }
      alert(`Erro: ${errorMessage}`);
      logger.error('Erro detalhado ao excluir conta:', error);
    }
  };


  const refreshProfilePicture = (hasProfilePicture) => {
    if (hasProfilePicture) {
      setImgSrc(`/auth/v1/auth/profile/picture/${currentUser.id}?t=${Date.now()}`);
    } else {
      setImgSrc('/default-pp.png');
    }
  };

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

  const renderOwnerStats = () => {
    if (!stats) return <p>Carregando estatísticas...</p>;
    return (
      <div className="profile-stats owner-stats">
        <StatCard icon={<MdBusiness />} label="Total de Imóveis" value={stats.total_properties} />
        <StatCard icon={<MdCheckCircle />} label="Imóveis Ativos" value={stats.active_properties} />
        <StatCard icon={<MdHome />} label="Casas" value={stats.total_houses} />
        <StatCard icon={<MdApartment />} label="Apartamentos" value={stats.total_apartments} />
        <StatCard icon={<MdAttachMoney />} label="Valor do Portfólio" value={formatCurrency(stats.total_portfolio_value)} />
        <StatCard icon={<MdAttachMoney />} label="Aluguel Potencial" value={formatCurrency(stats.total_monthly_rent_potential)} />
      </div>
    );
  };

  const renderUserStats = () => (
    <div className="profile-stats">
      <StatCard icon={<MdFavorite />} label="Favoritos" value={favoritesCount} />
      <StatCard icon={<MdCalendarToday />} label="Visitações" value="3" />
      <StatCard icon={<MdBarChart />} label="Buscas" value="12" />
    </div>
  );

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
              <MdClose />
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
          {currentUser.role === 'PROPERTY_OWNER' ? renderOwnerStats() : renderUserStats()}

          <div className="profile-actions">
            <button className="action-btn secondary"><MdNotifications /> Notificações</button>
            <button className="action-btn danger" onClick={handleLogout}><MdLogout /> Sair</button>
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

              <div className="profile-actions">
                <button className="action-btn secondary" onClick={() => setIsEditing(true)}>
                  <MdEdit /> Editar Perfil
                </button>
                <button className="action-btn danger" onClick={handleDeleteAccount}>
                  <MdDelete /> Excluir Conta
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
