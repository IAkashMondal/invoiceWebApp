const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 ">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
                <nav className="flex space-x-4 mt-2 md:mt-0">
                    <a href="/about" className="hover:text-gray-400 transition">About</a>
                    <a href="/about" className="hover:text-gray-400 transition">Contact</a>
                    <a href="/contact" className="hover:text-gray-400 transition">Contact</a>
                    <a href="terms-and-condition" className="hover:text-gray-400 transition">Privacy Policy</a>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
