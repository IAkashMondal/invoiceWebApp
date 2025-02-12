const Input = ({ name, onKeyDown, type, value, onChange, placeholder, className }) => {
    return (
        <input
            name={name}
            type={type}
            value={value}
            onKeyDown={onKeyDown}  
            onChange={onChange}
            
            placeholder={placeholder}
            className={`p-2 border rounded-md ${className}`}
        />
    );
};

export { Input }; // Correctly export the Input component