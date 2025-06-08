import React from "react";

const FeaturesSection = ({ features, activeCard, setActiveCard }) => {
  return (
    <div className="py-20 bg-[var(--primary-color)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--secondary-color)] mb-4">Why Choose Credify?</h2>
          <p className="text-xl text-[var(--quaternary-color)] max-w-2xl mx-auto">
            Experience the next generation of credential verification with cutting-edge technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
                activeCard === feature.id ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setActiveCard(feature.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className={`bg-gradient-to-br ${feature.color} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}>
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--tertiary-color)] mb-3">{feature.title}</h3>
                <p className="text-[var(--tertiary-color)] opacity-90 text-sm mb-4">{feature.description}</p>
                {activeCard === feature.id && (
                  <div className="text-[var(--secondary-color)] text-xs opacity-80 border-t border-white/20 pt-4 animate-fadeIn">
                    {feature.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;