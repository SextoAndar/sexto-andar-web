import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Modal from '../../components/common/Modal/Modal';
import LoginForm from '../../components/LoginForm/LoginForm';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import authService from '../../services/authService';
import PropertiesList from '../PropertiesList/PropertiesList';
import './Home.css';

function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(authService.getUser());
  // Checa sessão ao carregar o app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('user');
          setIsLoginModalOpen(true);
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
        setIsLoginModalOpen(true);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      console.log('Login realizado com sucesso:', response.user);
      alert(`Bem-vindo(a), ${response.user.fullName}!`);
      setIsLoginModalOpen(false);
      // Atualiza user após login
      const me = await authService.getMe();
      setUser(me);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert(`Erro ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      // 1. Cadastro (não faz login automático)
      const registerResponse = await authService.register(formData);
      console.log('Cadastro realizado com sucesso:', registerResponse.user);
      
      // 2. Login automático após cadastro
      const loginResponse = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login automático realizado:', loginResponse.user);
      const userName = loginResponse.user?.fullName || loginResponse.user?.username || 'usuário';
      alert(`Conta criada com sucesso! Bem-vindo(a), ${userName}!`);
      setIsLoginModalOpen(false);
      // Atualiza user após cadastro/login
      const me = await authService.getMe();
      setUser(me);
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      alert(`Erro ao criar conta: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    // Se tiver userType, é cadastro, senão é login
    if (formData.userType) {
      await handleRegister(formData);
    } else {
      await handleLogin(formData);
    }
  };

  return (
    <div className="home-page">
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />
      
      <main className="home-content">
        <section className="hero-section">
          <h1>Seu próximo lar está aqui</h1>
          <p>Encontre o imóvel perfeito com praticidade e segurança</p>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar por cidade ou bairro" 
              className="search-input"
            />
            <button className="search-button">Buscar Imóveis</button>
          </div>
        </section>

        <PropertiesList />
      </main>

      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
      >
        <LoginForm 
          onSubmit={handleFormSubmit}
          onClose={() => setIsLoginModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title="Meu Perfil"
      >
        {user && <ProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} />}
      </Modal>
    </div>
  );
}

export default Home;
