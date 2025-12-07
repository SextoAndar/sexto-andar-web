import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import { fetchOwnerProperties } from '../../services/propertyService';
import logger from '../../utils/logger'; // Import logger utility
import { MdAddCircleOutline, MdHome, MdMailOutline, MdCalendarToday, MdFavoriteBorder } from 'react-icons/md';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async () => {
    await authService.logout();
    if (onLogout) onLogout();
    setIsMobileMenuOpen(false); // Close mobile menu on logout
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
      logger.error(error.message); // Using logger
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
            <img src="/logo.png" alt="Sexto Andar Logo" className="logo-icon" />
            <span className="logo-text">
              Sexto <span className="logo-highlight">Andar</span>
            </span>
          </div>

          <button className="hamburger-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <nav className="header-nav desktop-nav"> {/* Desktop navigation */}
            {(!user || (user.role !== 'USER' && user.role !== 'ADMIN')) && (
              <a href="#" className="nav-link" onClick={handleAnnounceClick}>
                <MdAddCircleOutline className="nav-icon" />
                Anunciar
              </a>
            )}
            {user && user.role === 'PROPERTY_OWNER' && (
              <>
                <a href="#" className="nav-link" onClick={handleMyPropertiesClick}>
                  <MdHome className="nav-icon" />
                  Minhas Propriedades
                </a>
                <a href="#" className="nav-link" onClick={handleProposalsClick}>
                  <MdMailOutline className="nav-icon" />
                  Propostas Recebidas
                </a>
                <a href="#" className="nav-link" onClick={handleReceivedVisitsClick}>
                  <MdCalendarToday className="nav-icon" />
                  Visitas Recebidas
                </a>
              </>
            )}
            {user && user.role === 'USER' && (
              <>
                <a href="#" className="nav-link" onClick={handleFavoritesClick}>
                  <MdFavoriteBorder className="nav-icon" />
                  Favoritos
                </a>
                <a href="#" className="nav-link" onClick={handleMyProposalsClick}>
                  <MdMailOutline className="nav-icon" />
                  Minhas Propostas
                </a>
                <a href="#" className="nav-link" onClick={handleMyVisitsClick}>
                  <MdCalendarToday className="nav-icon" />
                  Minhas Visitas
                </a>
              </>
            )}
          </nav>

          <div className="header-user-desktop"> {/* Desktop user section */}
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
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            {(!user || (user.role !== 'USER' && user.role !== 'ADMIN')) && (
              <a href="#" className="nav-link" onClick={() => { handleAnnounceClick(); setIsMobileMenuOpen(false); }}>
                <MdAddCircleOutline className="nav-icon" />
                Anunciar
              </a>
            )}
            {user && user.role === 'PROPERTY_OWNER' && (
              <>
                <a href="#" className="nav-link" onClick={() => { handleMyPropertiesClick(); setIsMobileMenuOpen(false); }}>
                  <MdHome className="nav-icon" />
                  Minhas Propriedades
                </a>
                <a href="#" className="nav-link" onClick={() => { handleProposalsClick(); setIsMobileMenuOpen(false); }}>
                  <MdMailOutline className="nav-icon" />
                  Propostas Recebidas
                </a>
                <a href="#" className="nav-link" onClick={() => { handleReceivedVisitsClick(); setIsMobileMenuOpen(false); }}>
                  <MdCalendarToday className="nav-icon" />
                  Visitas Recebidas
                </a>
              </>
            )}
            {user && user.role === 'USER' && (
              <>
                <a href="#" className="nav-link" onClick={() => { handleFavoritesClick(); setIsMobileMenuOpen(false); }}>
                  <MdFavoriteBorder className="nav-icon" />
                  Favoritos
                </a>
                <a href="#" className="nav-link" onClick={() => { handleMyProposalsClick(); setIsMobileMenuOpen(false); }}>
                  <MdMailOutline className="nav-icon" />
                  Minhas Propostas
                </a>
                <a href="#" className="nav-link" onClick={() => { handleMyVisitsClick(); setIsMobileMenuOpen(false); }}>
                  <MdCalendarToday className="nav-icon" />
                  Minhas Visitas
                </a>
              </>
            )}
          </nav>

          <div className="mobile-user-actions">
            {user ? (
              <>
                <button className="user-profile-btn" onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}>
                  <span className="user-name">{user.fullName || user.username}</span>
                  <img
                    src={getProfilePictureUrl(user.id, user.hasProfilePicture)}
                    alt="Profile"
                    className="user-avatar"
                    onError={(e) => e.target.src = '/default-pp.png'}
                  />
                </button>
                <button className="header-logout-btn" onClick={handleLogout} title="Sair">Sair</button>
              </>
            ) : (
              <button className="header-login-btn" onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}>
                Entrar
              </button>
            )}
          </div>
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