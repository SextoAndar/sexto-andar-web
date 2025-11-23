import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import PropertyCard from '../PropertyCard/PropertyCard';
import PropertyEditModal from '../PropertyEditModal/PropertyEditModal';
import { fetchOwnerProperties } from '../../services/propertyService';
import './OwnerPropertiesModal.css';

function OwnerPropertiesModal({ isOpen, onClose, properties: initialProperties }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleEditProperty = (propertyId) => {
    const propertyToEdit = properties.find(p => p.id === propertyId);
    setSelectedProperty(propertyToEdit);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseAndRefresh = async () => {
    const updatedProperties = await fetchOwnerProperties();
    setProperties(updatedProperties);
    handleCloseEditModal();
  };

  const handleImageUpdate = async () => {
    console.log('handleImageUpdate: Refreshing properties...');
    const updatedPropertiesData = await fetchOwnerProperties();
    console.log('handleImageUpdate: Received properties data:', updatedPropertiesData);
    
    // The actual array is in the 'properties' key
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

  // Update properties if initialProperties change
  React.useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Minhas Propriedades">
        <div className="owner-properties-list">
          {properties && properties.length > 0 ? (
            properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                variant="edit"
                onEdit={handleEditProperty}
              />
            ))
          ) : (
            <p>Você ainda não cadastrou nenhuma propriedade.</p>
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
    </>
  );
}

export default OwnerPropertiesModal;
