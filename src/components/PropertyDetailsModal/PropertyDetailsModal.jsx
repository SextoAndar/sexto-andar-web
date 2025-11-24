import React, { useEffect, useState } from "react";
import { fetchPropertyById, favoriteProperty, unfavoriteProperty, getFavoriteStatus } from '../../services/propertyService';
import Button from '../common/Button/Button';
import ProposalFormModal from '../ProposalFormModal/ProposalFormModal';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ propertyId, isOpen, onClose, user }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !propertyId) return;
    
    const getDetails = async () => {
      setLoading(true);
      setError(null);
      setProperty(null);
      try {
        const propertyData = await fetchPropertyById(propertyId);
        setProperty(propertyData);

        if (user && user.role === 'USER') {
          const favoriteStatus = await getFavoriteStatus(propertyId);
          setIsFavorited(favoriteStatus.is_favorited);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getDetails();
  }, [propertyId, isOpen, user]);

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await unfavoriteProperty(propertyId);
        setIsFavorited(false);
      } else {
        await favoriteProperty(propertyId);
        setIsFavorited(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProposalSubmitted = () => {
    // Could add a confirmation message here
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="property-details-modal-overlay" onClick={onClose}>
        <div className="property-details-modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>&times;</button>
          {loading && <div>Carregando...</div>}
          {error && <div>Erro: {error}</div>}
          {property && (
            <>
              <div className="property-details-header">
                <h2>Detalhes do Imóvel</h2>
                {user && user.role === 'USER' && (
                  <button 
                    className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleFavorite}
                  >
                    {isFavorited ? '❤️' : '🤍'}
                  </button>
                )}
              </div>
              {property.images && property.images.length > 0 && (
                <div className="property-images">
                  {property.images.map((image) => (
                    <img
                      key={image.id}
                      src={`/api/api/images/${image.id}`}
                      alt="Foto do imóvel"
                      style={{ maxWidth: 220, margin: 6, borderRadius: 8 }}
                    />
                  ))}
                </div>
              )}
              <div className="property-info">
                <p><strong>Endereço:</strong> {property.address.street}, {property.address.number} - {property.address.city}</p>
                <p><strong>Tamanho:</strong> {property.propertySize} m²</p>
                <p><strong>Descrição:</strong> {property.description}</p>
                <p><strong>Valor:</strong> R$ {property.propertyValue}</p>
                <p><strong>Tipo:</strong> {property.propertyType}</p>
                <p><strong>Venda/Aluguel:</strong> {property.salesType}</p>
              </div>
              {user && user.role === 'USER' && (
                <div className="property-details-actions">
                  <Button onClick={() => setIsProposalModalOpen(true)} variant="primary">
                    Fazer Proposta
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {propertyId && (
        <ProposalFormModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          propertyId={propertyId}
          onProposalSubmitted={handleProposalSubmitted}
        />
      )}
    </>
  );
};

export default PropertyDetailsModal;
