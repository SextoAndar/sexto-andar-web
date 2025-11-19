import './Header.css';

function Header({ onLoginClick }) {
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
        </nav>

        <button className="header-login-btn" onClick={onLoginClick}>
          Entrar
        </button>
      </div>
    </header>
  );
}

export default Header;
