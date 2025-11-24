import './Input.css';

function Input({ type = 'text', label, name, value, onChange, placeholder, required = false, autoComplete }) {
  return (
    <div className="input-container">
      {label && <label htmlFor={name} className="input-label">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default Input;
