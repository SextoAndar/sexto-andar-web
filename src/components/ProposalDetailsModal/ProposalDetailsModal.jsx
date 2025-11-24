import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import { getProposalById } from '../../services/proposalService';
import './ProposalDetailsModal.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

function ProposalDetailsModal({ isOpen, onClose, proposalId }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && proposalId) {
      setLoading(true);
      getProposalById(proposalId)
        .then(setProposal)
        .catch(err => console.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, proposalId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Proposta">
      <div className="proposal-details-content">
        {loading && <p>Carregando...</p>}
        {proposal && (
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`detail-value status-badge status-${proposal.status}`}>{proposal.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Valor da Proposta</span>
              <span className="detail-value proposal-value">{formatCurrency(proposal.proposalValue)}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Imóvel</span>
              <span className="detail-value">{proposal.property?.title || proposal.idProperty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Data da Proposta</span>
              <span className="detail-value">{formatDate(proposal.proposalDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expira em</span>
              <span className="detail-value">{formatDate(proposal.expires_at)} ({proposal.days_until_expiry} dias)</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Mensagem</span>
              <p className="detail-message">{proposal.message || 'Nenhuma mensagem enviada.'}</p>
            </div>
            {proposal.response_message && (
              <div className="detail-item full-width">
                <span className="detail-label">Resposta</span>
                <p className="detail-message response">{proposal.response_message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ProposalDetailsModal;
