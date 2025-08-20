import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Leafora</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Grow Your Work, Grow Your Future. The premium freelancing marketplace where talent meets opportunity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/services?category=Web+Development" className="text-gray-400 hover:text-green-400 transition-colors">Web Development</Link></li>
              <li><Link to="/services?category=UI%2FUX+Design" className="text-gray-400 hover:text-green-400 transition-colors">UI/UX Design</Link></li>
              <li><Link to="/services?category=Graphic+Design" className="text-gray-400 hover:text-green-400 transition-colors">Graphic Design</Link></li>
              <li><Link to="/services?category=Content+Writing" className="text-gray-400 hover:text-green-400 transition-colors">Content Writing</Link></li>
              <li><Link to="/services?category=Digital+Marketing" className="text-gray-400 hover:text-green-400 transition-colors">Digital Marketing</Link></li>
              <li><Link to="/services?category=Video+Editing" className="text-gray-400 hover:text-green-400 transition-colors">Video Editing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</Link></li>
              <li><Link to="/trust-safety" className="text-gray-400 hover:text-green-400 transition-colors">Trust & Safety</Link></li>
              <li><Link to="/selling-guide" className="text-gray-400 hover:text-green-400 transition-colors">Selling on Leafora</Link></li>
              <li><Link to="/buying-guide" className="text-gray-400 hover:text-green-400 transition-colors">Buying on Leafora</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-4 lg:mb-0">
              <Link to="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
              <Link to="/refund" className="hover:text-green-400 transition-colors">Refund Policy</Link>
              <Link to="/cookies" className="hover:text-green-400 transition-colors">Cookie Policy</Link>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Leafora. All rights reserved.
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>support@leafora.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;