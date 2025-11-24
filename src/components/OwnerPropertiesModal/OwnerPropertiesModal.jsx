import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import PropertyCard from '../PropertyCard/PropertyCard';
import PropertyEditModal from '../PropertyEditModal/PropertyEditModal';
import TrashModal from '../TrashModal/TrashModal';
import ProposalsModal from '../ProposalsModal/ProposalsModal';
import ReceivedVisitsModal from '../ReceivedVisitsModal/ReceivedVisitsModal';
import { fetchOwnerProperties, deleteProperty } from '../../services/propertyService';
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

  const loadActiveProperties = async () => {
    try {
      const data = await fetchOwnerProperties({ active_only: true });
      setProperties(data.properties);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadActiveProperties();
    }
  }, [isOpen]);

  const handleEditProperty = (propertyId) => {
    const propertyToEdit = properties.find(p => p.id === propertyId);
    setSelectedProperty(propertyToEdit);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Tem certeza que deseja desativar este imóvel?')) {
      try {
        await deleteProperty(propertyId);
        loadActiveProperties();
      } catch (error) {
        console.error(error.message);
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

  const handleCloseAndRefresh = async () => {
    loadActiveProperties();
    handleCloseEditModal();
  };
  
  const handleTrashModalClose = () => {
    setIsTrashModalOpen(false);
    loadActiveProperties();
  }

  const handleImageUpdate = async () => {
    console.log('handleImageUpdate: Refreshing properties...');
    const updatedPropertiesData = await fetchOwnerProperties();
    console.log('handleImageUpdate: Received properties data:', updatedPropertiesData);
    
    const updatedProperties = updatedPropertiesData.properties;
    
    setProperties(updatedProperties);
    const refreshedProperty = updatedProperties.find(p => p.id === selectedProperty.id);
    if (refreshedProperty) {
      console.log('handleImageUpdate: Found updated property, updating state.', refreshedProperty);
      setSelectedProperty(refreshedProperty);
    } else {
      console.log('handleImageUpdate: Could not find updated property, closing modal.');
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
            🗑️
          </button>
        }
      >
        <div className="owner-properties-list">
          {properties && properties.length > 0 ? (
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
      </Modal>
      
      {selectedProperty && (
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
