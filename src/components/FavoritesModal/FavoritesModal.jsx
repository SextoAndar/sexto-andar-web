import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import PropertyCard from '../PropertyCard/PropertyCard';
import { fetchFavoriteProperties, unfavoriteProperty } from '../../services/propertyService';
import PropertyDetailsModal from '../PropertyDetailsModal/PropertyDetailsModal';
import Pagination from '../common/Pagination/Pagination'; // Import Pagination component
import './FavoritesModal.css';

function FavoritesModal({ isOpen, onClose, user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state

  const loadFavorites = async (page = 1) => {
    setLoading(true);
    try {
      const data = await fetchFavoriteProperties({ page, size: 10 });
      if (data && Array.isArray(data.properties)) { 
        setFavorites(data.properties); 
        setTotalPages(data.total_pages);
      } else {
        setFavorites([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error(error.message);
      setFavorites([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFavorites(currentPage);
    }
  }, [isOpen, currentPage]);

  const handleUnfavorite = async (propertyId) => {
    try {
      await unfavoriteProperty(propertyId);
      loadFavorites(currentPage);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPropertyId(null);
    loadFavorites(currentPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Meus Favoritos">
        <div className="favorites-list">
          {loading ? (
            <p>Carregando...</p>
          ) : favorites.length > 0 ? (
            favorites.map(fav => (
              <PropertyCard
                key={fav.property.id}
                property={fav.property}
                variant="unfavorite"
                onUnfavorite={() => handleUnfavorite(fav.property.id)}
                onDetails={() => handleOpenDetails(fav.property.id)}
              />
            ))
          ) : (
            <p>Você ainda não favoritou nenhuma propriedade.</p>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Modal>
      <PropertyDetailsModal
        propertyId={selectedPropertyId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        user={user}
      />
    </>
  );
}

export default FavoritesModal;
