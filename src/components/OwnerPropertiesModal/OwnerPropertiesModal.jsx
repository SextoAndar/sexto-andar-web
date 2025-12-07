import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import PropertyCard from '../PropertyCard/PropertyCard';
import PropertyEditModal from '../PropertyEditModal/PropertyEditModal';
import TrashModal from '../TrashModal/TrashModal';
import ProposalsModal from '../ProposalsModal/ProposalsModal';
import ReceivedVisitsModal from '../ReceivedVisitsModal/ReceivedVisitsModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import { fetchOwnerProperties, deleteProperty } from '../../services/propertyService';
import logger from '../../utils/logger'; // Import logger utility
import { MdDelete } from 'react-icons/md';
import './OwnerPropertiesModal.css';

function OwnerPropertiesModal({ isOpen, onClose, properties: initialProperties, user }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [isProposalsModalOpen, setIsProposalsModalOpen] = useState(false);
  const [isReceivedVisitsModalOpen, setIsReceivedVisitsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyForProposals, setSelectedPropertyForProposals] = useState(null);
  const [selectedPropertyForVisits, setSelectedPropertyForVisits] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state
  const [isLoading, setIsLoading] = useState(false); // Add this

  const loadActiveProperties = useCallback(async (page = 1) => {
    setIsLoading(true); // Add loading state
    try {
      const data = await fetchOwnerProperties({ page, size: 10, active_only: true });
      if (data && Array.isArray(data.properties)) {
        setProperties(data.properties);
        setTotalPages(data.total_pages);
      } else {
        setProperties([]);
        setTotalPages(0);
      }
    } catch (error) {
      logger.error(error.message);
      setProperties([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false); // Ensure setLoading(false) is called in finally block
    }
  }, []); // Empty array because setStates are stable and fetchOwnerProperties is stable.

  useEffect(() => {
    if (isOpen) {
      loadActiveProperties(currentPage);
    }
  }, [isOpen, currentPage, loadActiveProperties]);

  const handleEditProperty = (propertyId) => {
    const propertyToEdit = properties.find(p => p.id === propertyId);
    setSelectedProperty(propertyToEdit);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Tem certeza que deseja desativar este imóvel?')) {
      try {
        await deleteProperty(propertyId);
        loadActiveProperties(currentPage); // Refresh current page
      } catch (error) {
        logger.error(error.message);
        alert(`Erro ao desativar imóvel: ${error.message}`);
      }
    }
  };

  const handleViewProposals = (propertyId) => {
    setSelectedPropertyForProposals(propertyId);
    setIsProposalsModalOpen(true);
  };

  const handleViewVisits = (propertyId) => {
    setSelectedPropertyForVisits(propertyId);
    setIsReceivedVisitsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCloseAndRefresh = async () => {
    loadActiveProperties(currentPage);
    handleCloseEditModal();
  };
  
  const handleTrashModalClose = () => {
    setIsTrashModalOpen(false);
    loadActiveProperties(currentPage);
  }

  const handleImageUpdate = async () => {
    logger.log('handleImageUpdate: Refreshing properties...');
    const updatedPropertiesData = await fetchOwnerProperties({ page: currentPage, size: 10 }); // Fetch with pagination
    logger.log('handleImageUpdate: Received properties data:', updatedPropertiesData);
    
    const updatedProperties = updatedPropertiesData.properties;
    
    setProperties(updatedProperties);
    const refreshedProperty = updatedProperties.find(p => p.id === selectedProperty.id);
    if (refreshedProperty) {
      logger.log('handleImageUpdate: Found updated property, updating state.', refreshedProperty);
      setSelectedProperty(refreshedProperty);
    } else {
      logger.log('handleImageUpdate: Could not find updated property, closing modal.');
      handleCloseEditModal();
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Minhas Propriedades"
        headerChildren={
          <button className="trash-button" onClick={() => setIsTrashModalOpen(true)} title="Lixeira">
            <MdDelete />
          </button>
        }
      >
        <div className="owner-properties-list">
          {isLoading ? ( // Add this conditional check
            <p>Carregando propriedades...</p> // Loading message
          ) : properties && properties.length > 0 ? (
            properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                variant="edit"
                onEdit={() => handleEditProperty(property.id)}
                onDelete={() => handleDeleteProperty(property.id)}
                onViewProposals={() => handleViewProposals(property.id)}
                onViewVisits={() => handleViewVisits(property.id)}
              />
            ))
          ) : (
            <p>Você ainda não cadastrou nenhuma propriedade ativa.</p>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Modal>
      
      {isEditModalOpen && selectedProperty && (
        <PropertyEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          property={selectedProperty}
          onSave={handleCloseAndRefresh}
          onImageUpdate={handleImageUpdate}
        />
      )}

      <TrashModal 
        isOpen={isTrashModalOpen}
        onClose={handleTrashModalClose}
      />

      <ProposalsModal
        isOpen={isProposalsModalOpen}
        onClose={() => setIsProposalsModalOpen(false)}
        propertyId={selectedPropertyForProposals}
        user={user}
      />

      <ReceivedVisitsModal
        isOpen={isReceivedVisitsModalOpen}
        onClose={() => setIsReceivedVisitsModalOpen(false)}
        propertyId={selectedPropertyForVisits}
      />
    </>
  );
}

export default OwnerPropertiesModal;