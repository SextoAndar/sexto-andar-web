import { useState } from 'react';
import Header from '../../components/Header/Header';
import Modal from '../../components/common/Modal/Modal';
import LoginForm from '../../components/LoginForm/LoginForm';
import './Home.css';

function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = async (formData) => {
    try {
      console.log('Dados de login:', formData);
      // Aqui você fará a chamada para sua API de autenticação
      // Exemplo: await authService.login(formData);
      
      alert('Login realizado com sucesso!');
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="home-page">
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      
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
      </main>

      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
      >
        <LoginForm 
          onSubmit={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Home;
