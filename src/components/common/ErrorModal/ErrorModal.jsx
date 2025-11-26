import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import './ErrorModal.css';

function ErrorModal({ isOpen, onClose, title = "Ocorreu um Erro", errorMessage }) {
  const [copyButtonText, setCopyButtonText] = useState('Copiar Erro');

  const handleCopy = () => {
    navigator.clipboard.writeText(errorMessage).then(() => {
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar Erro'), 2000); // Reset after 2s
    }).catch(err => {
      console.error('Falha ao copiar o erro: ', err);
      setCopyButtonText('Falhou!');
      setTimeout(() => setCopyButtonText('Copiar Erro'), 2000);
    });
  };

  // Sobrescreve o onClose para resetar o botão de copiar
  const handleClose = () => {
    setCopyButtonText('Copiar Erro');
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="error-modal-container">
        <p>
          Ocorreu um erro inesperado. Por favor, copie os detalhes abaixo e envie para a equipe de desenvolvimento.
        </p>
        <pre className="error-message-box">
          {errorMessage}
        </pre>
        <div className="error-modal-actions">
          <Button onClick={handleCopy} variant="primary">
            {copyButtonText}
          </Button>
          <Button onClick={handleClose} variant="secondary">
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ErrorModal;
