import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Download, Briefcase, GraduationCap, Award, Zap, ChevronUp, InstagramIcon } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

// --- Data Transformation Function ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        // Use a format like 'Jan 2025' or 'May 2024'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    } catch {
        return dateString.substring(0, 10); // Fallback to YYYY-MM-DD
    }
};

const transformPortfolioData = (backendData) => {
    if (!backendData || !backendData.data) return {};

    const { portfolio, userDetails, socialLinks, skills, projects, certificates, education, experience, hobbies } = backendData.data;

    // Use the first element of arrays for singular sections
    const firstUserDetails = userDetails && userDetails[0] ? userDetails[0] : {};
    const firstSocialLinks = socialLinks && socialLinks[0] ? socialLinks[0] : {};

    return {
        portfolioId: portfolio?._id || '',
        userDetails: {
            fullName: firstUserDetails.fullName || 'N/A',
            role: firstUserDetails.role || 'N/A',
            email: firstUserDetails.email || 'N/A',
            phone: firstUserDetails.phone || 'N/A',
            location: firstUserDetails.location || 'N/A',
            profileImage: firstUserDetails.profileImage || "https://placehold.co/300x300/F0EFEB/3C3737?text=KS",
            about: firstUserDetails.about || 'No description provided.',
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
            title: project.title || 'N/A',
            description: project.description || 'No description provided.',
            techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : ['Tech Stack N/A'],
            projectLink: project.projectLink || '#',
            githubLink: project.githubLink || '#',
            image: project.image || "https://placehold.co/600x400/3C3737/F0EFEB?text=Project",
        })),
        experience: experience.map(exp => ({
            company: exp.company || 'N/A',
            position: exp.position || 'N/A',
            startDate: formatDate(exp.startDate) || 'N/A',
            endDate: formatDate(exp.endDate) || 'N/A',
            description: exp.description || 'No description provided.',
        })),
        education: education.map(edu => ({
            institution: edu.institution || 'N/A',
            degree: edu.degree || 'N/A',
            fieldOfStudy: edu.fieldOfStudy || 'N/A',
            startDate: formatDate(edu.startDate) || 'N/A',
            endDate: formatDate(edu.endDate) || 'N/A',
            grade: edu.grade || 'N/A',
        })),
        certificates: certificates.map(cert => ({
            title: cert.title || 'N/A',
            issuer: cert.issuer || 'N/A',
            issueDate: formatDate(cert.issueDate) || 'N/A',
            certificateLink: cert.certificateLink || '#',
            image: cert.image || '#'
        })),
        hobbies: hobbies.map(h => ({ hobby: h.hobby || 'N/A' })),
    };
};

// --- Custom Hooks ---

// Hook to check if an element is visible on screen for scroll effects
const useInView = (options) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                // Stop observing once it's visible
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(entry.target);
            }
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [ref, inView];
};

// --- Helper Components ---
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

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <AnimatedSection className="mb-12 border-l-4 border-indigo-600 pl-4">
        <div className="flex items-center text-indigo-600 mb-1">
            {Icon && <Icon className="w-6 h-6 mr-2" />}
            <h2 className="text-sm font-semibold tracking-widest uppercase">{title}</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{subtitle}</p>
    </AnimatedSection>
);

const NavLink = ({ id, label }) => (
    <a
        href={`#${id}`}
        className="py-1 px-3 text-sm font-medium text-gray-600 hover:text-indigo-600 transition duration-200 hover:bg-indigo-50 rounded-full"
        onClick={() => {
            // Smooth scroll to the section
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
        <div className="min-h-screen bg-gray-50 flex items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto z-10">
                {/* Header/Nav */}
                <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
                        <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 border border-gray-900 px-2 py-1 rounded-full">
                                {getInitials(userDetails.fullName)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">{userDetails.fullName}</span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-2">
                            {navItems.map(item => <NavLink key={item.id} id={item.id} label={item.label} />)}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-indigo-50 transition duration-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
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
                                className="text-lg font-semibold text-gray-900 hover:text-indigo-600 p-3 rounded-lg hover:bg-indigo-50 transition duration-200"
                                onClick={() => {
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <div className="p-6 pt-4 border-t mt-4">
                        <h3 className="text-gray-500 mb-2">Social</h3>
                        <div className="flex space-x-4">
                            {/* Conditional Rendering for Mobile Nav */}
                            {socialLinks.github && socialLinks.github !== '#' && (
                                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-200">
                                    <Github className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-200">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.twitter && socialLinks.twitter !== '#' && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-200">
                                    <Twitter className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.instagram && socialLinks.instagram !== '#' && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition duration-200">
                                    <InstagramIcon />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="md:hidden justify-center flex">
                        <AnimatedSection className="relative w-72 h-72 sm:w-96 sm:h-96">
                            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <img
                                className="w-full h-full object-cover rounded-full shadow-2xl relative z-10 border-4 border-white"
                                src={userDetails.profileImage}
                                alt={`${userDetails.fullName}'s profile`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/F0EFEB/3C3737?text=KS" }}
                            />
                        </AnimatedSection>
                    </div>
                    <div className="space-y-6">
                        <AnimatedSection>
                            <p className="text-lg text-gray-600 font-medium">Hello, I'm {userDetails.fullName},</p>
                            <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-none">
                                <span className="block text-indigo-600">{userDetails.role.split(' ')[0]}</span>
                                <span className="block">{userDetails.role.split(' ').slice(1).join(' ') || 'Developer'}</span>
                            </h1>
                        </AnimatedSection>

                        <AnimatedSection delay={200}>
                            <p className="text-xl text-gray-700 max-w-lg">
                                {userDetails.about}
                            </p>
                        </AnimatedSection>

                        <AnimatedSection delay={400} className="flex space-x-4">
                            <a
                                href={userDetails.resumeLink}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] active:scale-95"
                            >
                                Download Resume <Download className="ml-2 w-4 h-4" />
                            </a>

                            <a
                                href="#contact"
                                className="flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 transition duration-300 transform hover:scale-[1.02] active:scale-95"
                            >
                                Contact Me
                            </a>
                        </AnimatedSection>

                        {/* Social Links - Conditional Rendering */}
                        <AnimatedSection delay={600} className="flex space-x-6 pt-4">
                            {socialLinks.github && socialLinks.github !== '#' && (
                                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition duration-200 transform hover:scale-110">
                                    <Github className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition duration-200 transform hover:scale-110">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.twitter && socialLinks.twitter !== '#' && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition duration-200 transform hover:scale-110">
                                    <Twitter className="w-6 h-6" />
                                </a>
                            )}
                            {socialLinks.instagram && socialLinks.instagram !== '#' && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition duration-200 transform hover:scale-110">
                                    <InstagramIcon />
                                </a>
                            )}
                        </AnimatedSection>

                    </div>

                    <div className="hidden md:justify-end md:flex">
                        <AnimatedSection className="relative w-72 h-72 sm:w-96 sm:h-96">
                            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <img
                                className="w-full h-full object-cover rounded-full shadow-2xl relative z-10 border-4 border-white"
                                src={userDetails.profileImage}
                                alt={`${userDetails.fullName}'s profile`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/F0EFEB/3C3737?text=KS" }}
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
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <AnimatedSection>
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Passionate about making an impact as a <span className="text-indigo-600">{userDetails.role}</span>.
                    </h2>

                </AnimatedSection>

                <AnimatedSection delay={200} className="text-lg text-gray-700 space-y-6">
                    <p>{userDetails.about}</p>
                    <div className="border-l-4 border-indigo-100 pl-4 italic text-gray-600">
                        <p>"I believe in continuous learning and applying cutting-edge technologies to solve real-world problems. Let's build something exceptional together."</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 text-gray-800">
                        <div className="flex items-center"><Mail className="w-5 h-5 mr-2 text-indigo-500" /> {userDetails.email}</div>
                        <div className="flex items-center"><Phone className="w-5 h-5 mr-2 text-indigo-500" /> {userDetails.phone}</div>
                        <div className="flex items-center col-span-2"><MapPin className="w-5 h-5 mr-2 text-indigo-500" /> {userDetails.location}</div>
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
        <section id="skills" className="py-20 sm:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <SectionTitle
                    icon={Zap}
                    title="Core Competencies"
                    subtitle="My Technological Toolkit"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <AnimatedSection key={category} delay={index * 150} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-indigo-600">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{category}</h3>
                            <ul className="space-y-3">
                                {groupedSkills[category].map((skill, skillIndex) => (
                                    <li
                                        key={skillIndex}
                                        className="flex justify-between items-center text-gray-700"
                                    >
                                        <span className="font-medium">{skill.name}</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${skill.level.toLowerCase() === 'expert' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                <SectionTitle
                    icon={Briefcase}
                    title="Featured Work"
                    subtitle="Recent Projects"
                />

                <div className="grid md:grid-cols-2 gap-12">
                    {projects.map((project, index) => (
                        <AnimatedSection key={index} delay={index * 200} className="group bg-gray-50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.01]">
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-64 object-cover transition duration-500 group-hover:scale-105"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/3C3737/F0EFEB?text=Project" }}
                                />

                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                                <p className="text-gray-700">{project.description}</p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.techStack.map((tech, i) => (
                                        <span key={i} className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
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
                                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition duration-200"
                                        >
                                            Live Demo
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
        <section id="experience" className="py-20 sm:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <SectionTitle
                    icon={Briefcase}
                    title="Professional Journey"
                    subtitle="Work Experience"
                />

                <div className="relative">

                    {experience.map((item, index) => (
                        <AnimatedSection
                            key={index}
                            delay={index * 200}
                            className="relative mb-10 flex w-full"
                        >
                            {/* Timeline vertical line */}
                            <div className="absolute left-4 top-0 bottom-0 w-1 bg-indigo-100"></div>

                            {/* Timeline node */}
                            <div className="absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 bg-indigo-600 rounded-full ring-8 ring-indigo-50">
                                <Briefcase className="w-4 h-4 text-white" />
                            </div>

                            {/* Content always on the right */}
                            <div className="w-full pl-16">
                                <span className="text-sm font-semibold text-indigo-600">
                                    {item.startDate} - {item.endDate}
                                </span>

                                <h4 className="text-xl font-bold text-gray-900 mt-1">
                                    {item.position}
                                </h4>

                                <p className="text-lg text-gray-700">{item.company}</p>

                                <p className="text-gray-600 mt-2 text-sm">
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

                {/* EDUCATION — SECOND CARD */}
                {education.length > 0 && (
                    <div className="p-8 space-y-8">
                        <AnimatedSection>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <GraduationCap className="w-7 h-7 mr-2 text-indigo-600" /> Education
                            </h3>
                        </AnimatedSection>

                        {/* PRODUCT CARD STYLE GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {education.map((edu, index) => (
                                <AnimatedSection
                                    key={index}
                                    delay={index * 100}
                                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <p className="text-sm font-semibold text-indigo-600">
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                    <h4 className="text-xl font-bold text-gray-900 mt-1">{edu.degree}</h4>
                                    <p className="text-lg text-gray-700">{edu.institution}</p>

                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-600"><span className="font-semibold">Field:</span> {edu.fieldOfStudy}</p>
                                        <p className="text-gray-600"><span className="font-semibold">Grade:</span> {edu.grade}</p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-16">
                    {/* CERTIFICATES — FIRST CARD */}
                    {certificates.length > 0 && (
                        <div className="p-8 space-y-8">
                            <AnimatedSection>
                                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Award className="w-7 h-7 mr-2 text-indigo-600" /> Certificates
                                </h3>
                            </AnimatedSection>

                            {/* PRODUCT CARD STYLE GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {certificates.map((cert, index) => (
                                    <AnimatedSection
                                        key={index}
                                        delay={index * 100}
                                        className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        />

                                        <div className="mt-4 space-y-1">
                                            <p className="text-sm font-semibold text-indigo-600">{cert.issueDate}</p>
                                            <h4 className="text-lg font-bold text-gray-900">{cert.title}</h4>
                                            <p className="text-gray-700">{cert.issuer}</p>
                                        </div>

                                        {cert.certificateLink && cert.certificateLink !== "#" && (
                                            <a
                                                href={cert.certificateLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-200"
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
        </section >

    );
};

const ContactSection = ({ userDetails, messageData, setMessageData, loading, handleSubmit }) => (
    <section id="contact" className="py-20 sm:py-32 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-white">
            <div className="text-center mb-16">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-indigo-400 mb-2">
                    Get In Touch
                </h2>
                <p className="text-4xl sm:text-5xl font-extrabold leading-tight">
                    Let's Build Something Together
                </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
                <AnimatedSection className="p-6 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-[1.03]">
                    <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Email Me</h4>
                    <p className="text-gray-400">{userDetails.email}</p>
                    <a
                        href={`mailto:${userDetails.email}`}
                        className="mt-3 inline-block text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        Send a Message →
                    </a>
                </AnimatedSection>

                <AnimatedSection delay={150} className="p-6 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-[1.03]">
                    <Phone className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Call/WhatsApp</h4>
                    <p className="text-gray-400">{userDetails.phone}</p>
                    <a
                        href={`tel:${userDetails.phone}`}
                        className="mt-3 inline-block text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        Get in Touch →
                    </a>
                </AnimatedSection>

                <AnimatedSection delay={300} className="p-6 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-[1.03]">
                    <MapPin className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Location</h4>
                    <p className="text-gray-400">{userDetails.location}</p>
                    <p className="mt-3 text-indigo-400">Timezone: IST (UTC+5:30)</p>
                </AnimatedSection>
            </div>

            {/* Contact Form (Unchanged as requested) */}
            <AnimatedSection delay={450}>
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm">Your Name</label>
                            <input
                                required
                                type="text"
                                value={messageData.name}
                                onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2 text-sm">Your Email</label>
                            <input
                                required
                                type="email"
                                value={messageData.email}
                                onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-300 mb-2 text-sm">Message</label>
                        <textarea
                            rows="5"
                            required
                            value={messageData.message}
                            onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                            placeholder="Write your message…"
                            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white shadow-lg transition duration-300"
                    >
                        {loading ? "....sending" : "Send Message"}
                    </button>
                </form>
            </AnimatedSection>

        </div>
    </section>
);


const Footer = ({ socialLinks, hobbies, userDetails }) => (
    <footer className="bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8 mb-8">

                {/* About */}
                <div>
                    <h5 className="text-xl font-bold text-indigo-400 mb-4">{userDetails.fullName}</h5>
                    <p className="text-gray-400 text-sm">{userDetails.role} </p>
                </div>

                {/* Hobbies */}
                <div>
                    <h5 className="text-xl font-bold text-indigo-400 mb-4">Interests</h5>
                    <div className="flex flex-wrap gap-2">
                        {hobbies.map((h, index) => (
                            <span key={index} className="text-xs font-medium px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                                {h.hobby}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Social - Conditional Rendering */}
                <div>
                    <h5 className="text-xl font-bold text-indigo-400 mb-4">Connect</h5>
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
                                {/* Instagram icon SVG */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.013 4.851.074 1.161.055 1.83.249 2.378.47a3.568 3.568 0 011.531 1.004 3.568 3.568 0 011.004 1.532c.221.548.415 1.217.47 2.378.061 1.267.074 1.647.074 4.851s-.013 3.584-.074 4.851c-.055 1.161-.249 1.83-.47 2.378a3.568 3.568 0 01-1.004 1.531 3.568 3.568 0 01-1.532 1.004c-.548.221-1.217.415-2.378.47-.83.04-1.109.06-2.451.06h-.002c-1.342 0-1.621-.02-2.451-.06-1.161-.055-1.83-.249-2.378-.47a3.568 3.568 0 01-1.531-1.004 3.568 3.568 0 01-1.004-1.532c-.221-.548-.415-1.217-.47-2.378-.061-1.267-.074-1.647-.074-4.851s.013-3.584.074-4.851c.055-1.161.249-1.83.47-2.378a3.568 3.568 0 011.004-1.531 3.568 3.568 0 011.532-1.004c.548-.221 1.217-.415 2.378-.47 1.267-.061 1.647-.074 4.851-.074zM12 4.39a7.61 7.61 0 100 15.22 7.61 7.61 0 000-15.22zM12 6.814a5.186 5.186 0 110 10.372 5.186 5.186 0 010-10.372zM18.846 6.516a1.21 1.21 0 110 2.42 1.21 1.21 0 010-2.42z" /></svg>
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
const PortfolioOne = ({ data, pageId }) => {

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
        return <div className="p-8 text-center text-xl">Loading portfolio data...</div>;
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
                className={`fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg transition-opacity duration-300 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    } hover:bg-indigo-700 transform hover:scale-105 active:scale-95 z-50`}
                aria-label="Scroll to top"
            >
                <ChevronUp className="w-6 h-6" />
            </button>

        </div>
    );
};

export default PortfolioOne;