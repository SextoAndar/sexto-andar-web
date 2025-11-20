import { useEffect, useState } from 'react';
import { fetchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './PropertiesList.css';

export default function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties()
      .then(data => setProperties(data.properties))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="properties-list-loading">Carregando imóveis...</div>;
  if (error) return <div className="properties-list-error">Erro: {error}</div>;

  return (
    <div className="properties-list-container">
      <div className="properties-list">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
