import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <h1>Bem-vindo ao Sexto Andar</h1>
      <p>Página inicial do seu aplicativo</p>
      <Link to="/login" className="home-link">
        Ir para Login
      </Link>
    </div>
  );
}

export default Home;
