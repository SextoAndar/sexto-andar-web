import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getReceivedProposals, getProposalsForProperty, acceptProposal, rejectProposal } from '../../services/proposalService';
import ProposalDetailsModal from '../ProposalDetailsModal/ProposalDetailsModal';
import './ProposalsModal.css';

function ProposalsModal({ isOpen, onClose, user, propertyId }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isProposalDetailsOpen, setIsProposalDetailsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const fetchProposals = propertyId 
        ? getProposalsForProperty(propertyId)
        : getReceivedProposals();

      fetchProposals
        .then(data => setProposals(data.proposals))
        .catch(err => console.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, propertyId]);

  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      const data = propertyId 
        ? await getProposalsForProperty(propertyId)
        : await getReceivedProposals();
      setProposals(data.proposals);
    } catch (error) {
      alert(`Erro ao aceitar proposta: ${error.message}`);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await rejectProposal(proposalId);
      const data = propertyId 
        ? await getProposalsForProperty(propertyId)
        : await getReceivedProposals();
      setProposals(data.proposals);
    } catch (error) {
      alert(`Erro ao rejeitar proposta: ${error.message}`);
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

  const modalTitle = propertyId ? "Propostas para este Imóvel" : "Propostas Recebidas";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
        <div className="proposals-list">
          {loading ? (
            <p>Carregando propostas...</p>
          ) : proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onAccept={() => handleAccept(proposal.id)}
                onReject={() => handleReject(proposal.id)}
                onViewDetails={() => handleOpenProposalDetails(proposal.id)}
                isOwnerView={true}
              />
            ))
          ) : (
            <p>Nenhuma proposta encontrada.</p>
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

export default ProposalsModal;
