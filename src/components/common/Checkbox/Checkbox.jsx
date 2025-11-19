import './Checkbox.css';

function Checkbox({ label, name, checked, onChange, required = false }) {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        className="checkbox-input"
      />
      <label htmlFor={name} className="checkbox-label">
        {label}
      </label>
    </div>
  );
}

export default Checkbox;
