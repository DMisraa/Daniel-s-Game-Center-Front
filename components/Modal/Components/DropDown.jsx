function Dropdown({ options, value, handleChange}) {

  return (
    <div>
      <label htmlFor="dropdown" />

      <select
        id="dropdown"
        value={value}
        onChange={handleChange}
        style={{
            display: 'flex',  
            textAlign: "center",
            cursor: "pointer",
            width: '75px',
            height: '40px',
            gap: '8px',  
            borderRadius: '8px',
            border: '2px solid #E9E9E9'
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;

    
