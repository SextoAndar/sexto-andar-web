import React, { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import { fetchPropertyById } from '../../services/propertyService';
import './ProposalCard.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

function ProposalCard({ proposal, onAccept, onReject, onWithdraw, onViewDetails, isOwnerView }) {
  const [property, setProperty] = useState(null);
  const { proposalValue, message, status, proposalDate, response_message } = proposal;

  useEffect(() => {
    const getProperty = async () => {
      try {
        const propData = await fetchPropertyById(proposal.idProperty);
        setProperty(propData);
      } catch (err) {
        console.error("Failed to fetch property for proposal:", err);
      }
    };
    if (proposal.idProperty) {
      getProperty();
    }
  }, [proposal.idProperty]);

  const primaryImage = property?.images?.find(img => img.is_primary) || property?.images?.[0];
  const imgUrl = primaryImage ? `/api/api/images/${primaryImage.id}` : '/default-property.jpg';

  return (
    <div className={`proposal-card status-${status}`}>
      <div className="proposal-card-header">
        <div className="proposal-property-info">
          <img src={imgUrl} alt="Property" className="proposal-property-image" />
          <span className="proposal-property-title">
            {property?.description || 'Carregando imóvel...'}
          </span>
        </div>
        <span className={`proposal-status-badge status-${status}`}>
          {status}
        </span>
      </div>
      <div className="proposal-card-body">
        <div className="proposal-details">
          <p><strong>Valor:</strong> <span className="proposal-value">{formatCurrency(proposalValue)}</span></p>
          <p><strong>Data:</strong> {formatDate(proposalDate)}</p>
        </div>
        {message && (
          <div className="proposal-message">
            <p><strong>{isOwnerView ? 'Mensagem do Interessado:' : 'Sua Mensagem:'}</strong> {message}</p>
          </div>
        )}
        {response_message && (
          <div className="proposal-response">
            <p><strong>Resposta:</strong> {response_message}</p>
          </div>
        )}
      </div>
      <div className="proposal-card-actions">
        {onViewDetails && (
          <Button onClick={() => onViewDetails(proposal.idProperty)} variant="secondary">Ver Imóvel</Button>
        )}
        {status === 'pending' && onAccept && (
          <Button onClick={() => onAccept(proposal.id)} variant="primary">Aceitar</Button>
        )}
        {status === 'pending' && onReject && (
          <Button onClick={() => onReject(proposal.id)} variant="danger">Rejeitar</Button>
        )}
        {status === 'pending' && onWithdraw && (
          <Button onClick={() => onWithdraw(proposal.id)} variant="danger">Retirar Proposta</Button>
        )}
      </div>
    </div>
  );
}

export default ProposalCard;
