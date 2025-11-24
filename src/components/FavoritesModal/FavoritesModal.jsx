import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import PropertyCard from '../PropertyCard/PropertyCard';
import { fetchFavoriteProperties, unfavoriteProperty } from '../../services/propertyService';
import PropertyDetailsModal from '../PropertyDetailsModal/PropertyDetailsModal';
import './FavoritesModal.css';

function FavoritesModal({ isOpen, onClose, user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await fetchFavoriteProperties();
      setFavorites(data.favorites);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const handleUnfavorite = async (propertyId) => {
    try {
      await unfavoriteProperty(propertyId);
      // Refresh the list after unfavoriting
      loadFavorites();
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
    // Also refresh favorites in case the user unfavorited from the details modal
    loadFavorites();
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
