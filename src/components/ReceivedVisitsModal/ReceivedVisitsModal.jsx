import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import VisitCard from '../VisitCard/VisitCard';
import { getAllOwnerVisits, getVisitsForSpecificProperty, cancelVisit } from '../../services/visitService';
import './ReceivedVisitsModal.css';

function ReceivedVisitsModal({ isOpen, onClose, propertyId }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const data = propertyId
        ? await getVisitsForSpecificProperty(propertyId)
        : await getAllOwnerVisits();
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
  }, [isOpen, propertyId]);

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
              isOwnerView={true}
            />
          ))
        ) : (
          <p>Nenhuma visita encontrada.</p>
        )}
      </div>
    </Modal>
  );
}

export default ReceivedVisitsModal;
