import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <img 
                src="./ym4sdgs-logo.jpg" 
                alt="YM4SDGs Logo" 
                className="h-12 w-auto mb-4"
              />
              <p className="text-green-100 leading-relaxed mb-6">
                Empowering young people to shape policies, drive grassroots action, and build a sustainable future.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/YM4SDGs" target='_blank' className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
                  <i className="ri-facebook-fill"></i>
                </a>
                <a href="https://x.com/YM4SDGs" target='_blank' className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
                  <i className="ri-twitter-fill"></i>
                </a>
                <a href="https://www.instagram.com/ym4sdgs" target='_blank' className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
                  <i className="ri-instagram-fill"></i>
                </a>
                <a href="https://www.youtube.com/@ym4sdgs" target='_blank' className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
                  <i className="ri-youtube-fill"></i>
                </a>
                <a href="https://www.linkedin.com/company/ym4sdgs/" target='_blank' className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
                  <i className="ri-linkedin-fill"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Programs</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">9ja Climate Walk</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Youth Climate Summit</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Climate Leadership Programme</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">SDGs Campus Conference</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Get Involved</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Volunteer</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Content Creator</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Social Media Ambassador</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Partnership</a></li>
                <li><a href="/admin/login" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">Manage</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@ym4sdgs.org" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">
                    info@ym4sdgs.org
                  </a>
                </li>
                <li>
                  <a href="https://www.ym4sdgs.org" target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-yellow-400 transition-colors cursor-pointer">
                    www.ym4sdgs.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-600 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-green-100 text-sm">
                © 2025 YM4SDGs. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://yusufias-portfolio.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-100 text-sm hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  Developed By Yusufia Dev
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer