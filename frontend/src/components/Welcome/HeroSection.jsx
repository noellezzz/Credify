import React from "react";

const HeroSection = ({ isVisible }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 pt-10">
      <div className="absolute inset-0 bg-black opacity-20 z-[1]"></div>
      <div className="absolute inset-0 z-[0] overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20 z-[2]">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trust Through
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Verification</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            The future of credential verification is here. Secure, instant, and globally recognized 
            blockchain-based certificates that employers and institutions trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
