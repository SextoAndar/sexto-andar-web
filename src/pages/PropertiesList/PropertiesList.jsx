import { useEffect, useState } from 'react';
import { fetchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyDetailsModal from '../../components/PropertyDetailsModal/PropertyDetailsModal';
import Pagination from '../../components/common/Pagination/Pagination';
import './PropertiesList.css';

export default function PropertiesList({ user, searchTerm }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, size: 10 };
    if (searchTerm) {
      params.search_term = searchTerm;
    }
    
    console.log('Fetching properties with params:', params);
    fetchProperties(params)
      .then(data => {
        console.log('Fetched data:', data);
        if (data && Array.isArray(data.items)) { // Ensure data.items is an array
          setProperties(data.items);
          setTotalPages(data.total_pages);
        } else {
          console.warn('Fetched data.items is not an array or data is null/undefined:', data);
          setProperties([]); // Ensure properties is always an array
          setTotalPages(0);
        }
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
        setError(err.message);
        setProperties([]); // Ensure properties is always an array on error
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, currentPage]);

  const handleOpenDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPropertyId(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      {isDetailsOpen && (
        <PropertyDetailsModal 
          propertyId={selectedPropertyId} 
          isOpen={isDetailsOpen} 
          onClose={handleCloseDetails} 
          user={user}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
