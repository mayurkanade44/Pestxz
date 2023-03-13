const InputSelect = ({ labelText, name, value, handleChange, list, id }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText}
      </label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        className="form-select"
        
      >
        {list.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default InputSelect;
