import React from "react";
import HeroSection from "../../components/home/HeroSection"; // Adjust path as needed

const Index = () => {
  return (
    <div>
      <HeroSection />
      {/* You can add more sections below */}
      <div className="container mx-auto px-4 py-8">
        <div>Additional content goes here</div>
      </div>
    </div>
  );
};

export default Index;
