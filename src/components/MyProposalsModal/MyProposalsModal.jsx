// src/components/MyProposalsModal/MyProposalsModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getMyProposals, withdrawProposal, deleteProposal } from '../../services/proposalService';
import ProposalDetailsModal from '../ProposalDetailsModal/ProposalDetailsModal';
import './MyProposalsModal.css';

function MyProposalsModal({ isOpen, onClose, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isProposalDetailsOpen, setIsProposalDetailsOpen] = useState(false);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await getMyProposals();
      setProposals(data.proposals);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProposals();
    }
  }, [isOpen]);

  const handleWithdraw = async (proposalId) => {
    if (window.confirm('Tem certeza que deseja retirar esta proposta?')) {
      try {
        await withdrawProposal(proposalId);
        alert('Proposta retirada com sucesso!');
        loadProposals(); // Refresh the list
      } catch (error) {
        alert(`Erro ao retirar proposta: ${error.message}`);
      }
    }
  };

  const handleDelete = async (proposalId) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita.')) {
      try {
        await deleteProposal(proposalId);
        alert('Proposta excluída com sucesso!');
        loadProposals(); // Refresh the list
      } catch (error) {
        alert(`Erro ao excluir proposta: ${error.message}`);
      }
    }
  };

  const handleOpenProposalDetails = (proposalId) => {
    setSelectedProposalId(proposalId);
    setIsProposalDetailsOpen(true);
  };

  const handleCloseProposalDetails = () => { 
    setIsProposalDetailsOpen(false);
    setSelectedProposalId(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Minhas Propostas">
        <div className="my-proposals-list">
          {loading ? (
            <p>Carregando propostas...</p>
          ) : proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onWithdraw={handleWithdraw}
                onDelete={handleDelete}
                onViewDetails={() => handleOpenProposalDetails(proposal.id)}
                isOwnerView={false}
              />
            ))
          ) : (
            <p>Você ainda não enviou nenhuma proposta.</p>
          )}
        </div>
      </Modal>
      <ProposalDetailsModal
        proposalId={selectedProposalId}
        isOpen={isProposalDetailsOpen}
        onClose={handleCloseProposalDetails}
      />
    </>
  );
}

export default MyProposalsModal;