import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import PropertyCard from '../PropertyCard/PropertyCard';
import { fetchOwnerProperties, activateProperty } from '../../services/propertyService';
import './TrashModal.css';

function TrashModal({ isOpen, onClose }) {
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDeletedProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchOwnerProperties({ active_only: false });
      const inactive = data.properties.filter(p => !p.is_active);
      setDeletedProperties(inactive);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDeletedProperties();
    }
  }, [isOpen]);

  const handleReactivate = async (propertyId) => {
    try {
      await activateProperty(propertyId);
      // Refresh the list after reactivating
      loadDeletedProperties();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lixeira de Imóveis">
      <div className="trash-list">
        {loading ? (
          <p>Carregando...</p>
        ) : deletedProperties.length > 0 ? (
          deletedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="reactivate"
              onReactivate={() => handleReactivate(property.id)}
            />
          ))
        ) : (
          <p>Não há imóveis na lixeira.</p>
        )}
      </div>
    </Modal>
  );
}

export default TrashModal;
