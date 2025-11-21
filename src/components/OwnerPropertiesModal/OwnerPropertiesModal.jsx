import Modal from '../common/Modal/Modal';
import PropertyCard from '../PropertyCard/PropertyCard';
import './OwnerPropertiesModal.css';

function OwnerPropertiesModal({ isOpen, onClose, properties }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Minhas Propriedades">
      <div className="owner-properties-list">
        {properties && properties.length > 0 ? (
          properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p>Você ainda não cadastrou nenhuma propriedade.</p>
        )}
      </div>
    </Modal>
  );
}

export default OwnerPropertiesModal;
