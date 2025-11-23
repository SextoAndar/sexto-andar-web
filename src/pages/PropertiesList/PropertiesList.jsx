import { useEffect, useState } from 'react';
import { fetchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyDetailsModal from '../../components/PropertyDetailsModal/PropertyDetailsModal';
import './PropertiesList.css';

export default function PropertiesList({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchProperties()
      .then(data => setProperties(data.properties))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPropertyId(null);
  };

  if (loading) return <div className="properties-list-loading">Carregando imóveis...</div>;
  if (error) return <div className="properties-list-error">Erro: {error}</div>;

  return (
    <div className="properties-list-container">
      <div className="properties-list">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} onDetails={handleOpenDetails} />
        ))}
      </div>
      <PropertyDetailsModal 
        propertyId={selectedPropertyId} 
        isOpen={isDetailsOpen} 
        onClose={handleCloseDetails} 
        user={user}
      />
    </div>
  );
}
