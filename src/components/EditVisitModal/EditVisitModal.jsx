import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import { updateVisit } from '../../services/visitService';
import './EditVisitModal.css';

function EditVisitModal({ isOpen, onClose, visit, onVisitUpdated }) {
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visit) {
      setVisitDate(visit.visitDate.substring(0, 16)); // Format for datetime-local input
      setNotes(visit.notes || '');
    }
  }, [visit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateVisit(visit.id, {
        visitDate,
        notes: notes || '',
      });
      alert('Visita atualizada com sucesso!');
      onVisitUpdated();
      onClose();
    } catch (error) {
      alert(`Erro ao atualizar visita: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Visita">
      <form onSubmit={handleSubmit} className="edit-visit-form">
        <Input
          type="datetime-local"
          label="Data e Hora da Visita"
          name="visitDate"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          required
        />
        <div className="form-group">
          <label htmlFor="notes">Observações (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            placeholder="Alguma observação para o proprietário..."
          />
        </div>
        <div className="form-actions">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar Visita'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditVisitModal;
