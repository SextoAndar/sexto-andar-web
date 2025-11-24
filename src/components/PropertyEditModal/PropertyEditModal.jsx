import React, { useState, useEffect } from "react";
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button'; // Import the Button component
import * as propertyService from '../../services/propertyService';
import './PropertyEditModal.css';

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

const PropertyEditModal = ({ isOpen, onClose, property, onSave, onImageUpdate }) => {
  const [form, setForm] = useState({
    description: '',
    propertyValue: '',
    propertySize: '',
    condoFee: '',
    bedrooms: '',
    bathrooms: '',
    petFriendly: false,
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (property) {
      setForm({
        description: property.description || '',
        propertyValue: property.propertyValue || '',
        propertySize: property.propertySize || '',
        condoFee: property.condoFee || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        petFriendly: property.petFriendly || false,
      });
      setImages(property.images || []);
    }
  }, [property]);

  if (!isOpen) return null;

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleAddImages = async () => {
    if (newImages.length === 0) return;
    console.log('handleAddImages: Starting image upload...');
    setLoading(true);
    try {
      for (const file of newImages) {
        const image_data = await toBase64(file);
        const payload = {
          image_data,
          content_type: file.type,
          display_order: images.length + 1,
          is_primary: images.length === 0,
        };
        console.log('handleAddImages: Uploading image with payload:', payload);
        await propertyService.addImage(property.id, payload);
      }
      console.log('handleAddImages: Image upload successful.');
      onImageUpdate();
    } catch (err) {
      console.error('handleAddImages: Error uploading images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setNewImages([]);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (images.length <= 1) {
      setError("A propriedade deve ter pelo menos uma imagem.");
      return;
    }
    console.log(`handleDeleteImage: Deleting image ${imageId}...`);
    setLoading(true);
    try {
      await propertyService.deleteImage(imageId);
      console.log(`handleDeleteImage: Image ${imageId} deleted successfully.`);
      onImageUpdate(); // Refresh without closing
    } catch (err) {
      console.error(`handleDeleteImage: Error deleting image ${imageId}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetPrimary = async (imageId) => {
    console.log(`handleSetPrimary: Setting image ${imageId} as primary...`);
    setLoading(true);
    try {
      await propertyService.setPrimaryImage(property.id, imageId);
      console.log(`handleSetPrimary: Image ${imageId} set as primary successfully.`);
      onImageUpdate(); // Refresh without closing
    } catch (err) {
      console.error(`handleSetPrimary: Error setting primary image ${imageId}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteProperty = async () => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.')) {
      setLoading(true);
      setError(null);
      try {
        await propertyService.deleteProperty(property.id);
        console.log('handleDeleteProperty: Property deleted successfully.');
        onSave(); // Close modal and refresh list
      } catch (err) {
        console.error('handleDeleteProperty: Error deleting property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit: Starting property update...');
    setLoading(true);
    setError(null);
    try {
      const payload = {
        description: form.description,
        propertyValue: parseFloat(form.propertyValue),
        condoFee: parseFloat(form.condoFee),
        propertySize: parseFloat(form.propertySize),
        bedrooms: parseInt(form.bedrooms, 10),
        bathrooms: parseInt(form.bathrooms, 10),
        petFriendly: form.petFriendly,
      };
      console.log('handleSubmit: Updating property with payload:', payload);
      await propertyService.updateProperty(property.id, payload);
      console.log('handleSubmit: Property updated successfully.');
      
      onSave(); // Close modal and refresh list
    } catch (err) {
      console.error('handleSubmit: Error updating property:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Imóvel">
      <form onSubmit={handleSubmit} className="property-edit-form">
        
        {/* Text Fields */}
        <div className="form-group">
          <label>Descrição</label>
          <textarea name="description" value={form.description} onChange={handleInput} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <input name="propertyValue" type="number" value={form.propertyValue} onChange={handleInput} />
          </div>
          <div className="form-group">
            <label>Condomínio (R$)</label>
            <input name="condoFee" type="number" value={form.condoFee} onChange={handleInput} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tamanho (m²)</label>
            <input name="propertySize" type="number" value={form.propertySize} onChange={handleInput} />
          </div>
          <div className="form-group">
            <label>Quartos</label>
            <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleInput} />
          </div>
          <div className="form-group">
            <label>Banheiros</label>
            <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleInput} />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input name="petFriendly" type="checkbox" checked={form.petFriendly} onChange={handleInput} />
            Permite pets
          </label>
        </div>

        {/* Image Management */}
        <div className="image-management">
          <h4>Imagens</h4>
          <div className="current-images">
            {images.map(img => (
              <div key={img.id} className={`img-container ${img.is_primary ? 'primary' : ''}`}>
                <img src={`/api/api/images/${img.id}`} alt="Property" />
                <div className="img-actions">
                  <button type="button" onClick={() => handleDeleteImage(img.id)} title="Apagar">🗑️</button>
                  {!img.is_primary && <button type="button" onClick={() => handleSetPrimary(img.id)} title="Definir como principal">⭐</button>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="form-group">
            <label>Adicionar novas imagens</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          </div>

          {newImages.length > 0 && (
            <div className="new-images-preview">
              <h5>Prévia das novas imagens:</h5>
              <div className="current-images">
                {newImages.map((file, index) => (
                  <div key={index} className="img-container">
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  </div>
                ))}
              </div>
              <Button type="button" onClick={handleAddImages} variant="secondary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Imagens'}
              </Button>
            </div>
          )}
        </div>
        

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <Button type="button" onClick={onClose} variant="secondary">Cancelar</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button type="button" onClick={handleDeleteProperty} variant="danger" disabled={loading}>
            Excluir Imóvel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PropertyEditModal;
