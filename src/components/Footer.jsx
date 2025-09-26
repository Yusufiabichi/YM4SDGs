// src/components/FooterSection.jsx
import {
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  FaInstagram,
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-center py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Shape the Future?
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands of young changemakers working towards a sustainable and
          equitable world. Your voice matters, your action counts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
            Become a Volunteer
          </button>
          <button className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition">
            Partner With Us
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-[#0f172a] text-gray-300 py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Logo + About */}
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                🌍
              </div>
              <h3 className="text-lg font-bold text-white">YM4SDGs</h3>
            </div>
            <p className="mt-4 text-sm">
              Empowering young people to shape policies, drive grassroots
              action, and build a sustainable future.
            </p>
            <div className="flex space-x-4 mt-4 text-gray-400">
              <a href="#"><FaInstagram className="w-5 h-5 hover:text-white" /></a>
              <a href="#"><FaXTwitter className="w-5 h-5 hover:text-white" /></a>
              <a href="#"><FaFacebookF className="w-5 h-5 hover:text-white" /></a>
              <a href="#"><FaLinkedinIn className="w-5 h-5 hover:text-white" /></a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li>9ja Climate Walk</li>
              <li>Youth Climate Summit</li>
              <li>Climate Leadership Programme</li>
              <li>SDGs Campus Conference</li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm">
              <li>Volunteer</li>
              <li>Content Creator</li>
              <li>Social Media Ambassador</li>
              <li>Partnership</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span>contact@ymsdgs.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                <span>www.ymsdgs.org</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}
