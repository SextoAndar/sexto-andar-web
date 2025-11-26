import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ type = 'text', label, name, value, onChange, placeholder, required = false, autoComplete }, ref) => {
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
        ref={ref}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
