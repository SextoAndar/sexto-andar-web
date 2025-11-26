import { useEffect, useState } from 'react';
import { fetchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyDetailsModal from '../../components/PropertyDetailsModal/PropertyDetailsModal';
import './PropertiesList.css';

export default function PropertiesList({ user, searchTerm }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchTerm) {
      params.search_term = searchTerm;
    }
    
    fetchProperties(params)
      .then(data => setProperties(data.properties))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

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
  if (!loading && !error && properties.length === 0) {
    return (
      <div className="properties-list-empty">
        Nenhum imóvel encontrado para sua busca. Tente outros termos.
      </div>
    );
  }

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
