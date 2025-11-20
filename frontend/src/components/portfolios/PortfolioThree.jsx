import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon, Send, BookOpen, Layers, Tablet, Search, Users } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

// Define the accent color used throughout the component (Pink/Rose to match the fresh theme)
const ACCENT_COLOR_CLASSES = 'text-rose-500';
const ACCENT_BG_CLASSES = 'bg-rose-500 hover:bg-rose-600';
const PRIMARY_TEXT_CLASSES = 'text-gray-900';
const SECONDARY_TEXT_CLASSES = 'text-gray-600';
const CARD_BG_CLASSES = 'bg-white shadow-lg hover:shadow-xl transition duration-300';

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
      fullName: firstUserDetails.fullName || 'Jone Lee',
      role: firstUserDetails.role || 'Professional Coder',
      email: firstUserDetails.email || 'hello@inbio.com',
      phone: firstUserDetails.phone || '+123 456 7890',
      location: firstUserDetails.location || 'New York, USA',
      profileImage: firstUserDetails.profileImage || "https://placehold.co/300x400/F0EFEB/3C3737?text=JL",
      about: firstUserDetails.about || 'I use animation as a third dimension by which to simplify experiences and building through each and every interaction. I’m not adding motion just to spruce things up, but using it in ways that are significant and useful.',
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
      image: project.image || "https://placehold.co/600x400/D4D4D4/3C3737?text=Project",
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
      image: cert.image || "https://placehold.co/600x400/D4D4D4/3C3737?text=Cert"
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

// Title updated for the light theme, simple divider look
const SectionTitle = ({ title, subtitle, className = "" }) => (
  <AnimatedSection className={`text-center mb-16 ${className}`}>
    <p className={`${ACCENT_COLOR_CLASSES} font-medium text-sm tracking-widest uppercase mb-2`}>{title}</p>
    <h2 className={`text-4xl font-extrabold ${PRIMARY_TEXT_CLASSES}`}>{subtitle}</h2>
  </AnimatedSection>
);

// NavLink updated to match the light theme header
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

// Icon mapping for dummy service boxes in Hero/About sections
const serviceIcons = {
  'Business Strategy': Layers,
  'App Development': Tablet,
  'Mobile App': Tablet,
  'SEO Optimisation': Search,
  'UX Consulting': Users,
  'Other': BookOpen
};

// Reusable Service Box component for the "What I Do" section
const ServiceBox = ({ title, description, iconName, delay }) => {
  const Icon = serviceIcons[iconName] || BookOpen;
  return (
    <AnimatedSection delay={delay} className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100 hover:border-rose-200`}>
      <Icon className={`w-8 h-8 mb-4 ${ACCENT_COLOR_CLASSES}`} />
      <h3 className={`text-xl font-bold mb-3 ${PRIMARY_TEXT_CLASSES}`}>{title}</h3>
      <p className={`${SECONDARY_TEXT_CLASSES} text-sm`}>{description}</p>
    </AnimatedSection>
  );
};


// --- Section Components ---

const HeroSection = ({ userDetails, socialLinks, skills }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Resume' },
    { id: 'contact', label: 'Contacts' },
  ];

  // Dummy skills for the "Best Skill On" section in the hero
  const bestSkills = [
    { icon: Linkedin, name: 'LinkedIn', link: socialLinks.linkedin },
    { icon: Github, name: 'Github', link: socialLinks.github },
    { icon: Twitter, name: 'Twitter', link: socialLinks.twitter },
  ].filter(s => s.link && s.link !== '#').slice(0, 3);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Header/Nav - Fixed at top, matches image style */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
          <div className="text-xl font-extrabold text-gray-900">MYBIO</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
          </nav>

          {/* Buy Now Button */}
          <a href={userDetails.resumeLink} target="_blank" rel="noopener noreferrer" className={`hidden md:inline-flex items-center px-4 py-2 border border-rose-500 text-sm font-medium rounded-full ${ACCENT_COLOR_CLASSES} hover:bg-rose-50 transition duration-300`}>
            <Download className="w-4 h-4 mr-1" /> RESUME
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className={`w-6 h-6 ${PRIMARY_TEXT_CLASSES}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
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
              className={`text-lg font-semibold ${PRIMARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} p-3 rounded-lg hover:bg-gray-100 transition duration-200`}
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

      {/* Hero Content - Split Layout */}
      <div className="max-w-7xl mx-auto flex-grow flex items-center pt-10 pb-20">
        <div className="grid md:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column (Text & Social) */}
          <div className="md:col-span-7 space-y-8">
            <AnimatedSection delay={100} className="space-y-4">
              <p className={`${SECONDARY_TEXT_CLASSES} font-medium tracking-widest uppercase text-sm`}>
                WELCOME TO MY WORLD
              </p>
              <h1 className={`text-6xl font-extrabold ${PRIMARY_TEXT_CLASSES} leading-tight`}>
                Hi, I'm <span className={ACCENT_COLOR_CLASSES}>{userDetails.fullName}</span>
                <span className="block text-5xl font-light">a {userDetails.role}.</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <p className={`${SECONDARY_TEXT_CLASSES} max-w-lg`}>
                {userDetails.about}
              </p>
            </AnimatedSection>

            {/* Social & Best Skill Section */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <AnimatedSection delay={500}>
                <h3 className={`${SECONDARY_TEXT_CLASSES} uppercase font-medium text-sm mb-4`}>FIND WITH ME</h3>
                <div className="flex space-x-3">
                  {Object.entries(socialLinks).map(([platform, link], index) => {
                    let Icon = null;
                    if (link === '#') return null;
                    if (platform === 'github') Icon = Github;
                    if (platform === 'linkedin') Icon = Linkedin;
                    if (platform === 'twitter') Icon = Twitter;
                    if (platform === 'instagram') Icon = InstagramIcon;

                    return Icon ? (
                      <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-md border border-gray-200 hover:border-rose-500 ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} transition duration-200`}>
                        <Icon className="w-5 h-5" />
                      </a>
                    ) : null;
                  })}
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Right Column (Image) - Rounded container to match the image */}
          <div className="md:col-span-5 hidden md:block">
            <AnimatedSection delay={200} className="w-full h-[550px] overflow-hidden rounded-xl shadow-2xl shadow-gray-300/50">
              <img
                className="w-full h-full object-cover"
                src={userDetails.profileImage}
                alt={`${userDetails.fullName}'s profile`}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/F0EFEB/3C3737?text=JL" }}
              />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// "What I Do" section to mirror the image layout
const AboutSection = ({ userDetails }) => (
  <section id="about" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      {/* Header for the section */}
      <SectionTitle
        title="WHO I AM"
        subtitle="About Me"
        className="mb-20" // Increased margin to separate title from content
      />

      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Left Column: Detailed About Text */}
        <AnimatedSection>
          <h3 className={`text-3xl font-bold ${PRIMARY_TEXT_CLASSES} mb-4`}>
            {/* Highlights the role within the title */}
            A passionate <span className={ACCENT_COLOR_CLASSES}>{userDetails.role}</span>.
          </h3>
          <div className={`${SECONDARY_TEXT_CLASSES} text-lg space-y-6`}>
            <p>{userDetails.about}</p>
          </div>
        </AnimatedSection>

        {/* Right Column: Key Contact Details (Clean List) */}
        <AnimatedSection delay={200} className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100`}>
          <h3 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mb-6 border-b border-gray-200 pb-3`}>
            Quick Contact Info
          </h3>
          <div className="space-y-5 text-lg">
            <div className="flex items-center">
              <Mail className={`w-6 h-6 mr-3 ${ACCENT_COLOR_CLASSES}`} />
              <span className={PRIMARY_TEXT_CLASSES}>Email:</span>
              <a href={`mailto:${userDetails.email}`} className={`ml-2 ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES}`}>{userDetails.email}</a>
            </div>
            <div className="flex items-center">
              <Phone className={`w-6 h-6 mr-3 ${ACCENT_COLOR_CLASSES}`} />
              <span className={PRIMARY_TEXT_CLASSES}>Phone:</span>
              <a href={`tel:${userDetails.phone}`} className={`ml-2 ${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES}`}>{userDetails.phone}</a>
            </div>
            <div className="flex items-center">
              <MapPin className={`w-6 h-6 mr-3 ${ACCENT_COLOR_CLASSES}`} />
              <span className={PRIMARY_TEXT_CLASSES}>Location:</span>
              <span className={`ml-2 ${SECONDARY_TEXT_CLASSES}`}>{userDetails.location}</span>
            </div>
            {/* Optional Call to Action */}
            <a
              href="#contact"
              className={`mt-6 block w-full text-center py-3 border border-rose-500 text-sm font-medium rounded-full ${ACCENT_COLOR_CLASSES} hover:bg-rose-50 transition duration-300`}
            >
              Start a Project
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Kept the closing text outside the grid for theme consistency */}
      <p className="text-center mt-20 text-sm text-gray-500">
        <span className={`${ACCENT_COLOR_CLASSES} mr-1`}>VISIT MY PORTFOLIO</span> AND KEEP YOUR FEEDBACK
      </p>
    </div>
  </section>
);

// SkillsSection updated for light theme
const SkillsSection = ({ skills }) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] || []), skill];
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="MY TECHNICAL STACK"
          subtitle="Skills"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={category} delay={index * 150} className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100`}>
              <h3 className={`text-2xl font-bold ${PRIMARY_TEXT_CLASSES} mb-4 border-b border-gray-100 pb-2`}>{category}</h3>
              <ul className="space-y-3">
                {groupedSkills[category].map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className={`flex justify-between items-center ${SECONDARY_TEXT_CLASSES}`}
                  >
                    <span className={`font-medium ${PRIMARY_TEXT_CLASSES}`}>{skill.name}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${skill.level.toLowerCase() === 'expert' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-700'
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

// ProjectsSection updated for light theme (My Portfolio)
const ProjectsSection = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 sm:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="VISIT MY Recent Work"
          subtitle="My Project"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 200} className={`group ${CARD_BG_CLASSES} rounded-xl overflow-hidden border border-gray-100`}>
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/D4D4D4/3C3737?text=Project" }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500"></div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className={`text-2xl font-bold ${PRIMARY_TEXT_CLASSES}`}>{project.title}</h3>
                <p className={SECONDARY_TEXT_CLASSES}>{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className={`text-xs font-semibold px-3 py-1 bg-gray-200 ${SECONDARY_TEXT_CLASSES} rounded-full`}>
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
                      className={`${ACCENT_COLOR_CLASSES} hover:text-rose-700 font-medium flex items-center transition duration-200`}
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${SECONDARY_TEXT_CLASSES} hover:${ACCENT_COLOR_CLASSES} font-medium flex items-center transition duration-200`}
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

// ExperienceSection updated for light theme (Resume/Experience)
const ExperienceSection = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="7+ YEARS OF EXPERIENCE"
          subtitle="Work Experience"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200"></div>

          {experience.map((item, index) => (
            <AnimatedSection
              key={index}
              delay={index * 200}
              className="relative mb-10 flex w-full"
            >
              {/* Timeline node */}
              <div className={`absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 ${ACCENT_BG_CLASSES} rounded-full ring-8 ring-white`}>
                <Briefcase className="w-4 h-4 text-white" />
              </div>

              {/* Content always on the right */}
              <div className="w-full pl-16 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-rose-300 transition duration-300">
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

// EducationSection updated for light theme (Resume/Education and Certificates)
const EducationSection = ({ education, certificates }) => {
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="ACADEMIC BACKGROUND"
          subtitle="Education & Credentials"
        />

        <div className="space-y-20">

          {/* EDUCATION SECTION */}
          {education.length > 0 && (
            <div className="space-y-8">
              <AnimatedSection>
                <h3 className={`text-3xl font-bold ${PRIMARY_TEXT_CLASSES} mb-6 flex items-center`}>
                  <GraduationCap className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} /> Education
                </h3>
              </AnimatedSection>

              {/* GRID PRODUCT-CARD LAYOUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {education.map((edu, index) => (
                  <AnimatedSection
                    key={index}
                    delay={index * 150}
                    className={`${CARD_BG_CLASSES} p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                  >
                    <p className={`text-sm font-semibold ${ACCENT_COLOR_CLASSES}`}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <h4 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mt-1`}>
                      {edu.degree}
                    </h4>
                    <p className={`text-lg ${SECONDARY_TEXT_CLASSES}`}>{edu.institution}</p>
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
                <h3 className={`text-3xl font-bold ${PRIMARY_TEXT_CLASSES} mb-6 flex items-center`}>
                  <Award className={`w-7 h-7 mr-2 ${ACCENT_COLOR_CLASSES}`} /> Certificates
                </h3>
              </AnimatedSection>

              {/* GRID PRODUCT-CARD LAYOUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert, index) => (
                  <AnimatedSection
                    key={index}
                    delay={index * 150}
                    className={`${CARD_BG_CLASSES} p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm mb-4"
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
                        className={`text-sm font-medium ${ACCENT_COLOR_CLASSES} hover:text-rose-700 transition duration-200`}
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
      </div>
    </section>

  );
};

// ContactSection updated for light theme
const ContactSection = ({ userDetails, messageData, setMessageData, loading, handleSubmit }) => (
  <section id="contact" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionTitle
        title="CONTACT ME"
        subtitle="Get In Touch"
      />

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <AnimatedSection className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100 hover:border-rose-300`}>
          <Mail className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Email Me</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.email}</p>
          <a
            href={`mailto:${userDetails.email}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-rose-700 font-medium`}
          >
            Send a Message →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={150} className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100 hover:border-rose-300`}>
          <Phone className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Call/WhatsApp</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.phone}</p>
          <a
            href={`tel:${userDetails.phone}`}
            className={`mt-3 inline-block ${ACCENT_COLOR_CLASSES} hover:text-rose-700 font-medium`}
          >
            Get in Touch →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={300} className={`${CARD_BG_CLASSES} p-8 rounded-xl border border-gray-100 hover:border-rose-300`}>
          <MapPin className={`w-8 h-8 ${ACCENT_COLOR_CLASSES} mx-auto mb-4`} />
          <h4 className={`text-xl font-bold mb-2 ${PRIMARY_TEXT_CLASSES}`}>Location</h4>
          <p className={SECONDARY_TEXT_CLASSES}>{userDetails.location}</p>
          <p className="mt-3 text-gray-500">Timezone: IST (UTC+5:30)</p>
        </AnimatedSection>
      </div>

      {/* Contact Form */}
      <AnimatedSection delay={450}>
        <form onSubmit={handleSubmit} className={`max-w-3xl mx-auto ${CARD_BG_CLASSES} p-10 rounded-2xl border border-gray-100`}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Your Name</label>
              <input
                required
                type="text"
                value={messageData.name}
                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 bg-gray-50 ${PRIMARY_TEXT_CLASSES} border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Your Email</label>
              <input
                required
                type="email"
                value={messageData.email}
                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-gray-50 ${PRIMARY_TEXT_CLASSES} border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={`block ${SECONDARY_TEXT_CLASSES} mb-2 text-sm`}>Message</label>
            <textarea
              rows="5"
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              placeholder="Write your message…"
              className={`w-full px-4 py-3 bg-gray-50 ${PRIMARY_TEXT_CLASSES} border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none`}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 ${ACCENT_BG_CLASSES} rounded-lg font-semibold text-white shadow-md transition duration-300`}
          >
            {loading ? "....sending" : "Send Message"}
          </button>
        </form>
      </AnimatedSection>

    </div>
  </section>
);


// Footer updated for light theme
const Footer = ({ socialLinks, hobbies, userDetails }) => (
  <footer className="bg-gray-100 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-300 pb-8 mb-8">

        {/* Logo/Name */}
        <div>
          <div className="text-xl font-extrabold text-gray-900 mb-4">INBIO</div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {userDetails.fullName}.</p>
          <p className="text-gray-500 text-sm">{userDetails.role} </p>
        </div>

        {/* Hobbies */}
        <div>
          <h5 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mb-4`}>Interests</h5>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h, index) => (
              <span key={index} className="text-xs font-medium px-3 py-1 bg-white text-gray-600 rounded-full border border-gray-300">
                {h.hobby}
              </span>
            ))}
          </div>
        </div>

        {/* Social - Conditional Rendering */}
        <div>
          <h5 className={`text-xl font-bold ${PRIMARY_TEXT_CLASSES} mb-4`}>Connect</h5>
          <div className="flex space-x-4">
            {Object.entries(socialLinks).map(([platform, link]) => {
              let Icon = null;
              if (link === '#') return null;
              if (platform === 'github') Icon = Github;
              if (platform === 'linkedin') Icon = Linkedin;
              if (platform === 'twitter') Icon = Twitter;
              if (platform === 'instagram') Icon = InstagramIcon;

              return Icon ? (
                <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full border border-gray-300 text-gray-600 hover:${ACCENT_COLOR_CLASSES} hover:border-rose-500 transition duration-200`}>
                  <Icon className="w-6 h-6" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        All Rights Reserved.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---
const PortfolioThree = ({ data, pageId }) => {

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
    return <div className="p-8 text-center text-xl bg-gray-50">Loading portfolio data...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50 min-h-screen">

      {/* 1. Hero/Intro */}
      <HeroSection userDetails={userDetails} socialLinks={socialLinks} skills={skills} />

      {/* 2. What I Do (Mimics the Features section) */}
      <AboutSection userDetails={userDetails} />

      {/* 3. Projects (My Portfolio) */}
      <ProjectsSection projects={projects} />

      {/* 4. Experience */}
      <ExperienceSection experience={experience} />

      {/* 5. Education & Certificates */}
      <EducationSection education={education} certificates={certificates} />

      {/* 6. Skills (Placed after Experience/Education) */}
      <SkillsSection skills={skills} />


      {/* 7. Contact */}
      <ContactSection userDetails={userDetails} messageData={messageData} setMessageData={setMessageData} loading={loading} handleSubmit={handleSubmit} />

      {/* 8. Footer */}
      <Footer socialLinks={socialLinks} hobbies={hobbies} userDetails={userDetails} />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 ${ACCENT_BG_CLASSES} text-white rounded-full shadow-lg transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } hover:shadow-xl transform hover:scale-105 active:scale-95 z-50`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default PortfolioThree;