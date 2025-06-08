import React from "react";

const DevelopersSection = ({ developers }) => {
  return (
    <div className="py-20 bg-[var(--tertiary-color)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--secondary-color)] mb-4">Meet Our Developers</h2>
          <p className="text-xl text-[var(--quaternary-color)] max-w-2xl mx-auto">
            The talented team behind Credify's innovative credential verification platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {developers.map((developer, index) => (
            <div
              key={index}
              className="bg-[var(--primary-color)] p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 border border-[var(--quaternary-color)] hover:border-[#b8a47e] flex flex-col h-full"
            >
              <div className="text-center flex-1 flex flex-col">
                <div className="text-6xl mb-4">{developer.image}</div>
                <h3 className="text-xl font-bold text-[var(--secondary-color)] mb-1">{developer.name}</h3>
                <p className="text-[var(--secondary-color)] font-semibold mb-2">{developer.role}</p>
                <p className="text-sm text-[var(--quaternary-color)] mb-4">{developer.expertise}</p>
                <p className="text-sm text-[var(--secondary-color)] mb-4 leading-relaxed flex-1 min-h-[4rem]">{developer.bio}</p>
                
                <a 
                  href={`https://github.com/${developer.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--secondary-color)] hover:bg-[#37421b] text-[var(--primary-color)] py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 mt-auto block text-center"
                >
                  @{developer.github}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopersSection;