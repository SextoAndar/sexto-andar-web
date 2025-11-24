import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getMyProposals, withdrawProposal } from '../../services/proposalService';
import PropertyDetailsModal from '../PropertyDetailsModal/PropertyDetailsModal';
import './MyProposalsModal.css';

function MyProposalsModal({ isOpen, onClose, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
    try {
      await withdrawProposal(proposalId);
      loadProposals(); // Refresh the list
    } catch (error) {
      alert(`Erro ao retirar proposta: ${error.message}`);
    }
  };

  const handleOpenDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPropertyId(null);
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
                onViewDetails={handleOpenDetails}
                isOwnerView={false}
              />
            ))
          ) : (
            <p>Você ainda não enviou nenhuma proposta.</p>
          )}
        </div>
      </Modal>
      <PropertyDetailsModal
        propertyId={selectedPropertyId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        user={user}
      />
    </>
  );
}

export default MyProposalsModal;
