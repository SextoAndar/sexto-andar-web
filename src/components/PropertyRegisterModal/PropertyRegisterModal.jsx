import React, { useState } from "react";
import './PropertyRegisterModal.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

const initialState = {
  propertyType: 'apartment',
  address: {
    street: '',
    number: '',
    city: '',
    postal_code: '',
    country: 'Brazil',
  },
  propertySize: '',
  description: '',
  propertyValue: '',
  salesType: 'sale',
  condominiumFee: '',
  commonArea: false,
  floor: '',
  isPetAllowed: false,
  landPrice: '',
  isSingleHouse: false,
  images: [],
};

const PropertyRegisterModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(initialState);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('address.')) {
      setForm(f => ({ ...f, address: { ...f.address, [name.split('.')[1]]: value } }));
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Converte imagens para base64
      const images = await Promise.all(imageFiles.map(async (file, idx) => ({
        image_data: await toBase64(file),
        content_type: file.type,
        display_order: idx + 1,
        is_primary: idx === 0
      })));
      // Monta payload
      const payload = {
        ...form,
        propertySize: parseFloat(form.propertySize),
        propertyValue: parseFloat(form.propertyValue),
        images,
      };
      // Remove campos não usados conforme tipo
      if (form.propertyType === 'apartment') {
        delete payload.landPrice;
        delete payload.isSingleHouse;
      } else {
        delete payload.condominiumFee;
        delete payload.commonArea;
        delete payload.floor;
        delete payload.isPetAllowed;
      }
      // Endpoint
      const endpoint = form.propertyType === 'apartment'
        ? '/api/properties/apartment'
        : '/api/properties/house';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar imóvel');
      setSuccess('Imóvel cadastrado com sucesso!');
      setForm(initialState);
      setImageFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-register-modal-overlay" onClick={onClose}>
      <div className="property-register-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Cadastrar Imóvel</h2>
        <form onSubmit={handleSubmit} className="property-register-form">
          <div className="form-row">
            <label>Tipo:
              <select name="propertyType" value={form.propertyType} onChange={handleInput}>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
              </select>
            </label>
            <label>Venda/Aluguel:
              <select name="salesType" value={form.salesType} onChange={handleInput}>
                <option value="sale">Venda</option>
                <option value="rent">Aluguel</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Rua:
              <input name="address.street" value={form.address.street} onChange={handleInput} required />
            </label>
            <label>Número:
              <input name="address.number" value={form.address.number} onChange={handleInput} required />
            </label>
            <label>Cidade:
              <input name="address.city" value={form.address.city} onChange={handleInput} required />
            </label>
          </div>
          <div className="form-row">
            <label>CEP:
              <input name="address.postal_code" value={form.address.postal_code} onChange={handleInput} required />
            </label>
            <label>País:
              <input name="address.country" value={form.address.country} onChange={handleInput} required />
            </label>
          </div>
          <div className="form-row">
            <label>Tamanho (m²):
              <input name="propertySize" type="number" value={form.propertySize} onChange={handleInput} required />
            </label>
            <label>Valor (R$):
              <input name="propertyValue" type="number" value={form.propertyValue} onChange={handleInput} required />
            </label>
          </div>
          <div className="form-row">
            <label>Descrição:
              <textarea name="description" value={form.description} onChange={handleInput} required />
            </label>
          </div>
          {form.propertyType === 'apartment' && (
            <>
              <div className="form-row">
                <label>Condomínio (R$):
                  <input name="condominiumFee" type="number" value={form.condominiumFee} onChange={handleInput} />
                </label>
                <label>Andar:
                  <input name="floor" type="number" value={form.floor} onChange={handleInput} />
                </label>
                <label>Área comum:
                  <input name="commonArea" type="checkbox" checked={form.commonArea} onChange={handleInput} />
                </label>
                <label>Permite pets:
                  <input name="isPetAllowed" type="checkbox" checked={form.isPetAllowed} onChange={handleInput} />
                </label>
              </div>
            </>
          )}
          {form.propertyType === 'house' && (
            <div className="form-row">
              <label>Preço do terreno (R$):
                <input name="landPrice" type="number" value={form.landPrice} onChange={handleInput} />
              </label>
              <label>Casa única:
                <input name="isSingleHouse" type="checkbox" checked={form.isSingleHouse} onChange={handleInput} />
              </label>
            </div>
          )}
          <div className="form-row">
            <label>Imagens (até 15):
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>
          </div>
          <div className="form-row">
            {imageFiles.map((file, idx) => (
              <span key={idx} style={{ fontSize: 12, marginRight: 8 }}>{file.name}</span>
            ))}
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <div className="form-row">
            <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar Imóvel'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyRegisterModal;
