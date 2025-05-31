import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectUser,
  selectUserRole,
} from "../../features/user/userSelector";
import { clearUser } from "../../features/user/userSlice";
import Logo from "../../assets/Credify.png";

const Index = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsNavbarVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsNavbarVisible(false);
        setIsMobileMenuOpen(false); // Close mobile menu when hiding navbar
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(clearUser());
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePage = (path) => location.pathname === path;

  const features = [
    {
      id: 1,
      title: "Instant Verification",
      description: "Get your credentials verified in seconds using blockchain technology",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
      details: "Our AI-powered system processes and verifies credentials instantly, providing real-time validation with 99.9% accuracy."
    },
    {
      id: 2,
      title: "Tamper-Proof Security",
      description: "Blockchain-secured certificates that cannot be forged or altered",
      icon: "🛡️",
      color: "from-green-500 to-emerald-500",
      details: "Every credential is secured with cryptographic hashing and distributed across our blockchain network for ultimate security."
    },
    {
      id: 3,
      title: "Global Recognition",
      description: "Accepted by institutions and employers worldwide",
      icon: "🌍",
      color: "from-purple-500 to-pink-500",
      details: "Our certificates are recognized by over 500 institutions across 50 countries, making your credentials truly global."
    },
    {
      id: 4,
      title: "Easy Integration",
      description: "Simple API integration for institutions and platforms",
      icon: "🔧",
      color: "from-orange-500 to-red-500",
      details: "Integrate with your existing systems in minutes using our comprehensive API and developer tools."
    }
  ];

  const supportOptions = [
    {
      name: "Alex Chen",
      role: "Full Stack Developer",
      expertise: "React, Node.js, Blockchain",
      image: "👨‍💻",
      bio: "Passionate about creating secure and scalable web applications with 5+ years in blockchain development.",
      github: "alexchen-dev"
    },
    {
      name: "Sarah Mitchell",
      role: "UI/UX Designer",
      expertise: "Design Systems, Figma, User Research",
      image: "👩‍🎨",
      bio: "Crafting intuitive user experiences with a focus on accessibility and modern design principles.",
      github: "sarah-designs"
    },
    {
      name: "Marcus Johnson",
      role: "Backend Engineer",
      expertise: "Python, PostgreSQL, AWS",
      image: "👨‍🔧",
      bio: "Building robust APIs and database architectures for high-performance applications.",
      github: "marcus-backend"
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer",
      expertise: "Docker, Kubernetes, CI/CD",
      image: "👩‍💻",
      bio: "Automating deployment pipelines and ensuring seamless infrastructure management.",
      github: "emily-devops"
    },
    {
      name: "David Kim",
      role: "Security Specialist",
      expertise: "Cryptography, Penetration Testing",
      image: "👨‍🔒",
      bio: "Ensuring the highest security standards for blockchain-based credential systems.",
      github: "david-security"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
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

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Credify?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of credential verification with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white opacity-90 text-sm mb-4">{feature.description}</p>
                  {activeCard === feature.id && (
                    <div className="text-white text-xs opacity-80 border-t border-white/20 pt-4 animate-fadeIn">
                      {feature.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Developers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The talented team behind Credify's innovative credential verification platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {supportOptions.map((developer, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 border border-green-100 hover:border-green-300"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{developer.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{developer.name}</h3>
                  <p className="text-green-600 font-semibold mb-2">{developer.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{developer.expertise}</p>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{developer.bio}</p>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                    @{developer.github}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Credify for their credential verification needs
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              Start Free Trial
            </button>
            <button class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Index;
