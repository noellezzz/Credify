import React from "react";

const CTASection = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Credify for your credential verification needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-blue-100 mb-2">Email: info@credify.com</p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <p className="text-blue-100 hover:text-white cursor-pointer transition-colors">About Us</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2">
              <p className="text-blue-100 hover:text-white cursor-pointer transition-colors">GitHub</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-400 pt-8 text-center">
          <p className="text-blue-100">
            © 2024 Credify. All rights reserved. | Secure credential verification powered by blockchain technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CTASection;
