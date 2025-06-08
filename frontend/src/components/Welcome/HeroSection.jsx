import React from "react";

const HeroSection = ({ isVisible }) => {
  return (
    <div className="relative bg-gradient-to-br from-[var(--tertiary-color)] via-[var(--primary-color)] to-[#e6d9b8] pt-10">
      <div className="absolute inset-0 bg-white opacity-20 z-[1]"></div>
      <div className="absolute inset-0 z-[0] overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--quaternary-color)] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-[#e6d9b8] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[var(--tertiary-color)] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20 z-[2]">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl lg:text-7xl font-bold text-[var(--secondary-color)] mb-6 leading-tight">
            Trust Through
            <span className="bg-gradient-to-r from-[#e6d9b8] to-[#b8a47e] bg-clip-text text-transparent"> Verification</span>
          </h1>
          <p className="text-xl text-[var(--secondary-color)] mb-8 max-w-3xl mx-auto leading-relaxed">
            The future of credential verification is here. Secure, instant, and globally recognized 
            blockchain-based certificates that employers and institutions trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;