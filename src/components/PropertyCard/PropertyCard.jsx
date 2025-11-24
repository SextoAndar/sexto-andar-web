

import './PropertyCard.css';


function PropertyCard({ property, onDetails, onEdit, onUnfavorite, onDelete, onReactivate, onViewProposals, onViewVisits, variant }) {
  const primaryImage = property.images?.find(img => img.is_primary) || property.images?.[0];
  const imgUrl = primaryImage
    ? `/api/api/images/${primaryImage.id}`
    : '/default-property.jpg';

  const handleDetails = () => {
    if (onDetails) onDetails(property.id);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(property.id);
  };

  const handleUnfavorite = () => {
    if (onUnfavorite) onUnfavorite(property.id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(property.id);
  };

  const handleReactivate = () => {
    if (onReactivate) onReactivate(property.id);
  };

  const handleViewProposals = () => {
    if (onViewProposals) onViewProposals(property.id);
  };

  const handleViewVisits = () => {
    if (onViewVisits) onViewVisits(property.id);
  };

  return (
    <div className="property-card">
      <div className="property-card-header">
        <span className={`tag ${property.is_active ? '' : 'inactive'}`}>{property.is_active ? 'Disponível' : 'Inativo'}</span>
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
        {variant === 'edit' ? (
          <div className="property-card-actions">
            <button className="property-edit-btn" onClick={handleEdit}>Editar Imóvel</button>
            <button className="property-delete-btn" onClick={handleDelete}>Excluir</button>
            <button className="property-view-proposals-btn" onClick={handleViewProposals}>Ver Propostas</button>
            <button className="property-view-visits-btn" onClick={handleViewVisits}>Ver Visitas</button>
          </div>
        ) : variant === 'unfavorite' ? (
          <div className="property-card-actions">
            <button className="property-unfavorite-btn" onClick={handleUnfavorite}>Desfavoritar</button>
            <button className="property-details-btn" onClick={handleDetails}>Ver Detalhes</button>
          </div>
        ) : variant === 'reactivate' ? (
          <button className="property-reactivate-btn" onClick={handleReactivate}>Reativar</button>
        ) : (
          <button className="property-details-btn" onClick={handleDetails}>Ver Detalhes</button>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;
