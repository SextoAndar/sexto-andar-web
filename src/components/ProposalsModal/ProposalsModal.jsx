import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getReceivedProposals, getProposalsForProperty, acceptProposal, rejectProposal } from '../../services/proposalService';
import ProposalDetailsModal from '../ProposalDetailsModal/ProposalDetailsModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import logger from '../../utils/logger'; // Import logger utility
import './ProposalsModal.css';

function ProposalsModal({ isOpen, onClose, _user, propertyId }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isProposalDetailsOpen, setIsProposalDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state

  const fetchProposalsData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchProposalsPromise = propertyId 
        ? getProposalsForProperty(propertyId, { page: currentPage, size: 10 })
        : getReceivedProposals({ page: currentPage, size: 10 });

      const data = await fetchProposalsPromise;

      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        setTotalPages(data.total_pages);
      } else {
        setProposals([]);
        setTotalPages(0);
      }
    } catch (_err) { // Changed to _err
      logger.error(_err.message);
      setProposals([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [propertyId, currentPage]); // Depends on propertyId and currentPage

  useEffect(() => {
    if (isOpen) {
      fetchProposalsData();
    }
  }, [isOpen, propertyId, currentPage, fetchProposalsData]);

  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      const data = propertyId 
        ? await getProposalsForProperty(propertyId, { page: currentPage, size: 10 })
        : await getReceivedProposals({ page: currentPage, size: 10 });
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        setTotalPages(data.total_pages);
      } else {
        setProposals([]);
        setTotalPages(0);
      }
    } catch (error) {
      alert(`Erro ao aceitar proposta: ${error.message}`);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await rejectProposal(proposalId);
      const data = propertyId 
        ? await getProposalsForProperty(propertyId, { page: currentPage, size: 10 })
        : await getReceivedProposals({ page: currentPage, size: 10 });
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        setTotalPages(data.total_pages);
      } else {
        setProposals([]);
        setTotalPages(0);
      }
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
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
