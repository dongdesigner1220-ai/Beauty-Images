import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Lumina AI Enhancer. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};