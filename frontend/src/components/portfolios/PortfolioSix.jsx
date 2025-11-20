import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon, Coffee, Settings } from 'lucide-react';
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
      fullName: firstUserDetails.fullName || 'Johnathan Doe',
      role: firstUserDetails.role || 'Full Stack Engineer',
      email: firstUserDetails.email || 'johnathan.doe@example.com',
      phone: firstUserDetails.phone || 'N/A',
      location: firstUserDetails.location || 'New York, NY',
      profileImage: firstUserDetails.profileImage || "https://placehold.co/300x300/3C3C3C/FF8A00?text=JD",
      about: firstUserDetails.about || 'A highly focused engineer with 5+ years of experience in building scalable web applications. Passionate about clean code and complex problem-solving.',
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
    })),
    projects: projects.map(project => ({
      title: project.title || 'SaaS Dashboard',
      description: project.description || 'Developed a complete analytics dashboard for a B2B SaaS platform.',
      techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : ['React', 'TypeScript', 'Tailwind'],
      projectLink: project.projectLink || '#',
      githubLink: project.githubLink || '#',
      image: project.image || "https://placehold.co/600x400/3C3C3C/FF8A00?text=Project+View",
    })),
    experience: experience.map(exp => ({
      company: exp.company || 'Tech Solutions Co.',
      position: exp.position || 'Software Developer',
      startDate: formatDate(exp.startDate) || 'Jul 2020',
      endDate: formatDate(exp.endDate) || 'Present',
      description: exp.description || 'Contributed to feature development and maintenance of the core product API.',
    })),
    education: education.map(edu => ({
      institution: edu.institution || 'State University',
      degree: edu.degree || 'B.S.',
      fieldOfStudy: edu.fieldOfStudy || 'Computer Science',
      startDate: formatDate(edu.startDate) || 'Aug 2016',
      endDate: formatDate(edu.endDate) || 'May 2020',
      grade: edu.grade || '3.8 GPA',
    })),
    certificates: certificates.map(cert => ({
      title: cert.title || 'Certified Scrum Master',
      issuer: cert.issuer || 'Scrum Alliance',
      issueDate: formatDate(cert.issueDate) || 'Jan 2022',
      certificateLink: cert.certificateLink || '#',
      image: cert.image || "https://placehold.co/400x300/3C3C3C/FF8A00?text=Cert"
    })),
    hobbies: hobbies.map(h => ({ hobby: h.hobby || 'Gaming' })),
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
      observer.disconnect();
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

const SectionTitle = ({ icon: Icon, title, subtitle, isDark = false }) => (
  <AnimatedSection className="mb-12 text-center">
    <h2 className={`text-xl font-bold tracking-widest uppercase mb-2 ${isDark ? 'text-orange-400' : 'text-green-700'}`}>{title}</h2>
    <p className={`text-4xl sm:text-5xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>{subtitle}</p>
  </AnimatedSection>
);

const NavLink = ({ id, label }) => (
  <a
    href={`#${id}`}
    className="py-1 px-4 text-sm font-medium text-gray-100 hover:text-orange-400 transition duration-200 hover:bg-green-700/50 rounded-full"
    onClick={() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    {label}
  </a>
);


// --- Section Components (Themed) ---

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

  return (
    <div className="min-h-[90vh] bg-green-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Header/Nav - Dark Green Theme */}
      <header className="fixed top-0 left-0 right-0 bg-green-950/90 backdrop-blur-sm shadow-xl z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
          <div className="flex items-center">
            <span className="text-xl font-extrabold text-orange-400">
              🔥 {userDetails.fullName.split(' ')[0]}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
            <a
              href="#contact"
              className="ml-4 px-6 py-2 bg-orange-500 text-green-900 font-bold rounded-full hover:bg-orange-400 transition duration-300 transform hover:scale-[1.05]"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full text-white hover:bg-green-700/50 transition duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 bg-green-950 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden pt-20`}>
        <nav className="flex flex-col space-y-2 p-6">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-lg font-semibold text-white hover:text-orange-400 p-3 rounded-lg hover:bg-green-700/50 transition duration-200"
              onClick={() => {
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 px-6 py-2 bg-orange-500 text-green-900 font-bold rounded-full text-center hover:bg-orange-400"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Me
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto z-10 w-full ">
        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-white order-2 md:order-1">
            <AnimatedSection>
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
                <span className="block text-green-400">Because {userDetails.role}</span>
                <span className="block text-white">Is Complicated Enough. 🔥</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-xl text-green-200 max-w-lg">
                {userDetails.about}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={400} className="flex space-x-4 pt-4">
              <a
                href={userDetails.resumeLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-green-900 bg-orange-500 hover:bg-orange-400 transition duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                Download Resume <Download className="ml-2 w-4 h-4" />
              </a>
            </AnimatedSection>
          </div>

          <div className="justify-center flex order-1 md:order-2">
            <AnimatedSection className="relative w-full max-w-sm sm:max-w-md">
              {/* Profile image with the background blob shape */}
              {/* Adapted the complex shape from the image using rounded borders and a slight skew */}
              <div className="absolute inset-x-0 bottom-0 top-1/4 bg-green-700/50 rounded-[40px] shadow-2xl z-0 transform skew-y-1 origin-top-left -rotate-1"></div>
              <img
                className="w-full h-auto object-cover rounded-[30px] shadow-2xl relative z-10 transform -rotate-3 border-4 border-white"
                src={userDetails.profileImage}
                alt={`${userDetails.fullName}'s profile`}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/3C3C3C/FF8A00?text=JD" }}
              />
            </AnimatedSection>
          </div>
        </div>
      </div>
      <div className='h-20'>
        <div className="absolute bottom-0 left-0 w-full h-10 bg-white transform skew-y-1 origin-bottom-left z-20"></div>
      </div>
    </div>
  );
};


const AboutSection = ({ userDetails, socialLinks }) => (
  <section
    id="about"
    className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8 relative z-30"
  >
    <div className="max-w-4xl mx-auto">
      <SectionTitle
        icon={Settings}
        title="About Me"
        subtitle="Who I Am"
        isDark={false}
      />

      <AnimatedSection className="mt-10 p-8 bg-gray-50 rounded-xl shadow-md border border-gray-200">
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {userDetails?.about || "No about information available."}
        </p>

        {/* Social Links Section */}
        <div className="flex items-center gap-5 mt-6">
          {socialLinks?.github && socialLinks.github !== "#" && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
          )}

          {socialLinks?.linkedin && socialLinks.linkedin !== "#" && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}

          {socialLinks?.twitter && socialLinks.twitter !== "#" && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}

          {socialLinks?.instagram && socialLinks.instagram !== "#" && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
          )}
        </div>
      </AnimatedSection>
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
    <section id="skills" className="py-20 sm:py-32 bg-green-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          icon={Zap}
          title="My Expertise"
          subtitle="Skills & Technologies"
          isDark={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={category} delay={index * 150} className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition duration-300 transform hover:scale-[1.01]">
              <h3 className="text-2xl font-bold text-green-800 mb-4 border-b pb-2 border-gray-200">{category}</h3>
              <ul className="space-y-3">
                {groupedSkills[category].map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="flex justify-between items-center text-gray-700 p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${skill.level.toLowerCase() === 'expert' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
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

const ProjectsSection = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Remapped to "Our Popular Courses" for theme consistency */}
        <SectionTitle
          icon={Briefcase}
          title="Our Popular Courses"
          subtitle="Recent Projects"
          isDark={false}
        />

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 200} className="group bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/3C3C3C/FF8A00?text=Project+View" }}
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
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
                      className="text-orange-500 hover:text-orange-700 font-bold flex items-center transition duration-200 text-sm"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-700 font-bold flex items-center transition duration-200 text-sm"
                    >
                      Github
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

const ExperienceEducationWrapper = ({ userDetails, experience, education, certificates }) => {
  // Only render this wrapper if there is any data for its sub-sections
  if (experience.length === 0 && education.length === 0 && certificates.length === 0) return null;

  return (
    <section className="bg-green-50 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">


      {/* Render sub-sections conditionally */}
      {experience.length > 0 && <ExperienceSection experience={experience} />}
      {(education.length > 0 || certificates.length > 0) && <EducationSection education={education} certificates={certificates} />}

    </section>
  );
}

const ExperienceSection = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b-2 border-green-200 pb-3">Professional Experience</h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Desktop Timeline */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-200 transform -translate-x-1/2 hidden md:block"></div>

        {experience.map((item, index) => (
          <AnimatedSection
            key={index}
            delay={index * 150}
            // Alternate left/right for desktop
            className={`mb-10 flex w-full justify-start items-start md:odd:flex-row-reverse relative`}
          >
            {/* Timeline Node & Line for Mobile */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-green-200 ml-4"></div>
            <div className="md:hidden absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 bg-orange-500 rounded-full ring-8 ring-green-50 shadow-md">
              <Briefcase className="w-4 h-4 text-green-900" />
            </div>

            {/* Content Card */}
            <div className={`w-full md:w-5/12 p-6 bg-white rounded-xl shadow-lg border-t-4 border-green-500 transition duration-300 hover:shadow-2xl ${index % 2 === 0 ? 'md:mr-auto md:pr-10 md:text-right' : 'md:ml-auto md:pl-10 md:text-left'} pl-16 md:pl-0`}>
              <span className="text-sm font-semibold text-orange-500">
                {item.startDate} - {item.endDate}
              </span>
              <h4 className="text-xl font-bold text-gray-900 mt-1">{item.position}</h4>
              <p className="text-lg text-green-700">{item.company}</p>
              <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
            </div>

            {/* Timeline Node - Desktop */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center w-8 h-8 bg-green-700 rounded-full ring-8 ring-green-50 shadow-md">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

const EducationSection = ({ education, certificates }) => {
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b-2 border-green-200 pb-3">Education & Certifications</h2>

      {/* EDUCATION */}
      {education.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 mr-2 text-orange-500" /> Education History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {education.map((edu, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 bg-white rounded-xl shadow-md border-b-4 border-orange-300 hover:shadow-xl transition-all duration-300"
              >
                <p className="text-sm font-semibold text-green-600">
                  {edu.startDate} - {edu.endDate}
                </p>
                <h4 className="text-xl font-bold text-gray-900 mt-1">{edu.degree}</h4>
                <p className="text-lg text-green-700">{edu.institution}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES - ADDED IMAGE DISPLAY */}
      {certificates.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center justify-center">
            <Award className="w-6 h-6 mr-2 text-orange-500" /> Certifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-xl transition-all duration-300"
              >
                {cert.image && (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-32 object-cover rounded-lg mb-4 border border-gray-100"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/3C3C3C/FF8A00?text=Cert" }}
                  />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-orange-500">{cert.issueDate}</p>
                  <h4 className="text-lg font-bold text-gray-900">{cert.title}</h4>
                  <p className="text-green-700">{cert.issuer}</p>
                </div>

                {cert.certificateLink && cert.certificateLink !== "#" && (
                  <a
                    href={cert.certificateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm font-bold text-green-600 hover:text-orange-500 transition duration-200"
                  >
                    View Credential →
                  </a>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}
    </section >
  );
};

const ContactSection = ({ userDetails, socialLinks, messageData, setMessageData, loading, handleSubmit }) => (
  <section id="contact" className="py-20 sm:py-32 bg-green-900 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-orange-400 mb-2">
          Get In Touch
        </h2>
        <p className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Let's Build Something Great
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
        <AnimatedSection className="p-8 bg-green-800 rounded-xl shadow-lg border-b-4 border-orange-500 hover:bg-green-700 transition duration-300 transform hover:scale-[1.03]">
          <Mail className="w-8 h-8 text-orange-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Email Me</h4>
          <p className="text-green-300">{userDetails.email}</p>
          <a
            href={`mailto:${userDetails.email}`}
            className="mt-3 inline-block text-orange-400 hover:text-white font-bold"
          >
            Send Message →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={150} className="p-8 bg-green-800 rounded-xl shadow-lg border-b-4 border-orange-500 hover:bg-green-700 transition duration-300 transform hover:scale-[1.03]">
          <Phone className="w-8 h-8 text-orange-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Call/WhatsApp</h4>
          <p className="text-green-300">{userDetails.phone || 'Available Upon Request'}</p>
          <a
            href={`tel:${userDetails.phone}`}
            className="mt-3 inline-block text-orange-400 hover:text-white font-bold"
          >
            Get in Touch →
          </a>
        </AnimatedSection>

        <AnimatedSection delay={300} className="p-8 bg-green-800 rounded-xl shadow-lg border-b-4 border-orange-500 hover:bg-green-700 transition duration-300 transform hover:scale-[1.03]">
          <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Location</h4>
          <p className="text-green-300">{userDetails.location}</p>
          <div className="flex justify-center space-x-4 mt-3">
            {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-white transition duration-200">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {socialLinks.github && socialLinks.github !== '#' && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-white transition duration-200">
                <Github className="w-6 h-6" />
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>

      {/* Contact Form (Styled for the dark green theme) */}
      <AnimatedSection delay={450}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-green-800/50 p-8 rounded-2xl shadow-xl border border-green-700">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-green-300 mb-2 text-sm">Your Name</label>
              <input
                required
                type="text"
                value={messageData.name}
                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-green-950 text-white border border-green-700 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder-green-400"
              />
            </div>

            <div>
              <label className="block text-green-300 mb-2 text-sm">Your Email</label>
              <input
                required
                type="email"
                value={messageData.email}
                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-green-950 text-white border border-green-700 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder-green-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-green-300 mb-2 text-sm">Message</label>
            <textarea
              rows="5"
              required
              value={messageData.message}
              onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              placeholder="Write your message…"
              className="w-full px-4 py-3 bg-green-950 text-white border border-green-700 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none placeholder-green-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-400 rounded-lg font-semibold text-green-900 shadow-lg transition duration-300"
          >
            {loading ? "....sending" : "Send Message"}
          </button>
        </form>
      </AnimatedSection>

    </div>
  </section>
);


const Footer = ({ hobbies, userDetails, socialLinks }) => (
  <footer className="bg-green-950 text-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-green-800 pb-8 mb-8">

        {/* About */}
        <div>
          <h5 className="text-xl font-bold text-orange-400 mb-4">{userDetails.fullName}</h5>
          <p className="text-green-300 text-sm">{userDetails.role} </p>
        </div>

        {/* Links (Placeholder for Quick Links) */}
        <div>
          <h5 className="text-xl font-bold text-orange-400 mb-4">Social Links</h5>
          <div className='flex gap-3'>
            {socialLinks?.github && socialLinks.github !== "#" && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-green-300 transition duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
            )}

            {socialLinks?.linkedin && socialLinks.linkedin !== "#" && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-green-300 transition duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}

            {socialLinks?.twitter && socialLinks.twitter !== "#" && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-green-300 transition duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}

            {socialLinks?.instagram && socialLinks.instagram !== "#" && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-300 transition duration-200"
              >
                <InstagramIcon className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <h5 className="text-xl font-bold text-orange-400 mb-4">Interests</h5>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h, index) => (
              <span key={index} className="text-xs font-medium px-3 py-1 bg-green-800 text-green-300 rounded-full border border-green-700">
                {h.hobby}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-green-500">
        &copy; {new Date().getFullYear()} {userDetails.fullName}. All Rights Reserved.
      </div>
    </div>
  </footer>
);


// --- Main App Component ---
const PortfolioSix = ({ data, pageId }) => {
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
    return <div className="p-8 text-center text-xl bg-gray-50 text-gray-800">Loading portfolio data...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-800">
      {/* 1. Hero/Intro */}
      <HeroSection userDetails={userDetails} socialLinks={socialLinks} />

      {/* 2. About Me (Implemented as the "3 Reasons" section) */}
      <AboutSection userDetails={userDetails} socialLinks={socialLinks} />

      {/* 3. Skills */}
      {skills.length > 0 && <SkillsSection skills={skills} />}

      {/* 4. Projects (Implemented as "Popular Courses") */}
      {projects.length > 0 && <ProjectsSection projects={projects} />}

      {/* 5. Experience, 6. Education & Certificates (Combined to fit the "Simple Steps" section and keep data visible) */}
      {(experience.length > 0 || education.length > 0 || certificates.length > 0) &&
        <ExperienceEducationWrapper
          userDetails={userDetails}
          experience={experience}
          education={education}
          certificates={certificates}
        />
      }

      {/* 7. Contact */}
      <ContactSection userDetails={userDetails} socialLinks={socialLinks} messageData={messageData} setMessageData={setMessageData} loading={loading} handleSubmit={handleSubmit} />

      {/* 8. Footer */}
      <Footer hobbies={hobbies} userDetails={userDetails} socialLinks={socialLinks} />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-4 bg-orange-500 text-green-900 rounded-full shadow-xl transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } hover:bg-orange-400 transform hover:scale-105 active:scale-95 z-50`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
};

export default PortfolioSix;