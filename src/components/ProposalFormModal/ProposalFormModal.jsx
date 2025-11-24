import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import { submitProposal } from '../../services/proposalService';
import './ProposalFormModal.css';

function ProposalFormModal({ isOpen, onClose, propertyId, onProposalSubmitted }) {
  const [proposalValue, setProposalValue] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitProposal({
        idProperty: propertyId,
        proposalValue: parseFloat(proposalValue),
        message,
      });
      alert('Proposta enviada com sucesso!');
      onProposalSubmitted();
      onClose();
    } catch (error) {
      alert(`Erro ao enviar proposta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fazer Proposta">
      <form onSubmit={handleSubmit} className="proposal-form">
        <Input
          type="number"
          label="Valor da Proposta (R$)"
          name="proposalValue"
          value={proposalValue}
          onChange={(e) => setProposalValue(e.target.value)}
          placeholder="Ex: 250000"
          required
        />
        <div className="form-group">
          <label htmlFor="message">Mensagem (opcional)</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            placeholder="Escreva uma mensagem para o proprietário..."
          />
        </div>
        <div className="form-actions">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Proposta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProposalFormModal;
