// src/components/MyProposalsModal/MyProposalsModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import ProposalCard from '../ProposalCard/ProposalCard';
import { getMyProposals, withdrawProposal, deleteProposal } from '../../services/proposalService';
import ProposalDetailsModal from '../ProposalDetailsModal/ProposalDetailsModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import './MyProposalsModal.css';

function MyProposalsModal({ isOpen, onClose, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isProposalDetailsOpen, setIsProposalDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state

  const loadProposals = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getMyProposals({ page, size: 10 });
      if (data && Array.isArray(data.proposals)) {
        setProposals(data.proposals);
        setTotalPages(data.total_pages);
      } else {
        setProposals([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error(error.message);
      setProposals([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProposals(currentPage);
    }
  }, [isOpen, currentPage]);

  const handleWithdraw = async (proposalId) => {
    if (window.confirm('Tem certeza que deseja retirar esta proposta?')) {
      try {
        await withdrawProposal(proposalId);
        alert('Proposta retirada com sucesso!');
        loadProposals(currentPage); // Refresh the list
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
        loadProposals(currentPage); // Refresh the list
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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