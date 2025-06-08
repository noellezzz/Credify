import React from "react";

const CTASection = () => {
  return (
    <footer className="bg-gradient-to-r from-[#37421b] via-[var(--secondary-color)] to-[#b8a47e] text-[var(--secondary-color)]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-[var(--primary-color)]">Ready to Get Started?</h2>
          <p className="text-xl text-[var(--primary-color)] mb-8 max-w-2xl mx-auto">
            Join Credify for your credential verification needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Contact Us</h3>
            <p className="text-[var(--primary-color)] mb-2">Email: info@credify.com</p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Quick Links</h3>
            <div className="space-y-2">
              <p className="text-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition-colors">About Us</p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Follow Us</h3>
            <div className="space-y-2">
              <p className="text-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition-colors">GitHub</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[var(--quaternary-color)] pt-8 text-center">
          <p className="text-[var(--primary-color)]">
            © 2024 Credify. All rights reserved. | Secure credential verification powered by blockchain technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CTASection;