const Input = ({ name, onKeyDown, type, value, defaultValue, onChange, placeholder, className, required }) => {
    return (
        <input
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            onKeyDown={onKeyDown}
            onChange={onChange}
            required
            placeholder={placeholder}
            className={`p-2 border rounded-md ${className}`}
        />
    );
};

export { Input }; // Correctly export the Input component