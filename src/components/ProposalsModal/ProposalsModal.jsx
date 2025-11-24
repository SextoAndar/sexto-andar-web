import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getReceivedProposals, acceptProposal, rejectProposal } from '../../services/proposalService';
import PropertyDetailsModal from '../PropertyDetailsModal/PropertyDetailsModal';
import './ProposalsModal.css';

function ProposalsModal({ isOpen, onClose, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await getReceivedProposals();
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

  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      loadProposals(); // Refresh the list
    } catch (error) {
      alert(`Erro ao aceitar proposta: ${error.message}`);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await rejectProposal(proposalId);
      loadProposals(); // Refresh the list
    } catch (error) {
      alert(`Erro ao rejeitar proposta: ${error.message}`);
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
      <Modal isOpen={isOpen} onClose={onClose} title="Propostas Recebidas">
        <div className="proposals-list">
          {loading ? (
            <p>Carregando propostas...</p>
          ) : proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onAccept={handleAccept}
                onReject={handleReject}
                onViewDetails={handleOpenDetails}
                isOwnerView={true}
              />
            ))
          ) : (
            <p>Você não tem nenhuma proposta recebida.</p>
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

export default ProposalsModal;
