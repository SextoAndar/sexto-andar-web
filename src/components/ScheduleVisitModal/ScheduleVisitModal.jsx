import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import './ScheduleVisitModal.css';

function ScheduleVisitModal({ isOpen, onClose, onSchedule }) {
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert visitDate from datetime-local string to UTC ISO 8601 string
    // datetime-local gives "YYYY-MM-DDTHH:mm".
    // When passed to Date constructor, it's parsed as local time.
    // toISOString() then converts this local time to UTC.
    const localDateTime = new Date(visitDate);
    const utcVisitDate = localDateTime.toISOString();

    try {
      await onSchedule({
        visitDate: utcVisitDate, // Send UTC ISO string
        notes: notes || '',
      });
      // onSchedule handles success message and closing
    } catch (error) {
      alert(`Erro ao agendar visita: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agendar Visita">
      <form onSubmit={handleSubmit} className="schedule-visit-form">
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
            {loading ? 'Agendando...' : 'Agendar Visita'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ScheduleVisitModal;
