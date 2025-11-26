import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import VisitCard from '../VisitCard/VisitCard';
import { getVisitsForUser, getUpcomingVisits, cancelVisit } from '../../services/visitService';
import EditVisitModal from '../EditVisitModal/EditVisitModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import logger from '../../utils/logger'; // Import logger utility
import './MyVisitsModal.css';

function MyVisitsModal({ isOpen, onClose }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'upcoming'
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state

  const loadVisits = async (page = 1) => {
    setLoading(true);
    try {
      const data = activeTab === 'upcoming' 
        ? await getUpcomingVisits({ page, size: 10 }) 
        : await getVisitsForUser({ page, size: 10 });
      
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
      // Reset currentPage to 1 when activeTab changes, but only if it's not already 1
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadVisits(currentPage);
      }
    }
  }, [isOpen, activeTab, currentPage]); // Added currentPage to dependencies

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

  const handleEdit = (visit) => {
    setSelectedVisit(visit);
    setIsEditVisitModalOpen(true);
  };

  const handleVisitUpdated = () => {
    loadVisits(currentPage); // Reload visits after update
    setIsEditVisitModalOpen(false);
    setSelectedVisit(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Minhas Visitas Agendadas">
        <div className="visits-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todas as Visitas
          </button>
          <button
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Próximas Visitas
          </button>
        </div>
        <div className="my-visits-list">
          {loading ? (
            <p>Carregando visitas...</p>
          ) : visits.length > 0 ? (
            visits.map(visit => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onCancel={handleCancel}
                onEdit={handleEdit}
                isOwnerView={false}
              />
            ))
          ) : (
            <p>Você não tem nenhuma visita agendada.</p>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Modal>
      {selectedVisit && (
        <EditVisitModal
          isOpen={isEditVisitModalOpen}
          onClose={() => setIsEditVisitModalOpen(false)}
          visit={selectedVisit}
          onVisitUpdated={handleVisitUpdated}
        />
      )}
    </>
  );
}

export default MyVisitsModal;
