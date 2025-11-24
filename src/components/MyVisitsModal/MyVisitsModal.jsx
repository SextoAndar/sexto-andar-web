import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import VisitCard from '../VisitCard/VisitCard';
import { getVisitsForUser, getUpcomingVisits, cancelVisit } from '../../services/visitService';
import EditVisitModal from '../EditVisitModal/EditVisitModal';
import './MyVisitsModal.css';

function MyVisitsModal({ isOpen, onClose }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'upcoming'
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'upcoming' ? await getUpcomingVisits() : await getVisitsForUser();
      setVisits(data.visits);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVisits();
    }
  }, [isOpen, activeTab]);

  const handleCancel = async (visitId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta visita?')) {
      try {
        await cancelVisit(visitId);
        alert('Visita cancelada com sucesso!');
        loadVisits(); // Refresh the list
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
    loadVisits(); // Reload visits after update
    setIsEditVisitModalOpen(false);
    setSelectedVisit(null);
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
