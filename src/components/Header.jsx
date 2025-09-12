import { useState } from "react";
import ymsdgLogo from '../assets/ym4sdgs-logo.jpg';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <span className="font-bold text-lg">YM4SDGs</span> */}
            <img 
              src={ymsdgLogo} 
              alt="ym4sdgs-logo" 
              style={{ width: '150px' }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-green-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-green-600">About</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Programs</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Our Work</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Get Involved</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Contact</a>
            <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
              Join Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 shadow-lg">
          <a href="#" className="block text-gray-700">Home</a>
          <a href="#" className="block text-gray-700">About</a>
          <a href="#" className="block text-gray-700">Programs</a>
          <a href="#" className="block text-gray-700">Our Work</a>
          <a href="#" className="block text-gray-700">Get Involved</a>
          <a href="#" className="block text-gray-700">Contact</a>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
            Join Us
          </button>
        </div>
      )}
    </nav>
  );
}
