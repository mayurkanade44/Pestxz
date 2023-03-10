import React from "react";

const InputRow = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  placeholder,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

export default InputRow;
