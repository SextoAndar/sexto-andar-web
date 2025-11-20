

import './PropertyCard.css';


function PropertyCard({ property, onDetails }) {
  const primaryImage = property.images?.find(img => img.is_primary) || property.images?.[0];
  const imgUrl = primaryImage
    ? `http://localhost:8000/api/images/${primaryImage.id}`
    : '/default-property.jpg';

  const handleDetails = () => {
    if (onDetails) onDetails(property.id);
  };

  return (
    <div className="property-card">
      <div className="property-card-header">
        <span className="tag">Disponível</span>
        <span className="tag">{property.propertyType === 'APARTMENT' ? 'Apartamento' : 'Casa'}</span>
        {property.petFriendly && <span className="tag">Pet friendly</span>}
      </div>
      <img src={imgUrl} alt="Foto do imóvel" className="property-image" />
      <div className="property-card-body">
        <div className="property-rating">
          <span>⭐ {property.rating || '4.8'} ({property.reviews || 24})</span>
        </div>
        <div className="property-price">
          <span className="price">R$ {Number(property.propertyValue).toLocaleString('pt-BR')}</span>
          {property.condoFee && <span className="property-cond">+ R$ {property.condoFee} cond.</span>}
        </div>
        <div className="property-title">{property.description}</div>
        <div className="property-address">
          {property.address?.street}, {property.address?.number} - {property.address?.city}
        </div>
        <div className="property-features">
          <span>🛏 {property.bedrooms}</span>
          <span>🛁 {property.bathrooms}</span>
          <span>📐 {property.propertySize}m²</span>
        </div>
        <button className="property-details-btn" onClick={handleDetails}>Ver Detalhes</button>
      </div>
    </div>
  );
}

export default PropertyCard;
