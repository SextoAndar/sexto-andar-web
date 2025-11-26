import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import VisitCard from '../VisitCard/VisitCard';
import { getAllOwnerVisits, getVisitsForSpecificProperty, cancelVisit, completeVisit } from '../../services/visitService';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import logger from '../../utils/logger'; // Import logger utility
import './ReceivedVisitsModal.css';

function ReceivedVisitsModal({ isOpen, onClose, propertyId }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state

  const loadVisits = async (page = 1) => {
    setLoading(true);
    try {
      const data = propertyId
        ? await getVisitsForSpecificProperty(propertyId, { page, size: 10 })
        : await getAllOwnerVisits({ page, size: 10 });
      
      if (data && Array.isArray(data.visits)) {
        setVisits(data.visits);
        setTotalPages(data.total_pages);
      } else {
        setVisits([]);
        setTotalPages(0);
      }
    } catch (error) {
      logger.error(error.message);
      setVisits([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVisits(currentPage);
    }
  }, [isOpen, propertyId, currentPage]); // Added currentPage to dependencies

  const handleCancel = async (visitId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta visita?')) {
      try {
        await cancelVisit(visitId);
        alert('Visita cancelada com sucesso!');
        loadVisits(currentPage); // Refresh the list
      } catch (error) {
        alert(`Erro ao cancelar visita: ${error.message}`);
      }
    }
  };

  const handleComplete = async (visitId) => {
    if (window.confirm('Tem certeza que deseja marcar esta visita como concluída?')) {
      try {
        await completeVisit(visitId);
        alert('Visita marcada como concluída com sucesso!');
        loadVisits(currentPage); // Refresh the list
      } catch (error) {
        alert(`Erro ao marcar visita como concluída: ${error.message}`);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const modalTitle = propertyId ? "Visitas para este Imóvel" : "Visitas Recebidas";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="received-visits-list">
        {loading ? (
          <p>Carregando visitas...</p>
        ) : visits.length > 0 ? (
          visits.map(visit => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onCancel={handleCancel}
              onComplete={handleComplete}
              isOwnerView={true}
            />
          ))
        ) : (
          <p>Nenhuma visita encontrada.</p>
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
  );
}

export default ReceivedVisitsModal;
