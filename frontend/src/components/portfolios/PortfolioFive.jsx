import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon, Heart, HeartIcon } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

// --- Data Transformation Function (Kept as is for functionality) ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString.substring(0, 10);
  }
};

const transformPortfolioData = (backendData) => {
  if (!backendData || !backendData.data) return {};

  const { portfolio, userDetails, socialLinks, skills, projects, certificates, education, experience, hobbies } = backendData.data;

  const firstUserDetails = userDetails && userDetails[0] ? userDetails[0] : {};
  const firstSocialLinks = socialLinks && socialLinks[0] ? socialLinks[0] : {};

  return {
    portfolioId: portfolio?._id || '',
    userDetails: {
      fullName: firstUserDetails.fullName || 'Katherine Smith',
      role: firstUserDetails.role || 'Full Stack Developer',
      email: firstUserDetails.email || 'katherine.smith@example.com',
      phone: firstUserDetails.phone || '+1 555-123-4567',
      location: firstUserDetails.location || 'San Francisco, CA',
      profileImage: firstUserDetails.profileImage || "https://placehold.co/300x300/F0EFEB/7048A8?text=KS", // Updated placeholder color
      about: firstUserDetails.about || 'A passionate developer specializing in modern web technologies. I enjoy building scalable and impactful applications from the ground up.',
      resumeLink: firstUserDetails.resumeLink || '#',
    },
    socialLinks: {
      github: firstSocialLinks.github || 'https://github.com/example',
      linkedin: firstSocialLinks.linkedin || 'https://linkedin.com/in/example',
      twitter: firstSocialLinks.twitter || '#',
      instagram: firstSocialLinks.instagram || '#',
    },
    skills: skills.map(skill => ({
      name: skill.name || 'N/A',
      level: skill.level || 'Intermediate',
      category: skill.category || 'Other',
    })),
    projects: projects.map(project => ({
      title: project.title || 'E-Commerce Platform',
      description: project.description || 'A full-featured e-commerce site with integrated payment gateways and user authentication.',
      techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : ['React', 'Node.js', 'MongoDB'],
      projectLink: project.projectLink || '#',
      githubLink: project.githubLink || '#',
      image: project.image || "https://placehold.co/600x400/8A2BE2/FFFFFF?text=Project+Image", // Updated placeholder color
    })),
    experience: experience.map(exp => ({
      company: exp.company || 'Tech Innovators Inc.',
      position: exp.position || 'Senior Software Engineer',
      startDate: formatDate(exp.startDate) || 'Jul 2020',
      endDate: formatDate(exp.endDate) || 'Present',
      description: exp.description || 'Led a team in developing a microservices architecture for a high-traffic application, increasing system performance by 30%.',
    })),
    education: education.map(edu => ({
      institution: edu.institution || 'State University',
      degree: edu.degree || 'M.S.',
      fieldOfStudy: edu.fieldOfStudy || 'Computer Science',
      startDate: formatDate(edu.startDate) || 'Aug 2018',
      endDate: formatDate(edu.endDate) || 'May 2020',
      grade: edu.grade || '4.0 GPA',
    })),
    certificates: certificates.map(cert => ({
      title: cert.title || 'AWS Certified Developer',
      issuer: cert.issuer || 'Amazon Web Services',
      issueDate: formatDate(cert.issueDate) || 'Jan 2023',
      certificateLink: cert.certificateLink || '#',
      image: cert.image || "https://placehold.co/400x300/8A2BE2/FFFFFF?text=Certificate+Image" // Updated placeholder color
    })),
    hobbies: hobbies.map(h => ({ hobby: h.hobby || 'Coding' })),
  };
};

// --- Custom Hooks and Helper Components (Adjusted colors) ---

const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current); // Use ref.current for cleanup
      }
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
};

const AnimatedSection = ({ children, className, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className} ${inView
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// This is kept for internal section titles but customized to the new style
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <AnimatedSection className="mb-12 border-l-4 border-purple-500 pl-4">
    <div className="flex items-center text-purple-600 mb-1">
      {Icon && <Icon className="w-6 h-6 mr-2" />}
      <h2 className="text-sm font-semibold tracking-widest uppercase">{title}</h2>
    </div>
    <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{subtitle}</p>
  </AnimatedSection>
);

const NavLink = ({ id, label }) => (
  <a
    href={`#${id}`}
    className="py-1 px-3 text-sm font-medium text-gray-600 hover:text-purple-600 transition duration-200 hover:bg-purple-100 rounded-full"
    onClick={() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    {label}
  </a>
);


// --- Section Components (Redesigned for the new theme) ---

const HeroSection = ({ userDetails, socialLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Work' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-purple-50 flex items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements resembling the uploaded image pattern */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-purple-200 opacity-20 transform skew-y-6 origin-top-left -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>


      <div className="max-w-7xl mx-auto z-10 w-full">
        {/* Header/Nav - Darkened for better contrast on light purple hero background */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-purple-600">
                <HeartIcon />
              </span>
              <span className="ml-4 text-lg font-semibold text-gray-900 hidden sm:inline">{userDetails.fullName}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full text-gray-900 hover:bg-purple-100 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden pt-20`}>
          <nav className="flex flex-col space-y-2 p-6">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-purple-600 p-3 rounded-lg hover:bg-purple-50 transition duration-200"
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center pt-16">
          <div className="space-y-6 order-2 md:order-1">
            <AnimatedSection>
              <p className="text-lg text-gray-600 font-medium tracking-widest uppercase">Hi, I'm {userDetails.fullName} 👋</p>
              <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-tight">
                <span className="block text-purple-600">I'M {userDetails.role}</span>
                <span className="block text-gray-800">in a new and unique way</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-xl text-gray-700 max-w-lg italic">
                "{userDetails.about}"
              </p>
            </AnimatedSection>

            <AnimatedSection delay={400} className="flex space-x-4">
              <a
                href={userDetails.resumeLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-purple-600 hover:bg-purple-700 transition duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                Get Started <Download className="ml-2 w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="flex items-center px-6 py-3 border border-purple-600 text-base font-medium rounded-full text-purple-600 bg-white hover:bg-purple-50 transition duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                Contact Me
              </a>
            </AnimatedSection>

            {/* Social Links are better in the footer/contact for this theme, but kept here for completeness */}
            <AnimatedSection delay={600} className="flex space-x-4 pt-4">
              {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition duration-200 transform hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {socialLinks.github && socialLinks.github !== '#' && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition duration-200 transform hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {socialLinks.twitter && socialLinks.twitter !== '#' && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition duration-200 transform hover:scale-110">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </AnimatedSection>

          </div>

          <div className="justify-center flex order-1 md:order-2">
            <AnimatedSection className="relative w-full max-w-sm">
              {/* Stylish Background Shape (like the purple shape in the image) */}
              <div className="absolute inset-x-0 bottom-0 top-1/4 bg-purple-300 rounded-2xl shadow-2xl z-0 transform rotate-1"></div>
              <img
                className="w-full h-auto object-cover rounded-2xl shadow-2xl relative z-10 transform -rotate-2 border-4 border-white"
                src={userDetails.profileImage}
                alt={`${userDetails.fullName}'s profile`}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/F0EFEB/7048A8?text=KS" }}
              />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutSection = ({ userDetails }) => (
  <section id="about" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionTitle
        icon={Heart}
        title="Who I Am"
        subtitle="About Me"
      />
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <AnimatedSection className="text-lg text-gray-700 space-y-6">
          <p className="font-semibold text-gray-900 text-2xl mb-4">
            I am a <span className="text-purple-600">{userDetails.role}</span> based in {userDetails.location}.
          </p>
          <p>{userDetails.about}</p>
          <div className="border-l-4 border-purple-100 pl-4 italic text-gray-600 bg-purple-50 p-4 rounded-lg">
            <p>"I focus on building solutions that are both **powerful and elegant**, ensuring a fantastic user experience and robust backend infrastructure."</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200} className="p-6 bg-purple-50 rounded-xl shadow-lg border-t-4 border-purple-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Details</h3>
          <div className="space-y-4 text-gray-800">
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <Mail className="w-5 h-5 mr-3 text-purple-600" />
              <span className="font-medium">Email:</span> <a href={`mailto:${userDetails.email}`} className="ml-2 text-purple-600 hover:underline">{userDetails.email}</a>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <Phone className="w-5 h-5 mr-3 text-purple-600" />
              <span className="font-medium">Phone:</span> <span className="ml-2">{userDetails.phone}</span>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 mr-3 text-purple-600" />
              <span className="font-medium">Location:</span> <span className="ml-2">{userDetails.location}</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

const SkillsSection = ({ skills }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] || []), skill];
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-20 sm:py-32 bg-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Zap}
          title="Core Competencies"
          subtitle="My Technological Toolkit"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection
              key={category}
              delay={index * 150}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-t-8 border-purple-600"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 border-purple-100">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {groupedSkills[category].map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`px-4 py-2 text-sm rounded-full font-semibold transition duration-200 transform hover:scale-105
                                            ${skill.level.toLowerCase() === 'expert'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                  >
                    {skill.name}
                    {/* Optional: Add level as a badge inside the tag for 'Expert' */}
                    {skill.level.toLowerCase() === 'expert' && <span className="ml-2 text-xs opacity-80">(Expert)</span>}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Briefcase}
          title="Featured Work"
          subtitle="Recent Projects"
        />

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <AnimatedSection
              key={index}
              delay={index * 200}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/8A2BE2/FFFFFF?text=Project+Image" }}
                />
                <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">{project.title}</h3>
                <p className="text-gray-700">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-6 pt-4">
                  {project.projectLink && project.projectLink !== '#' && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 font-bold flex items-center transition duration-200"
                    >
                      View Project →
                    </a>
                  )}
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition duration-200"
                    >
                      <Github className="w-5 h-5 mr-1" /> Code
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-32 bg-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          icon={Briefcase}
          title="Professional Journey"
          subtitle="Work Experience"
        />

        <div className="mt-16 space-y-8">
          {experience.map((item, index) => (
            <AnimatedSection
              key={index}
              delay={index * 150}
              className="p-6 bg-white rounded-xl shadow-md border-4 border-purple-200 
                     hover:shadow-xl hover:border-pink-500 transition-all duration-300"
            >
              {/* Header with Briefcase Icon */}
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-pink-600" size={22} />
                <p className="text-sm font-semibold text-purple-600">
                  {item.startDate} – {item.endDate}
                </p>
              </div>

              <h4 className="text-2xl font-bold text-gray-900 mt-1">
                {item.position}
              </h4>

              <p className="text-lg text-gray-700">{item.company}</p>

              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const EducationSection = ({ education, certificates }) => {
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={GraduationCap}
          title="Learning & Credentials"
          subtitle="Education and Certifications"
        />

        {/* EDUCATION */}
        {education.length > 0 && (
          <div className="mb-16">
            <AnimatedSection className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 flex items-center pb-2 border-b-2 border-purple-100">
                <GraduationCap className="w-7 h-7 mr-2 text-purple-600" /> Education
              </h3>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {education.map((edu, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 100}
                  className="p-6 bg-purple-50 rounded-2xl shadow-md border-b-8 border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-sm font-semibold text-purple-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">{edu.degree}</h4>
                  <p className="text-lg text-gray-700">{edu.institution}</p>

                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-gray-600"><span className="font-bold">Field:</span> {edu.fieldOfStudy}</p>
                    <p className="text-gray-600"><span className="font-bold">Grade:</span> {edu.grade}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES */}
        {certificates.length > 0 && (
          <div>
            <AnimatedSection className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 flex items-center pb-2 border-b-2 border-purple-100">
                <Award className="w-7 h-7 mr-2 text-purple-600" /> Certifications
              </h3>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 100}
                  className="p-6 bg-white rounded-2xl shadow-xl border border-purple-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-4"
                  />

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-purple-600">{cert.issueDate}</p>
                    <h4 className="text-xl font-bold text-gray-900">{cert.title}</h4>
                    <p className="text-gray-700">{cert.issuer}</p>
                  </div>

                  {cert.certificateLink && cert.certificateLink !== "#" && (
                    <a
                      href={cert.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm font-bold text-purple-600 hover:text-purple-800 transition duration-200"
                    >
                      View Credential →
                    </a>
                  )}
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </section >
  );
};

const ContactSection = ({ userDetails, messageData, setMessageData, loading, handleSubmit }) => (
  <section id="contact" className="py-20 sm:py-32 bg-purple-900 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-2">
          Let's Connect
        </h2>
        <p className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Start a New Project Together
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <AnimatedSection className="p-8 bg-purple-800 rounded-2xl shadow-lg border-b-4 border-purple-400 hover:bg-purple-700 transition duration-300 transform hover:scale-[1.03]">
          <Mail className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Email Me</h4>
          <p className="text-purple-300">{userDetails.email}</p>
          <a
            href={`mailto:${userDetails.email}`}
            className="mt-3 inline-block text-purple-400 hover:text-white font-bold"
          >
            Send a Message →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={150} className="p-8 bg-purple-800 rounded-2xl shadow-lg border-b-4 border-purple-400 hover:bg-purple-700 transition duration-300 transform hover:scale-[1.03]">
          <Phone className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Call/WhatsApp</h4>
          <p className="text-purple-300">{userDetails.phone}</p>
          <a
            href={`tel:${userDetails.phone}`}
            className="mt-3 inline-block text-purple-400 hover:text-white font-bold"
          >
            Get in Touch →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={300} className="p-8 bg-purple-800 rounded-2xl shadow-lg border-b-4 border-purple-400 hover:bg-purple-700 transition duration-300 transform hover:scale-[1.03]">
          <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Location</h4>
          <p className="text-purple-300">{userDetails.location}</p>
          <p className="mt-3 text-purple-400">Let's grab a coffee!</p>
        </AnimatedSection>
      </div>

      {/* Contact Form (Styled for the purple dark theme) */}
      <AnimatedSection delay={450}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-purple-800/50 p-10 rounded-3xl shadow-2xl border border-purple-700">
          <h3 className='text-3xl font-bold text-white mb-6 text-center'>Send a Quick Inquiry</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-purple-200 mb-2 text-sm font-semibold">Your Name</label>
              <input
                required
                type="text"
                value={messageData.name}
                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-purple-900 text-white border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-purple-400"
              />
            </div>

            <div>
              <label className="block text-purple-200 mb-2 text-sm font-semibold">Your Email</label>
              <input
                required
                type="email"
                value={messageData.email}
                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-purple-900 text-white border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-purple-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-purple-200 mb-2 text-sm font-semibold">Message</label>
            <textarea
              rows="5"
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              placeholder="Write your message…"
              className="w-full px-4 py-3 bg-purple-900 text-white border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none placeholder-purple-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-full font-bold text-white text-lg shadow-xl transition duration-300 transform hover:scale-[1.01]"
          >
            {loading ? "....sending" : "Send Message"}
          </button>
        </form>
      </AnimatedSection>

    </div>
  </section>
);


const Footer = ({ socialLinks, hobbies, userDetails }) => (
  <footer className="bg-purple-950 text-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-purple-800 pb-8 mb-8">

        {/* About */}
        <div>
          <h5 className="text-xl font-bold text-purple-400 mb-4">{userDetails.fullName}</h5>
          <p className="text-purple-300 text-sm">
            <span className="font-semibold">{userDetails.role}</span>
            <br />
            {userDetails.about.substring(0, 100)}...
          </p>
        </div>

        {/* Hobbies */}
        <div>
          <h5 className="text-xl font-bold text-purple-400 mb-4">Interests</h5>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h, index) => (
              <span key={index} className="text-xs font-medium px-3 py-1 bg-purple-800 text-purple-300 rounded-full border border-purple-700">
                {h.hobby}
              </span>
            ))}
          </div>
        </div>

        {/* Social - Conditional Rendering */}
        <div>
          <h5 className="text-xl font-bold text-purple-400 mb-4">Connect</h5>
          <div className="flex space-x-6">
            {socialLinks.github && socialLinks.github !== '#' && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-white transition duration-200">
                <Github className="w-6 h-6" />
              </a>
            )}
            {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-white transition duration-200">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {socialLinks.twitter && socialLinks.twitter !== '#' && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-white transition duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {socialLinks.instagram && socialLinks.instagram !== '#' && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-white transition duration-200">
                <InstagramIcon className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>

      </div>

      <div className="text-center text-sm text-purple-500">
        &copy; {new Date().getFullYear()} {userDetails.fullName}. All Rights Reserved. | Designed with 💜 in React.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---
const PortfolioFive = ({ data, pageId }) => {

  const transformedData = transformPortfolioData({ data });

  const { userDetails, socialLinks, skills, projects, experience, education, certificates, hobbies, portfolioId } = transformedData;

  const [showScrollTop, setShowScrollTop] = useState(false);

  //message
  const [messageData, setMessageData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false)
  const { addMessage, addVisits } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await addMessage(messageData, portfolioId);

      if (res) {
        alert("Message sends successfully!");
        setMessageData({
          name: "",
          email: "",
          message: ""
        })
      }
    } catch (err) {
      console.error("Error submitting message:", err);

    } finally {
      setLoading(false);
    }
  };
  //message
  const visitLogged = useRef(false);

  const loadVisits = async () => {
    if (!pageId) return;
    if (visitLogged.current) return;
    visitLogged.current = true;

    await addVisits(pageId);
  };

  useEffect(() => {
    loadVisits();
  }, [pageId]);

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined' && window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!userDetails || !userDetails.fullName) {
    // Simple loading or error state if data is missing
    return <div className="p-8 text-center text-xl bg-gray-50 text-gray-800">Loading portfolio data...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-800">

      {/* 1. Hero/Intro */}
      <HeroSection userDetails={userDetails} socialLinks={socialLinks} />

      {/* 2. About Me (Detailed) */}
      <AboutSection userDetails={userDetails} />

      {/* 3. Skills */}
      <SkillsSection skills={skills} />

      {/* 4. Projects */}
      <ProjectsSection projects={projects} />

      {/* 5. Experience */}
      <ExperienceSection experience={experience} />

      {/* 6. Education & Certificates */}
      <EducationSection education={education} certificates={certificates} />

      {/* 7. Contact */}
      <ContactSection userDetails={userDetails} messageData={messageData} setMessageData={setMessageData} loading={loading} handleSubmit={handleSubmit} />

      {/* 8. Footer */}
      <Footer socialLinks={socialLinks} hobbies={hobbies} userDetails={userDetails} />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-xl transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } hover:bg-purple-700 transform hover:scale-105 active:scale-95 z-50`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default PortfolioFive;