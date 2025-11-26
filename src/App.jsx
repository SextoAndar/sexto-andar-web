import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ErrorModal from './components/common/ErrorModal/ErrorModal';
import './App.css';

function App() {
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', title: '' });

  useEffect(() => {
    const handleError = (event) => {
      const { message, title } = event.detail;
      setErrorModal({ isOpen: true, message: message || 'Ocorreu um erro desconhecido.', title: title || 'Erro Inesperado' });
    };

    window.addEventListener('showErrorModal', handleError);

    return () => {
      window.removeEventListener('showErrorModal', handleError);
    };
  }, []);

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: '', title: '' });
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={handleCloseErrorModal}
        title={errorModal.title}
        errorMessage={errorModal.message}
      />
    </>
  );
}

export default App;
