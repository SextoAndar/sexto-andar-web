import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import VisitCard from '../VisitCard/VisitCard';
import { getVisitsForUser, cancelVisit } from '../../services/visitService';
import './MyVisitsModal.css';

function MyVisitsModal({ isOpen, onClose }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const data = await getVisitsForUser();
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
  }, [isOpen]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Minhas Visitas Agendadas">
      <div className="my-visits-list">
        {loading ? (
          <p>Carregando visitas...</p>
        ) : visits.length > 0 ? (
          visits.map(visit => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onCancel={handleCancel}
              isOwnerView={false}
            />
          ))
        ) : (
          <p>Você não tem nenhuma visita agendada.</p>
        )}
      </div>
    </Modal>
  );
}

export default MyVisitsModal;
