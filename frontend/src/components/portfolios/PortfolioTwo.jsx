import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon, Send } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

// Define the accent color used throughout the component
const ACCENT_COLOR_CLASSES = 'text-yellow-400'; // For icons and highlights
const ACCENT_BG_CLASSES = 'bg-yellow-400 hover:bg-yellow-300'; // For buttons/badges
const ACCENT_RING_CLASSES = 'ring-yellow-400'; // For timeline/focus states

// --- Data Transformation Function (Unchanged) ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString ? dateString.substring(0, 10) : 'N/A';
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
      fullName: firstUserDetails.fullName || 'Arik',
      role: firstUserDetails.role || 'Web Designer & Developer',
      email: firstUserDetails.email || 'hello@example.com',
      phone: firstUserDetails.phone || '+123 456 7890',
      location: firstUserDetails.location || 'San Francisco, CA',
      profileImage: firstUserDetails.profileImage || "https://placehold.co/300x300/101010/8B8000?text=A",
      about: firstUserDetails.about || 'A passionate Web Designer & Developer focused on creating beautiful, functional, and user-centered digital experiences. I specialize in the MERN stack and clean code architecture.',
      resumeLink: firstUserDetails.resumeLink || '#',
    },
    socialLinks: {
      github: firstSocialLinks.github || '#',
      linkedin: firstSocialLinks.linkedin || '#',
      twitter: firstSocialLinks.twitter || '#',
      instagram: firstSocialLinks.instagram || '#',
    },
    skills: skills.map(skill => ({
      name: skill.name || 'N/A',
      level: skill.level || 'Intermediate',
      category: skill.category || 'Other',
    })).filter(s => s.name !== 'N/A'),
    projects: projects.map(project => ({
      title: project.title || 'N/A',
      description: project.description || 'No description provided for this project.',
      techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : ['Tech Stack N/A'],
      projectLink: project.projectLink || '#',
      githubLink: project.githubLink || '#',
      image: project.image || "https://placehold.co/600x400/3C3737/F0EFEB?text=Project",
    })).filter(p => p.title !== 'N/A'),
    experience: experience.map(exp => ({
      company: exp.company || 'N/A',
      position: exp.position || 'N/A',
      startDate: formatDate(exp.startDate) || 'N/A',
      endDate: formatDate(exp.endDate) || 'N/A',
      description: exp.description || 'No description provided.',
    })).filter(e => e.company !== 'N/A'),
    education: education.map(edu => ({
      institution: edu.institution || 'N/A',
      degree: edu.degree || 'N/A',
      fieldOfStudy: edu.fieldOfStudy || 'N/A',
      startDate: formatDate(edu.startDate) || 'N/A',
      endDate: formatDate(edu.endDate) || 'N/A',
      grade: edu.grade || 'N/A',
    })).filter(e => e.institution !== 'N/A'),
    certificates: certificates.map(cert => ({
      title: cert.title || 'N/A',
      issuer: cert.issuer || 'N/A',
      issueDate: formatDate(cert.issueDate) || 'N/A',
      certificateLink: cert.certificateLink || '#',
      image: cert.image || "https://placehold.co/600x400/3C3737/F0EFEB?text=Certificate"
    })).filter(c => c.title !== 'N/A'),
    hobbies: hobbies.map(h => ({ hobby: h.hobby || 'N/A' })).filter(h => h.hobby !== 'N/A'),
  };
};

// --- Custom Hooks (Unchanged) ---
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
        // Disconnect is cleaner than unobserve in the cleanup
        observer.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
};

// --- Helper Components (Themed) ---
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

// SectionTitle updated for dark theme
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <AnimatedSection className="mb-12 border-l-4 border-yellow-400 pl-4">
    <div className={`flex items-center ${ACCENT_COLOR_CLASSES} mb-1`}>
      {Icon && <Icon className="w-6 h-6 mr-2" />}
      <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400">{title}</h2>
    </div>
    <p className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{subtitle}</p>
  </AnimatedSection>
);

// NavLink updated for dark theme
const NavLink = ({ id, label }) => (
  <a
    href={`#${id}`}
    className="py-1 px-3 text-sm font-medium text-gray-400 hover:text-white transition duration-200 hover:bg-gray-800 rounded-full"
    onClick={() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    {label}
  </a>
);

// --- Section Components ---

const HeroSection = ({ userDetails, socialLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  const getInitials = (fullName) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0][0] + (parts[0].length > 1 ? parts[0][1] : 'S');
  };

  return (
    // BG-Black to match the image
    <div className="min-h-screen bg-black flex items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto z-10 w-full">
        {/* Header/Nav - Dark Theme */}
        <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-gray-900 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
            <div className="flex items-center">
              {/* Initials/Logo */}
              <span className={`text-lg font-bold text-white border border-gray-700 px-2 py-1 rounded-full ${ACCENT_COLOR_CLASSES}`}>
                {getInitials(userDetails.fullName)}
              </span>
              <span className="ml-2 text-sm text-gray-400 hidden sm:inline">{userDetails.fullName}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
            </nav>

            {/* Let's Talk Button - Matching the image */}
            <a href="#contact" className={`hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black ${ACCENT_BG_CLASSES} transition duration-300 hover:shadow-lg`}>
              Let's Talk
            </a>


            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-800 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </header>

        {/* Mobile Nav Drawer - Dark Theme */}
        <div className={`fixed inset-0 bg-gray-950 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden pt-20`}>
          <nav className="flex flex-col space-y-2 p-6">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-lg font-semibold text-white hover:text-yellow-400 p-3 rounded-lg hover:bg-gray-900 transition duration-200"
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="p-6 pt-4 border-t border-gray-800 mt-4">
            <h3 className="text-gray-400 mb-2">Social</h3>
            <div className="flex space-x-4">
              {/* Conditional Rendering for Mobile Nav */}
              {socialLinks.github && socialLinks.github !== '#' && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {socialLinks.twitter && socialLinks.twitter !== '#' && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {socialLinks.instagram && socialLinks.instagram !== '#' && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                  <InstagramIcon className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content - Centered and Dramatic Style from Image */}
        <div className="text-center">
          <AnimatedSection className="relative w-48 h-48 mx-auto mb-10 overflow-hidden rounded-full shadow-2xl shadow-yellow-900/50">
            {/* Profile Image - Dark/Dramatic Filter */}
            <img
              className="w-full h-full object-cover filter brightness-75 contrast-125"
              src={userDetails.profileImage}
              alt={`${userDetails.fullName}'s profile`}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/101010/8B8000?text=A" }}
            />
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-extrabold text-white leading-none tracking-tight">
              {/* Role split into two lines for dramatic effect */}
              <span className="block text-gray-300">{userDetails.role.split(' ')[0]}</span>
              <span className={`block ${ACCENT_COLOR_CLASSES}`}>{userDetails.role.split(' ').slice(1).join(' ') || 'Developer'}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200} className="mt-6">
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              {userDetails.about.substring(0, 100)}...
            </p>
          </AnimatedSection>


          <AnimatedSection delay={300} className="mt-6">
            <div>
              <div className="flex justify-center items-center mt-5 space-x-6">
                {socialLinks.github && socialLinks.github !== '#' && (
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.twitter && socialLinks.twitter !== '#' && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.instagram && socialLinks.instagram !== '#' && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
};

// AboutSection updated for dark theme
const AboutSection = ({ userDetails }) => (
  <section id="about" className="py-20 sm:py-32 bg-gray-950 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <AnimatedSection>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            A <span className={ACCENT_COLOR_CLASSES}>Dedicated</span> Professional in <span className={ACCENT_COLOR_CLASSES}>{userDetails.role}</span>.
          </h2>
          <p className="text-lg text-gray-400 mt-6">
            {userDetails.about}
          </p>

        </AnimatedSection>

        <AnimatedSection delay={200} className="text-lg text-gray-300 space-y-6">
          <div className="border-l-4 border-yellow-800 pl-4 italic text-gray-400">
            <p>"I believe in continuous learning and applying cutting-edge technologies to solve real-world problems. Let's build something exceptional together."</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 text-gray-300">
            <div className="flex items-center"><Mail className={`w-5 h-5 mr-2 ${ACCENT_COLOR_CLASSES}`} /> {userDetails.email}</div>
            <div className="flex items-center"><Phone className={`w-5 h-5 mr-2 ${ACCENT_COLOR_CLASSES}`} /> {userDetails.phone}</div>
            <div className="flex items-center col-span-2"><MapPin className={`w-5 h-5 mr-2 ${ACCENT_COLOR_CLASSES}`} /> {userDetails.location}</div>
          </div>
          <a
            href={userDetails.resumeLink}
            download
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-black ${ACCENT_BG_CLASSES} transition duration-300 w-full mt-6`}
          >
            Download Resume <Download className="ml-2 w-4 h-4" />
          </a>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

// SkillsSection updated for dark theme
const SkillsSection = ({ skills }) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] || []), skill];
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-20 sm:py-32 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Zap}
          title="Core Competencies"
          subtitle="My Technological Toolkit"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={category} delay={index * 150} className="bg-gray-900 p-8 rounded-xl shadow-xl hover:shadow-yellow-900/50 transition duration-300 transform hover:-translate-y-1 border-t-4 border-yellow-400">
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{category}</h3>
              <ul className="space-y-3">
                {groupedSkills[category].map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${skill.level.toLowerCase() === 'expert' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'
                      }`}>
                      {skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ProjectsSection updated for dark theme
const ProjectsSection = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 sm:py-32 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Briefcase}
          title="Selected Work" // Updated title to match image
          subtitle="Recent Projects"
        />

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 200} className="group bg-black rounded-xl overflow-hidden shadow-xl border border-gray-900 hover:border-yellow-400 transition duration-300 transform hover:scale-[1.01]">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/3C3737/F0EFEB?text=Project" }}
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition duration-500"></div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className={`text-xs font-semibold px-3 py-1 ${ACCENT_BG_CLASSES} text-black rounded-full`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4 pt-4">
                  {project.projectLink && project.projectLink !== '#' && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${ACCENT_COLOR_CLASSES} hover:text-white font-medium flex items-center transition duration-200`}
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white font-medium flex items-center transition duration-200"
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

// ExperienceSection updated for dark theme
const ExperienceSection = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-32 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Briefcase}
          title="Professional Journey"
          subtitle="Work Experience"
        />

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-900"></div>

          {experience.map((item, index) => (
            <AnimatedSection
              key={index}
              delay={index * 200}
              className="relative mb-10 flex w-full"
            >
              {/* Timeline node */}
              <div className={`absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 ${ACCENT_BG_CLASSES} rounded-full ring-8 ring-black`}>
                <Briefcase className="w-4 h-4 text-black" />
              </div>

              {/* Content always on the right */}
              <div className="w-full pl-16">
                <span className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                  {item.startDate} - {item.endDate}
                </span>

                <h4 className="text-xl font-bold text-white mt-1">
                  {item.position}
                </h4>

                <p className="text-lg text-gray-300">{item.company}</p>

                <p className="text-gray-500 mt-2 text-sm">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>

          ))}
        </div>
      </div>
    </section>
  );
};

// EducationSection updated for dark theme
const EducationSection = ({ education, certificates }) => {
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-32 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={GraduationCap}
          title="Learning & Credentials"
          subtitle="Education and Certifications"
        />

        <div className="space-y-20">

          {/* EDUCATION SECTION */}
          {education.length > 0 && (
            <div className="space-y-8">
              <AnimatedSection>
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <GraduationCap className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} /> Education
                </h3>
              </AnimatedSection>

              {/* GRID LAYOUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {education.map((edu, index) => (
                  <AnimatedSection
                    key={index}
                    delay={index * 120}
                    className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800 hover:shadow-xl hover:border-yellow-400 transition-all duration-300"
                  >
                    <p className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <h4 className="text-xl font-bold text-white mt-1">{edu.degree}</h4>
                    <p className="text-lg text-gray-300">{edu.institution}</p>
                    <p className="text-gray-500 mt-2">Field: {edu.fieldOfStudy}</p>
                    <p className="text-gray-500">Grade: {edu.grade}</p>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES SECTION */}
          {certificates.length > 0 && (
            <div className="space-y-8">
              <AnimatedSection>
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Award className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} /> Certificates
                </h3>
              </AnimatedSection>

              {/* GRID LAYOUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert, index) => (
                  <AnimatedSection
                    key={index}
                    delay={index * 120}
                    className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-800 hover:shadow-xl hover:border-yellow-400 transition-all duration-300"
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full object-cover rounded-lg border border-gray-800 shadow-sm mb-4 h-48"
                    />

                    <p className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>{cert.issueDate}</p>
                    <h4 className="text-xl font-bold text-white mt-1">{cert.title}</h4>
                    <p className="text-lg text-gray-300">{cert.issuer}</p>

                    {cert.certificateLink && cert.certificateLink !== "#" && (
                      <a
                        href={cert.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block mt-3 text-sm font-medium ${ACCENT_COLOR_CLASSES} hover:text-white transition duration-200`}
                      >
                        Link →
                      </a>
                    )}
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>

  );
};

// ContactSection updated for dark theme
const ContactSection = ({ userDetails, messageData, setMessageData, loading, handleSubmit }) => (
  <section id="contact" className="py-20 sm:py-32 bg-black px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-2">
          Get In Touch
        </h2>
        <p className={`text-4xl sm:text-5xl font-extrabold leading-tight ${ACCENT_COLOR_CLASSES}`}>
          Let's Build Something Together
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <AnimatedSection className="p-6 bg-gray-950 rounded-xl shadow-lg hover:bg-gray-900 transition duration-300 transform hover:scale-[1.03] border border-gray-900 hover:border-yellow-400">
          <Mail className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className="text-xl font-bold mb-2">Email Me</h4>
          <p className="text-gray-400">{userDetails.email}</p>
          <a
            href={`mailto:${userDetails.email}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-white font-medium`}
          >
            Send a Message →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={150} className="p-6 bg-gray-950 rounded-xl shadow-lg hover:bg-gray-900 transition duration-300 transform hover:scale-[1.03] border border-gray-900 hover:border-yellow-400">
          <Phone className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className="text-xl font-bold mb-2">Call/WhatsApp</h4>
          <p className="text-gray-400">{userDetails.phone}</p>
          <a
            href={`tel:${userDetails.phone}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-white font-medium`}
          >
            Get in Touch →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={300} className="p-6 bg-gray-950 rounded-xl shadow-lg hover:bg-gray-900 transition duration-300 transform hover:scale-[1.03] border border-gray-900 hover:border-yellow-400">
          <MapPin className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className="text-xl font-bold mb-2">Location</h4>
          <p className="text-gray-400">{userDetails.location}</p>
          <p className="mt-3 text-gray-500">Timezone: IST (UTC+5:30)</p>
        </AnimatedSection>
      </div>

      {/* Contact Form */}
      <AnimatedSection delay={450}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-950 p-8 rounded-2xl shadow-xl border border-gray-900">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Your Name</label>
              <input

                required
                type="text"
                value={messageData.name}
                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Your Email</label>
              <input
                required
                type="email"
                value={messageData.email}
                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-400 mb-2 text-sm">Message</label>
            <textarea
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              rows="5"
              placeholder="Write your message…"
              className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 ${ACCENT_BG_CLASSES} rounded-lg font-semibold text-black shadow-lg transition duration-300 flex items-center justify-center`}
          >
            {loading ? "....sending" : "Send Message"} <Send className="w-5 h-5 ml-2" />
          </button>
        </form>
      </AnimatedSection>

    </div>
  </section>
);


// Footer updated for dark theme
const Footer = ({ socialLinks, hobbies, userDetails }) => (
  <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-900 pb-8 mb-8">

        {/* About */}
        <div>
          <h5 className={`text-xl font-bold ${ACCENT_COLOR_CLASSES} mb-4`}>{userDetails.fullName}</h5>
          <p className="text-gray-500 text-sm">{userDetails.role} </p>
          <div className="mt-4 flex space-x-4">
            <a
              href={userDetails.resumeLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center text-sm font-medium ${ACCENT_COLOR_CLASSES} hover:text-white transition duration-300`}
            >
              <Download className="w-4 h-4 mr-1" /> Resume
            </a>
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <h5 className={`text-xl font-bold ${ACCENT_COLOR_CLASSES} mb-4`}>Interests</h5>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h, index) => (
              <span key={index} className="text-xs font-medium px-3 py-1 bg-gray-900 text-gray-400 rounded-full border border-gray-800">
                {h.hobby}
              </span>
            ))}
          </div>
        </div>

        {/* Social - Conditional Rendering */}
        <div>
          <h5 className={`text-xl font-bold ${ACCENT_COLOR_CLASSES} mb-4`}>Connect</h5>
          <div className="flex space-x-6">
            {socialLinks.github && socialLinks.github !== '#' && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                <Github className="w-6 h-6" />
              </a>
            )}
            {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {socialLinks.twitter && socialLinks.twitter !== '#' && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {socialLinks.instagram && socialLinks.instagram !== '#' && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200">
                <InstagramIcon className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>

      </div>

      <div className="text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {userDetails.fullName}. All Rights Reserved. Crafted with React & Tailwind CSS.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---
const PortfolioTwo = ({ data, pageId }) => {
  // console.log(data); // Kept for debugging if needed

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
  

  // Handle scroll to show/hide the back-to-top button
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
    return <div className="p-8 text-center text-xl bg-black text-white min-h-screen">Loading portfolio data...</div>;
  }

  return (
    // Global font/color settings for the dark theme
    <div className="font-sans antialiased text-white bg-black min-h-screen">

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
        className={`fixed bottom-6 right-6 p-3 ${ACCENT_BG_CLASSES} text-black rounded-full shadow-lg transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } hover:shadow-yellow-400/50 transform hover:scale-105 active:scale-95 z-50`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default PortfolioTwo;