import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import './Header.css';

function Header({ onLoginClick, onProfileClick }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se há usuário logado ao carregar
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    window.location.reload();
  };

  const getProfilePictureUrl = (userId, hasProfilePicture) => {
    if (hasProfilePicture) {
      return `http://localhost:8001/auth/profile/picture/${userId}`;
    }
    return '/default-pp.png';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">
            Sexto <span className="logo-highlight">Andar</span>
          </span>
        </div>

        <nav className="header-nav">
          <a href="#" className="nav-link">
            <span className="nav-icon">🏠</span>
            Alugar
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">➕</span>
            Anunciar
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">🔍</span>
            Buscar
          </a>
          {user && (
            <a href="#" className="nav-link">
              <span className="nav-icon">❤️</span>
              Favoritos
            </a>
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
          </div>
        ) : (
          <button className="header-login-btn" onClick={onLoginClick}>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
