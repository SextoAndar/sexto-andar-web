import React, { useEffect, useState } from "react";
import { fetchPropertyById, favoriteProperty, unfavoriteProperty, getFavoriteStatus } from '../../services/propertyService';
import { scheduleVisit, getPublicPropertyVisits } from '../../services/visitService';
import Button from '../common/Button/Button';
import ProposalFormModal from '../ProposalFormModal/ProposalFormModal';
import ScheduleVisitModal from '../ScheduleVisitModal/ScheduleVisitModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import logger from '../../utils/logger'; // Import logger utility
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import './PropertyDetailsModal.css';

const PropertyDetailsModal = ({ propertyId, isOpen, onClose, user }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] = useState(false);
  const [publicVisitDates, setPublicVisitDates] = useState([]);
  const [publicVisitCurrentPage, setPublicVisitCurrentPage] = useState(1); // Add state for public visit pagination
  const [publicVisitTotalPages, setPublicVisitTotalPages] = useState(0); // Add state for public visit total pages

  const mapPropertyType = (type) => {
    switch (type) {
      case 'APARTMENT':
        return 'Apartamento';
      case 'HOUSE':
        return 'Casa';
      default:
        return type;
    }
  };

  const mapSalesType = (type) => {
    switch (type) {
      case 'RENT':
        return 'Aluguel';
      case 'SALE':
        return 'Venda';
      default:
        return type;
    }
  };

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
        
        const publicVisitsData = await getPublicPropertyVisits(propertyId, { page: publicVisitCurrentPage, size: 5 }); // Fetch with pagination
        if (publicVisitsData && Array.isArray(publicVisitsData.visits)) {
          setPublicVisitDates(publicVisitsData.visits);
          setPublicVisitTotalPages(publicVisitsData.total_pages);
        } else {
          setPublicVisitDates([]);
          setPublicVisitTotalPages(0);
        }
      } catch (err) {
        logger.error(err.message);
        setPublicVisitDates([]);
        setPublicVisitTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    
    getDetails();
  }, [propertyId, isOpen, user, publicVisitCurrentPage]); // Added publicVisitCurrentPage to dependencies

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
      logger.error(err.message);
    }
  };

  const handleProposalSubmitted = () => {
    // Could add a confirmation message here
  };

  const handleVisitScheduled = async (visitData) => {
    try {
      await scheduleVisit({ ...visitData, idProperty: propertyId });
      alert('Visita agendada com sucesso!');
      setIsScheduleVisitModalOpen(false);
      // Refresh public visit dates after scheduling
      const publicVisits = await getPublicPropertyVisits(propertyId, { page: publicVisitCurrentPage, size: 5 }); // Fetch with pagination
      setPublicVisitDates(publicVisits.visits);
      setPublicVisitTotalPages(publicVisits.total_pages);
    } catch (err) {
      alert(`Erro ao agendar visita: ${err.message}`);
    }
  };

  const handlePublicVisitPageChange = (page) => {
    setPublicVisitCurrentPage(page);
  };

  const formatVisitDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
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
                    {isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
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
                <p><strong>Tipo:</strong> {mapPropertyType(property.propertyType)}</p>
                <p><strong>Venda/Aluguel:</strong> {mapSalesType(property.salesType)}</p>
              </div>
              
              <div className="public-visits-section">
                <h4>Visitas Agendadas</h4>
                {publicVisitDates.length > 0 ? (
                  <ul>
                    {publicVisitDates.map(visit => (
                      <li key={visit.id}>
                        {formatVisitDate(visit.visitDate)} - Status: {visit.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma visita pública agendada.</p>
                )}
                {publicVisitTotalPages > 1 && (
                  <Pagination
                    currentPage={publicVisitCurrentPage}
                    totalPages={publicVisitTotalPages}
                    onPageChange={handlePublicVisitPageChange}
                  />
                )}
              </div>

              {user && user.role === 'USER' && (
                <div className="property-details-actions">
                  <Button onClick={() => setIsProposalModalOpen(true)} variant="primary">
                    Fazer Proposta
                  </Button>
                  <Button onClick={() => setIsScheduleVisitModalOpen(true)} variant="secondary">
                    Agendar Visita
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
      {propertyId && (
        <ScheduleVisitModal
          isOpen={isScheduleVisitModalOpen}
          onClose={() => setIsScheduleVisitModalOpen(false)}
          onSchedule={handleVisitScheduled}
        />
      )}
    </>
  );
};

export default PropertyDetailsModal;
