import React, { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import { fetchPropertyById } from '../../services/propertyService';
import './VisitCard.css';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

function VisitCard({ visit, onCancel, isOwnerView }) {
  const [property, setProperty] = useState(null);
  const { idProperty, visitDate, status, notes, user } = visit;

  useEffect(() => {
    const getProperty = async () => {
      try {
        const propData = await fetchPropertyById(idProperty);
        setProperty(propData);
      } catch (err) {
        console.error("Failed to fetch property for visit:", err);
      }
    };
    if (idProperty) {
      getProperty();
    }
  }, [idProperty]);

  const primaryImage = property?.images?.find(img => img.is_primary) || property?.images?.[0];
  const imgUrl = primaryImage ? `/api/api/images/${primaryImage.id}` : '/default-property.jpg';

  return (
    <div className={`visit-card status-${status}`}>
      <div className="visit-card-header">
        <div className="visit-property-info">
          <img src={imgUrl} alt="Property" className="visit-property-image" />
          <span className="visit-property-title">
            {property?.description || 'Carregando imóvel...'}
          </span>
        </div>
        <span className={`visit-status-badge status-${status}`}>
          {status}
        </span>
      </div>
      <div className="visit-card-body">
        <p><strong>Data da Visita:</strong> {formatDate(visitDate)}</p>
        {isOwnerView && user && (
          <p><strong>Agendado por:</strong> {user.fullName} ({user.email})</p>
        )}
        {notes && (
          <div className="visit-notes">
            <p><strong>Observações:</strong></p>
            <p>{notes}</p>
          </div>
        )}
      </div>
      {(status === 'scheduled') && (
        <div className="visit-card-actions">
          {onCancel && (
            <Button onClick={() => onCancel(visit.id)} variant="danger">Cancelar Visita</Button>
          )}
        </div>
      )}
    </div>
  );
}

export default VisitCard;
