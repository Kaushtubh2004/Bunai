import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon, Globe } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

// Define the accent and theme colors
const ACCENT_COLOR_CLASSES = 'text-cyan-400';
const ACCENT_BG_CLASSES = 'bg-cyan-500 hover:bg-cyan-600';
const DARK_BG_CLASSES = 'bg-gray-950';
const LIGHT_BG_CLASSES = 'bg-gray-900';
const PRIMARY_TEXT_CLASSES = 'text-white';
const SECONDARY_TEXT_CLASSES = 'text-gray-400';

// --- Data Transformation Function (Unchanged) ---
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
      fullName: firstUserDetails.fullName || 'Jenna Ortega',
      role: firstUserDetails.role || 'UI/UX DESIGNER',
      email: firstUserDetails.email || 'jenna@design.com',
      phone: firstUserDetails.phone || '+1 456 7890',
      location: firstUserDetails.location || 'San Jose, CA',
      profileImage: firstUserDetails.profileImage || "https://placehold.co/300x400/101010/40E0D0?text=J",
      about: firstUserDetails.about || 'Yet he tired any for travelling assistance indulgence unpleasing, Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment.',
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
      description: project.description || 'No description provided.',
      techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : ['Tech Stack N/A'],
      projectLink: project.projectLink || '#',
      githubLink: project.githubLink || '#',
      image: project.image || "https://placehold.co/600x400/1C1C1C/40E0D0?text=Project",
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
      image: cert.image || "https://placehold.co/600x400/1C1C1C/40E0D0?text=Cert"
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

// Section Title updated for the dark theme and minimal style
const SectionTitle = ({ title, subtitle }) => (
  <AnimatedSection className="mb-12">
    <h2 className={`text-sm font-semibold tracking-widest uppercase ${SECONDARY_TEXT_CLASSES} mb-1`}>{title}</h2>
    <p className={`text-3xl sm:text-4xl font-extrabold ${PRIMARY_TEXT_CLASSES} leading-tight`}>{subtitle}</p>
  </AnimatedSection>
);

// NavLink updated for dark theme header
const NavLink = ({ id, label }) => (
  <a
    href={`#${id}`}
    className={`py-1 px-3 text-sm font-medium ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} transition duration-200`}
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
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Services' }, // Skills renamed to Services to match the image structure
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    // Main container uses deep dark background
    <div className={`min-h-screen ${DARK_BG_CLASSES} flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>

      {/* Background elements to mimic the subtle glow/dots */}
      <div className={`absolute inset-0 z-0 opacity-10`} style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(64,224,208, 0.2) 0%, transparent 80%)' }}></div>
      <div className={`absolute inset-0 z-0 opacity-10`} style={{ backgroundImage: 'radial-gradient(circle at 80% 90%, rgba(64,224,208, 0.2) 0%, transparent 80%)' }}></div>


      {/* Header/Nav - Fixed at top, dark theme */}
      <header className={`fixed top-0 left-0 right-0 ${DARK_BG_CLASSES} border-b border-gray-800 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
          <div className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES}`}>
            {userDetails.fullName.split(' ')[0]}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
          </nav>

          {/* Let's Talk Button - Cyan accented */}
          <a href="#contact" className={`hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full ${ACCENT_BG_CLASSES} text-gray-900 transition duration-300`}>
            LET'S TALK
          </a>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full hover:${LIGHT_BG_CLASSES} transition duration-200`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className={`w-6 h-6 ${PRIMARY_TEXT_CLASSES}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 ${LIGHT_BG_CLASSES} z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden pt-20`}>
        <nav className="flex flex-col space-y-2 p-6">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-lg font-semibold ${PRIMARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} p-3 rounded-lg hover:bg-gray-800 transition duration-200`}
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

      {/* Hero Content - Split with Image on Right, Text on Left */}
      <div className="max-w-7xl mx-auto z-10 w-full flex-grow flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <AnimatedSection delay={100}>
              <p className={`text-lg font-medium ${ACCENT_COLOR_CLASSES} tracking-widest uppercase`}>
                {userDetails.fullName.toUpperCase()}
              </p>
              <h1 className={`text-6xl sm:text-7xl font-extrabold ${PRIMARY_TEXT_CLASSES} leading-none`}>
                HAY! I'M {userDetails.fullName.split(' ')[0].toUpperCase()}
                <span className={`block ${ACCENT_COLOR_CLASSES} mt-2`}>I'M A {userDetails.role}</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <p className={`text-xl ${SECONDARY_TEXT_CLASSES} max-w-lg`}>
                {userDetails.about}
              </p>
            </AnimatedSection>

            {/* Action Buttons */}
            <AnimatedSection delay={500} className="flex space-x-4 items-center">
              <a
                href="#contact"
                className={`flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-gray-900 ${ACCENT_BG_CLASSES} transition duration-300 transform hover:scale-[1.02] active:scale-95`}
              >
                GET IN TOUCH <Globe className="ml-2 w-4 h-4" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border border-gray-700 ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} transition duration-300`}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border border-gray-700 ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} transition duration-300`}
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
            </AnimatedSection>

          </div>

          {/* Right Column: Image with unique geometry/effects */}
          <div className="hidden md:flex justify-center relative h-[500px]">
            <AnimatedSection delay={200} className="w-full h-full relative z-10">
              <img
                className="w-full h-full object-cover rounded-md"
                src={userDetails.profileImage}
                alt={`${userDetails.fullName}'s profile`}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/101010/40E0D0?text=J" }}
              />
              {/* Abstract geometry element (mimic circles) */}
              <div className="absolute w-20 h-20 border-4 border-cyan-400 rounded-full animate-pulse top-10 left-10 opacity-30"></div>
              <div className="absolute w-12 h-12 border-2 border-cyan-400 rounded-full bottom-20 right-20 opacity-50"></div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutSection = ({ userDetails }) => (
  <section id="about" className={`py-20 sm:py-32 ${LIGHT_BG_CLASSES} px-4 sm:px-6 lg:px-8`}>
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left Column: Image with Geometry */}
        <div className="relative h-[400px]">
          <AnimatedSection delay={100} className="w-full h-full relative z-10">
            <img
              className="w-full h-full object-cover rounded-md"
              src={userDetails.profileImage}
              alt={`${userDetails.fullName}'s profile`}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/101010/40E0D0?text=J" }}
            />
            {/* Abstract geometry element (mimic circles) */}
            <div className="absolute w-32 h-32 border-4 border-cyan-400 rounded-full -top-10 -left-10 opacity-30"></div>
          </AnimatedSection>
        </div>

        {/* Right Column: About Text and Stats */}
        <AnimatedSection delay={200} className="space-y-8">
          <h2 className={`text-sm font-semibold tracking-widest uppercase ${SECONDARY_TEXT_CLASSES}`}>
            ABOUT ME
          </h2>
          <h3 className={`text-4xl font-extrabold ${PRIMARY_TEXT_CLASSES} leading-tight`}>
            I am <span className={ACCENT_COLOR_CLASSES}>{userDetails.role}</span>
          </h3>

          <p className={`text-lg ${SECONDARY_TEXT_CLASSES}`}>
            {userDetails.about}
          </p>

          <a
            href="#contact"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-gray-900 ${ACCENT_BG_CLASSES} transition duration-300 transform hover:scale-[1.02] active:scale-95`}
          >
            GET IN TOUCH
          </a>

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

  return (
    <section id="skills" className={`py-20 sm:py-32 ${DARK_BG_CLASSES} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="SKILLS"
          subtitle="TECHNOLOGIES AND EXPERTISE"
        />

        {/* Cards for each category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection
              key={index}
              delay={index * 150}
              className={`${LIGHT_BG_CLASSES} p-8 rounded-xl shadow-xl hover:shadow-cyan-400/20 transition duration-300 transform hover:-translate-y-1 border border-gray-800`}
            >
              {/* Category Heading */}
              <h3 className={`text-2xl font-bold ${PRIMARY_TEXT_CLASSES} mb-4`}>
                {category}
              </h3>

              {/* Skills inside category */}
              <div className="space-y-4">
                {groupedSkills[category].map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="p-4 rounded-lg bg-gray-900 border border-gray-800"
                  >
                    <p className={`text-lg font-semibold ${ACCENT_COLOR_CLASSES}`}>
                      {skill.name}
                    </p>
                    <p className={`${SECONDARY_TEXT_CLASSES} text-sm mt-1`}>
                      Level: {skill.level}
                    </p>
                  </div>
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
    <section id="projects" className={`py-20 sm:py-32 ${LIGHT_BG_CLASSES} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="MY WORK"
          subtitle="RECENT PROJECT"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 200} className={`group ${DARK_BG_CLASSES} rounded-xl overflow-hidden shadow-xl hover:shadow-cyan-400/20 transition duration-300 transform hover:scale-[1.01] border border-gray-800`}>
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1C1C1C/40E0D0?text=Project" }}
                />
                {/* Overlay circle like in the image */}
                <div className={`absolute bottom-4 right-4 w-10 h-10 ${ACCENT_BG_CLASSES} rounded-full flex items-center justify-center text-gray-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  →
                </div>

              </div>
              <div className="p-6 space-y-3">
                <p className={`text-sm font-semibold ${SECONDARY_TEXT_CLASSES}`}>{project.techStack.slice(0, 2).join(', ')}</p>
                <h3 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES}`}>{project.title}</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs font-semibold px-2 py-0.5 bg-gray-800 text-gray-500 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ExperienceSection: Standard timeline adapted to dark theme
const ExperienceSection = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className={`py-20 sm:py-32 ${DARK_BG_CLASSES} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="CAREER HISTORY"
          subtitle="Work Experience"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-800"></div>

          {experience.map((item, index) => (
            <AnimatedSection
              key={index}
              delay={index * 200}
              className="relative mb-10 flex w-full"
            >
              {/* Timeline node */}
              <div className={`absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 ${ACCENT_BG_CLASSES} rounded-full ring-8 ring-gray-950`}>
                <Briefcase className="w-4 h-4 text-gray-900" />
              </div>

              {/* Content always on the right */}
              <div className={`w-full pl-16 p-6 ${LIGHT_BG_CLASSES} rounded-lg shadow-xl hover:shadow-cyan-400/20 transition duration-300 border border-gray-800`}>
                <span className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                  {item.startDate} - {item.endDate}
                </span>

                <h4 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mt-1`}>
                  {item.position}
                </h4>

                <p className={`text-lg ${SECONDARY_TEXT_CLASSES}`}>{item.company}</p>

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

// EducationSection: Combined Education and Certificates
const EducationSection = ({ education, certificates }) => {
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section
      id="education"
      className={`py-20 sm:py-32 ${LIGHT_BG_CLASSES} px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="ACHIEVEMENTS" subtitle="Education and Certifications" />

        {/* --------------------- EDUCATION --------------------- */}
        {education.length > 0 && (
          <div className="mb-20">
            <AnimatedSection>
              <h3
                className={`text-3xl font-bold ${PRIMARY_TEXT_CLASSES} mb-10 flex items-center`}
              >
                <GraduationCap className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} />{" "}
                Education
              </h3>
            </AnimatedSection>

            {/* Education Grid: Responsive Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {education.map((edu, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 150}
                  className={`${DARK_BG_CLASSES} p-6 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:border-cyan-400 border border-gray-800`}
                >
                  <p className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  <h4 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mt-1`}>
                    {edu.degree}
                  </h4>
                  <p className={`text-lg ${SECONDARY_TEXT_CLASSES}`}>
                    {edu.institution}
                  </p>
                  <p className="text-gray-500 mt-2">Field: {edu.fieldOfStudy}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* --------------------- CERTIFICATES --------------------- */}
        {certificates.length > 0 && (
          <div>
            <AnimatedSection>
              <h3
                className={`text-3xl font-bold ${PRIMARY_TEXT_CLASSES} mb-10 flex items-center`}
              >
                <Award className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} /> Certificates
              </h3>
            </AnimatedSection>

            {/* Certificates Grid: Responsive Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 150}
                  className={`${DARK_BG_CLASSES} p-6 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:border-cyan-400 border border-gray-800`}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-32 object-cover rounded-lg border border-gray-800 shadow-sm mb-4"
                  />

                  <p className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                    {cert.issueDate}
                  </p>
                  <h4 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mt-1`}>
                    {cert.title}
                  </h4>
                  <p className={`text-lg ${SECONDARY_TEXT_CLASSES}`}>{cert.issuer}</p>

                  {cert.certificateLink && cert.certificateLink !== "#" && (
                    <a
                      href={cert.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium ${ACCENT_COLOR_CLASSES} hover:text-white transition duration-200 mt-3 inline-block`}
                    >
                      View Certificate →
                    </a>
                  )}
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ContactSection: Cleaned up for dark theme
const ContactSection = ({ userDetails, messageData, setMessageData, loading, handleSubmit }) => (
  <section id="contact" className={`py-20 sm:py-32 ${DARK_BG_CLASSES} px-4 sm:px-6 lg:px-8`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className={`text-sm font-semibold tracking-widest uppercase ${ACCENT_COLOR_CLASSES} mb-2`}>
          Get In Touch
        </h2>
        <p className={`text-4xl sm:text-5xl font-extrabold ${PRIMARY_TEXT_CLASSES} leading-tight`}>
          Let's Connect
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <AnimatedSection className={`${LIGHT_BG_CLASSES} p-6 rounded-xl shadow-lg hover:shadow-cyan-400/20 transition duration-300 transform hover:scale-[1.03] border border-gray-800`}>
          <Mail className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Email Me</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.email}</p>
          <a
            href={`mailto:${userDetails.email}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-white font-medium`}
          >
            Send a Message →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={150} className={`${LIGHT_BG_CLASSES} p-6 rounded-xl shadow-lg hover:shadow-cyan-400/20 transition duration-300 transform hover:scale-[1.03] border border-gray-800`}>
          <Phone className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Call/WhatsApp</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.phone}</p>
          <a
            href={`tel:${userDetails.phone}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-white font-medium`}
          >
            Get in Touch →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={300} className={`${LIGHT_BG_CLASSES} p-6 rounded-xl shadow-lg hover:shadow-cyan-400/20 transition duration-300 transform hover:scale-[1.03] border border-gray-800`}>
          <MapPin className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Location</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.location}</p>
          <p className={`mt-3 ${ACCENT_COLOR_CLASSES}`}>Timezone: IST (UTC+5:30)</p>
        </AnimatedSection>
      </div>

      {/* Contact Form */}
      <AnimatedSection delay={450}>
        <form onSubmit={handleSubmit} className={`max-w-3xl mx-auto ${LIGHT_BG_CLASSES} p-8 rounded-2xl shadow-xl border border-gray-700`}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Your Name</label>
              <input
                required
                type="text"
                value={messageData.name}
                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 ${DARK_BG_CLASSES} ${PRIMARY_TEXT_CLASSES} border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Your Email</label>
              <input
                required
                type="email"
                value={messageData.email}
                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                className={`w-full px-4 py-3 ${DARK_BG_CLASSES} ${PRIMARY_TEXT_CLASSES} border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Message</label>
            <textarea
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              rows="5"
              placeholder="Write your message…"
              className={`w-full px-4 py-3 ${DARK_BG_CLASSES} ${PRIMARY_TEXT_CLASSES} border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none`}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 ${ACCENT_BG_CLASSES} hover:bg-cyan-400 rounded-lg font-semibold text-gray-900 shadow-lg transition duration-300`}
          >
            {loading ? "....sending" : "Send Message"}
          </button>
        </form>
      </AnimatedSection>

    </div>
  </section>
);


const Footer = ({ socialLinks, hobbies, userDetails }) => (
  <footer className={`${DARK_BG_CLASSES} text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800`}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8 mb-8">

        {/* About */}
        <div>
          <h5 className={`text-xl font-bold ${ACCENT_COLOR_CLASSES} mb-4`}>{userDetails.fullName.split(' ')[0]}</h5>
          <p className={`${SECONDARY_TEXT_CLASSES} text-sm`}>{userDetails.role} </p>
        </div>

        {/* Hobbies */}
        <div>
          <h5 className={`text-xl font-bold ${ACCENT_COLOR_CLASSES} mb-4`}>Interests</h5>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h, index) => (
              <span key={index} className="text-xs font-medium px-3 py-1 bg-gray-800 text-gray-400 rounded-full border border-gray-700">
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

      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {userDetails.fullName}. All Rights Reserved.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---
const PortfolioFour = ({ data, pageId }) => {

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
    // Simple loading or error state if data is missing
    return <div className={`p-8 text-center text-xl ${DARK_BG_CLASSES} ${PRIMARY_TEXT_CLASSES}`}>Loading portfolio data...</div>;
  }

  return (
    <div className={`font-sans antialiased ${PRIMARY_TEXT_CLASSES} ${DARK_BG_CLASSES} min-h-screen`}>

      {/* 1. Hero/Intro */}
      <HeroSection userDetails={userDetails} socialLinks={socialLinks} />

      {/* 2. About Me (Detailed with stats) */}
      <AboutSection userDetails={userDetails} />

      {/* 3. Projects */}
      <ProjectsSection projects={projects} />

      {/* 4. Skills (Renamed to Services in the UI) */}
      <SkillsSection skills={skills} />

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
        className={`fixed bottom-6 right-6 p-3 ${ACCENT_BG_CLASSES} text-gray-900 rounded-full shadow-lg transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } hover:shadow-cyan-400/50 transform hover:scale-105 active:scale-95 z-50`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default PortfolioFour;