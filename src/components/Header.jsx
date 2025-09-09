
const Header = () => {
  return (
    <div className="font-sans" >
        {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              Y
            </div>
            <span className="font-bold text-lg text-gray-800">YM4SDGs</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#" className="hover:text-green-600">Home</a>
            <a href="#" className="hover:text-green-600">About</a>
            <a href="#" className="hover:text-green-600">Programs</a>
            <a href="#" className="hover:text-green-600">Our Work</a>
            <a href="#" className="hover:text-green-600">Get Involved</a>
            <a href="#" className="hover:text-green-600">Contact</a>
          </nav>

          {/* Join Us button */}
          <a
            href="#"
            className="hidden md:inline-block bg-green-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-green-700 transition"
          >
            Join Us
          </a>
        </div>
      </header>
    </div>
  )
}

export default Header