import React, { useEffect, useState } from "react";
import './PropertyDetailsModal.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PropertyDetailsModal = ({ propertyId, isOpen, onClose }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setProperty(null);
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties/${propertyId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao buscar imóvel");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="property-details-modal-overlay" onClick={onClose}>
      <div className="property-details-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {loading && <div>Carregando...</div>}
        {error && <div>Erro: {error}</div>}
        {property && (
          <>
            <h2>Detalhes do Imóvel</h2>
            {property.images && property.images.length > 0 && (
              <div className="property-images">
                {property.images.map((image) => (
                  <img
                    key={image.id}
                    src={`${API_URL}/api/images/${image.id}`}
                    alt="Foto do imóvel"
                    style={{ maxWidth: 220, margin: 6, borderRadius: 8 }}
                  />
                ))}
              </div>
            )}
            <div className="property-info">
              <p><strong>Endereço:</strong> {property.address.street}, {property.address.number} - {property.address.city}</p>
              <p><strong>Tamanho:</strong> {property.propertySize} m²</p>
              <p><strong>Descrição:</strong> {property.description}</p>
              <p><strong>Valor:</strong> R$ {property.propertyValue}</p>
              <p><strong>Tipo:</strong> {property.propertyType}</p>
              <p><strong>Venda/Aluguel:</strong> {property.salesType}</p>
              {/* Adicione mais campos conforme necessário */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
