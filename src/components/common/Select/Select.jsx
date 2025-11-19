import './Select.css';

function Select({ label, name, value, onChange, options, required = false }) {
  return (
    <div className="select-container">
      {label && <label htmlFor={name} className="select-label">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="select-field"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
