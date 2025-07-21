import React, { useState, useEffect } from "react";
import Header from "../../components/layouts/Header";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const values = [
    {
      id: 1,
      title: "Security First",
      description: "We prioritize the highest levels of security in every aspect of our platform",
      icon: "🔒",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Innovation",
      description: "Constantly pushing boundaries with cutting-edge blockchain technology",
      icon: "💡",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Trust & Transparency",
      description: "Building trust through transparent processes and reliable verification",
      icon: "🤝",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "Accessibility",
      description: "Making credential verification accessible to everyone, everywhere",
      icon: "🌍",
      color: "from-orange-500 to-red-500"
    }
  ];

  const team = [
    {
      name: "Rajesh Respall",
      role: "Full Stack Developer",
      expertise: "React, Node.js, Blockchain",
      image: "👨‍💻",
      bio: "Passionate about creating secure and scalable web applications with 3+ years in system development.",
      github: "rajrespall"
    },
    {
      name: "Diana Carreon",
      role: "UI/UX Lead Designer",
      expertise: "Design Systems, Figma, User Research",
      image: "👩‍🎨",
      bio: "Crafting intuitive user experiences with a focus on accessibility and modern design principles.",
      github: "dayaannaa"
    },
    {
      name: "Mark Bartolome",
      role: "UI/UX Assistant",
      expertise: "Wireframing, Prototyping, Design Collaboration",
      image: "👨‍💻",
      bio: "Supporting design workflows and implementing UI components under the guidance of the UX lead.",
      github: "sadvoidhours"
    },
    {
      name: "Miguel Dacumos",
      role: "Backend Engineer",
      expertise: "Python, PostgreSQL, AWS",
      image: "👨‍🔧",
      bio: "Building robust APIs and database architectures for high-performance applications.",
      github: "noellezzz"
    },
    {
      name: "Espinosa, Derick James M.",
      role: "Backend Engineer",
      expertise: "System Architecture, API Development",
      image: "👨‍🔒",
      bio: "Experienced in designing scalable backend systems and ensuring data integrity.",
      github: "deJames-13"
    }
  ];

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--tertiary-color)] min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-8 py-20 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className={`text-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--secondary-color)] sm:text-6xl lg:text-7xl">
                About{" "}
                <span className="text-[var(--quaternary-color)]">
                  Credify
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-[var(--secondary-color)] max-w-3xl mx-auto">
                We're revolutionizing credential verification through blockchain technology, 
                making authentication secure, instant, and tamper-proof for institutions worldwide.
              </p>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--quaternary-color)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#e6d9b8] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[var(--tertiary-color)] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-6">Our Mission</h2>
                <p className="text-lg text-[var(--secondary-color)] mb-6">
                  At Credify, we believe that credential verification should be instant, secure, and accessible to everyone. 
                  Our mission is to eliminate fraud in digital credentials while making the verification process seamless 
                  for both issuers and verifiers.
                </p>
                <p className="text-lg text-[var(--secondary-color)]">
                  By leveraging blockchain technology, we ensure that every certificate is tamper-proof and can be 
                  verified in seconds, creating a trustworthy ecosystem for digital credentials.
                </p>
              </div>
              <div className="relative">
                <div className="bg-[var(--primary-color)] rounded-2xl shadow-xl p-8 border border-[var(--quaternary-color)]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-[var(--secondary-color)] mb-2">Our Vision</h3>
                    <p className="text-[var(--secondary-color)]">
                      To become the global standard for secure credential verification, 
                      enabling trust in digital certificates worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-8 bg-[var(--primary-color)]/50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-4">Our Values</h2>
              <p className="text-lg text-[var(--secondary-color)] max-w-2xl mx-auto">
                These core values guide everything we do and shape how we build our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.id}
                  className="group relative bg-[var(--primary-color)] rounded-2xl p-6 shadow-lg border border-[var(--quaternary-color)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--secondary-color)] flex items-center justify-center text-[var(--primary-color)] text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--secondary-color)] mb-3">{value.title}</h3>
                  <p className="text-[var(--secondary-color)] leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-4">Meet Our Team</h2>
              <p className="text-lg text-[var(--secondary-color)] max-w-2xl mx-auto">
                The passionate individuals behind Credify, working together to revolutionize credential verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-[var(--primary-color)] rounded-2xl p-4 shadow-lg border border-[var(--quaternary-color)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {member.image}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--secondary-color)] mb-1">{member.name}</h3>
                    <p className="text-[var(--quaternary-color)] font-medium mb-2 text-sm">{member.role}</p>
                    <p className="text-xs text-[var(--quaternary-color)] mb-3">{member.expertise}</p>
                    <p className="text-[var(--secondary-color)] text-xs leading-relaxed mb-3">{member.bio}</p>
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-[var(--secondary-color)] hover:text-[var(--quaternary-color)] font-medium"
                    >
                      @{member.github}
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 lg:px-8 bg-[var(--secondary-color)]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--primary-color)] mb-4">Built with Modern Technology</h2>
              <p className="text-lg text-[var(--tertiary-color)] max-w-2xl mx-auto">
                Our platform uses cutting-edge technologies to ensure security, scalability, and performance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Motoko", icon: "⛓️", desc: "Smart contract blockchain" },
                { name: "React", icon: "⚛️", desc: "Modern frontend framework" },
                { name: "Node.js", icon: "🚀", desc: "High-performance backend" },
                { name: "Supabase", icon: "🗄️", desc: "Real-time database platform" }
              ].map((tech, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--primary-color)] mb-2">{tech.name}</h3>
                  <p className="text-[var(--tertiary-color)]">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
        `}</style>
        </div>
    </>
  );
};

export default About;
