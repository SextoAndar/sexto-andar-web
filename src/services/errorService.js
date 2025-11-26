// src/services/errorService.js

/**
 * Um serviço simples para desacoplar o disparo de erros da sua exibição na UI.
 * Qualquer parte da aplicação pode disparar um erro, e um listener na UI
 * (e.g., em App.jsx) pode capturá-lo para exibir um modal.
 */
export const errorService = {
  /**
   * Dispara um evento customizado 'showErrorModal'.
   * @param {string} message - A mensagem de erro a ser exibida.
   */
  showError(detail) {
    const event = new CustomEvent('showErrorModal', {
      detail, // detail é o objeto { message, title }
      bubbles: true,
      cancelable: true,
    });
    // Dispara o evento no window para que qualquer componente possa ouvir.
    window.dispatchEvent(event);
  },
};

export default errorService;
