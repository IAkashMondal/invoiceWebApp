const List = ({ children, className }) => {
    return <ul className={`list-none space-y-2 ${className}`}>{children}</ul>;
};

const ListItem = ({ children, className }) => {
    return (
        <li className={`flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition ${className}`}>
            {children}
        </li>
    );
};

export { List, ListItem };