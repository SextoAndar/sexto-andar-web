import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import { fetchOwnerProperties } from '../../services/propertyService';
import './Header.css';
import PropertyRegisterModal from '../PropertyRegisterModal/PropertyRegisterModal';
import OwnerPropertiesModal from '../OwnerPropertiesModal/OwnerPropertiesModal';
import FavoritesModal from '../FavoritesModal/FavoritesModal';
import ProposalsModal from '../ProposalsModal/ProposalsModal';
import MyProposalsModal from '../MyProposalsModal/MyProposalsModal';
import MyVisitsModal from '../MyVisitsModal/MyVisitsModal';
import ReceivedVisitsModal from '../ReceivedVisitsModal/ReceivedVisitsModal';

function Header({ onLoginClick, onProfileClick, user, onLogout }) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOwnerPropertiesModalOpen, setIsOwnerPropertiesModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isProposalsModalOpen, setIsProposalsModalOpen] = useState(false);
  const [isMyProposalsModalOpen, setIsMyProposalsModalOpen] = useState(false);
  const [isMyVisitsModalOpen, setIsMyVisitsModalOpen] = useState(false);
  const [isReceivedVisitsModalOpen, setIsReceivedVisitsModalOpen] = useState(false);
  const [ownerProperties, setOwnerProperties] = useState([]);

  const handleLogout = async () => {
    await authService.logout();
    if (onLogout) onLogout();
  };

  const getProfilePictureUrl = (userId, hasProfilePicture) => {
    if (hasProfilePicture) {
      return `/auth/v1/auth/profile/picture/${userId}`; // Corrected path
    }
    return '/default-pp.png';
  };

  const handleAnnounceClick = (e) => {
    e.preventDefault();
    if (!user) {
      if (onLoginClick) onLoginClick();
      return;
    }
    if (user.role === 'PROPERTY_OWNER') {
      setIsRegisterModalOpen(true);
    }
  };

  const handleMyPropertiesClick = async () => {
    try {
      const data = await fetchOwnerProperties();
      setOwnerProperties(data.properties);
      setIsOwnerPropertiesModalOpen(true);
    } catch (error) {
      console.error(error.message);
      // Handles errors like 401 or other network issues.
      alert(`Ocorreu um erro ao buscar suas propriedades: ${error.message}`);
    }
  };

  const handleFavoritesClick = () => {
    setIsFavoritesModalOpen(true);
  };
  
  const handleProposalsClick = () => {
    setIsProposalsModalOpen(true);
  };

  const handleMyProposalsClick = () => {
    setIsMyProposalsModalOpen(true);
  };

  const handleMyVisitsClick = () => {
    setIsMyVisitsModalOpen(true);
  };

  const handleReceivedVisitsClick = () => {
    setIsReceivedVisitsModalOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">
              Sexto <span className="logo-highlight">Andar</span>
            </span>
          </div>

          <nav className="header-nav">
            {(!user || (user.role !== 'PROPERTY_OWNER' && user.role !== 'ADMIN')) && (
              <a href="#" className="nav-link">
                <span className="nav-icon">🏠</span>
                Alugar
              </a>
            )}
            {(!user || (user.role !== 'USER' && user.role !== 'ADMIN')) && (
              <a href="#" className="nav-link" onClick={handleAnnounceClick}>
                <span className="nav-icon">➕</span>
                Anunciar
              </a>
            )}
            {user && user.role === 'PROPERTY_OWNER' && (
              <>
                <a href="#" className="nav-link" onClick={handleMyPropertiesClick}>
                  <span className="nav-icon">🏠</span>
                  Minhas Propriedades
                </a>
                <a href="#" className="nav-link" onClick={handleProposalsClick}>
                  <span className="nav-icon">✉️</span>
                  Propostas Recebidas
                </a>
                <a href="#" className="nav-link" onClick={handleReceivedVisitsClick}>
                  <span className="nav-icon">🗓️</span>
                  Visitas Recebidas
                </a>
              </>
            )}
            {user && user.role === 'USER' && (
              <>
                <a href="#" className="nav-link" onClick={handleFavoritesClick}>
                  <span className="nav-icon">❤️</span>
                  Favoritos
                </a>
                <a href="#" className="nav-link" onClick={handleMyProposalsClick}>
                  <span className="nav-icon">✉️</span>
                  Minhas Propostas
                </a>
                <a href="#" className="nav-link" onClick={handleMyVisitsClick}>
                  <span className="nav-icon">🗓️</span>
                  Minhas Visitas
                </a>
              </>
            )}
          </nav>

          {user ? (
            <div className="header-user">
              <button className="user-profile-btn" onClick={onProfileClick}>
                <span className="user-name">{user.fullName || user.username}</span>
                <img
                  src={getProfilePictureUrl(user.id, user.hasProfilePicture)}
                  alt="Profile"
                  className="user-avatar"
                  onError={(e) => e.target.src = '/default-pp.png'}
                />
              </button>
              <button className="header-logout-btn" onClick={handleLogout} title="Sair">Sair</button>
            </div>
          ) : (
            <button className="header-login-btn" onClick={onLoginClick}>
              Entrar
            </button>
          )}
        </div>
      </header>
      <PropertyRegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      <OwnerPropertiesModal 
        isOpen={isOwnerPropertiesModalOpen} 
        onClose={() => setIsOwnerPropertiesModalOpen(false)} 
        properties={ownerProperties}
        user={user}
      />
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        user={user}
      />
      <ProposalsModal
        isOpen={isProposalsModalOpen}
        onClose={() => setIsProposalsModalOpen(false)}
        user={user}
      />
      <MyProposalsModal
        isOpen={isMyProposalsModalOpen}
        onClose={() => setIsMyProposalsModalOpen(false)}
        user={user}
      />
      <MyVisitsModal
        isOpen={isMyVisitsModalOpen}
        onClose={() => setIsMyVisitsModalOpen(false)}
      />
      <ReceivedVisitsModal
        isOpen={isReceivedVisitsModalOpen}
        onClose={() => setIsReceivedVisitsModalOpen(false)}
      />
    </>
  );
}

export default Header;
