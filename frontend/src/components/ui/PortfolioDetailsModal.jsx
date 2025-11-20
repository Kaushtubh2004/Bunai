import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const PortfolioEditorModal = ({ selected, setSelected }) => {
  const {
    addUserDetails,
    generateUsingAI,
    addSocialLinks,
    addSkills,
    addProject,
    addCertificate,
    addEducation,
    addExperience,
    addHobbies,
    fetchAllData,
    deleteSkills,
    deleteProject,
    deleteCertificate,
    deleteEducation,
    deleteExperience,
    deleteHobbies
  } = useAuth();
  const [allData, setAllData] = useState([]);

  // states for dropdown
  const [userDetails, setUserDetails] = useState(false);
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [certificatesOpen, setCertificatesOpen] = useState(false);
  const [hobbiesOpen, setHobbiesOpen] = useState(false);

  // loading 
  const [userLoading, setUserLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [educationLoading, setEducationLoading] = useState(false);
  const [experinceLoading, setExperienceLoading] = useState(false);
  const [hobbieLoading, setHobbieLoading] = useState(false);

  // fetch all data from backend
  const loadAllData = async () => {
    if (!selected?._id) return;
    const data = await fetchAllData(selected._id);
    setAllData(data);
  };
  useEffect(() => {
    loadAllData();
  }, [selected?._id]);


  // Form Data States
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    profileImage: null,
    resume: null,
  });
  const [socialLinkData, setSocialLinkData] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  const [skillData, setSkillData] = useState({
    name: "",
    level: "",
    category: "",
  });
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    techStack: "",
    projectLink: "",
    githubLink: "",
    image: null,
  });
  const [certificateData, setCertificateData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    certificateLink: "",
    image: null,
  });
  const [educationData, setEducationData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
  });
  const [experienceData, setExperienceData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [hobbiesData, setHobbiesData] = useState({
    hobby: "",
  });

  // errors states
  const [userErrors, setUserErrors] = useState({});
  const [socialLinkErrors, setSocialLinkErrors] = useState({});
  const [skillErrors, setSkillErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [certificateErrors, setCertificateErrors] = useState({});
  const [educationErrors, setEducationErrors] = useState({});
  const [experienceErrors, setExperienceErrors] = useState({});
  const [hobbieErrors, setHobbieErrors] = useState({});

  // Form Validation Errors
  const userValidateForm = () => {
    const newuserErrors = {};

    // Name
    if (!userData.name.trim()) newuserErrors.name = "Name is required";
    else if (!/^[A-Za-z\s]{3,40}$/.test(userData.name))
      newuserErrors.name = "Name must be 3–40 letters only";

    // Role
    if (!userData.role.trim()) newuserErrors.role = "Role is required";
    else if (userData.role.length < 2 || userData.role.length > 50)
      newuserErrors.role = "Role must be 2–50 characters long";

    // Email
    if (!userData.email.trim()) newuserErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      newuserErrors.email = "Invalid email address";

    // Phone
    if (!userData.phone.trim()) newuserErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(userData.phone))
      newuserErrors.phone = "Phone number must be exactly 10 digits";

    // Location
    if (!userData.location.trim()) newuserErrors.location = "location is required";
    else if (userData.location.length > 50)
      newuserErrors.location = "Location must be under 50 characters";

    // About
    if (!userData.about.trim()) newuserErrors.about = "about is required";
    else if (userData.about.length > 1000)
      newuserErrors.about = "About section can’t exceed 1000 characters";

    // Profile Image
    if (!userData.profileImage) newuserErrors.profileImage = "Profile image is required";
    else if (userData.profileImage) {
      const img = userData.profileImage;
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(img.type))
        newuserErrors.profileImage = "Only JPG and PNG allowed";
      if (img.size > 2 * 1024 * 1024)
        newuserErrors.profileImage = "Image must be under 2 MB";
    }

    // Resume
    if (!userData.resume) newuserErrors.resume = "resume is required";
    else if (userData.resume) {
      const file = userData.resume;
      const validDocs = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validDocs.includes(file.type))
        newuserErrors.resume = "Only PDF, DOC, DOCX allowed";
      if (file.size > 5 * 1024 * 1024)
        newuserErrors.resume = "Resume must be under 5 MB";
    }

    setUserErrors(newuserErrors);
    return Object.keys(newuserErrors).length === 0;
  };
  const socialLinkValidateForm = () => {
    const newSocialLinkErrors = {};

    // github
    if (socialLinkData.github.trim() !== "") {
      if (!/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(socialLinkData.github))
        newSocialLinkErrors.github = "Invalid GitHub URL";
    }

    // linkedin
    if (socialLinkData.linkedin.trim() !== "") {
      if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/.test(socialLinkData.linkedin))
        newSocialLinkErrors.linkedin = "Invalid LinkedIn URL";
    }

    // twitter
    if (socialLinkData.twitter.trim() !== "") {
      if (!/^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_-]+\/?$/.test(socialLinkData.twitter))
        newSocialLinkErrors.twitter = "Invalid Twitter URL";
    }


    // instagram
    if (socialLinkData.instagram.trim() !== "") {
      if (!/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_-]+\/?$/.test(socialLinkData.instagram))
        newSocialLinkErrors.instagram = "Invalid Instagram URL";
    }


    setSocialLinkErrors(newSocialLinkErrors);
    return Object.keys(newSocialLinkErrors).length === 0;
  };
  const skillValidateForm = () => {
    const newSkillErrors = {};

    // Skill Name
    if (!skillData.name.trim()) newSkillErrors.name = "Skill name is required";

    // Skill Level
    if (!skillData.level.trim()) newSkillErrors.level = "Skill level is required";

    // Skill Category
    if (!skillData.category.trim()) newSkillErrors.category = "Skill category is required";

    setSkillErrors(newSkillErrors);
    return Object.keys(newSkillErrors).length === 0;
  };
  const projectValidateForm = () => {
    const newProjectErrors = {};

    // title
    if (!projectData.title.trim()) newProjectErrors.title = "Title is required";
    else if (projectData.title.length < 3 || projectData.title.length > 100)
      newProjectErrors.title = "Title must be 3–100 characters long";

    // description
    if (!projectData.description.trim()) newProjectErrors.description = "Description is required";
    else if (projectData.description.length < 10 || projectData.description.length > 1000)
      newProjectErrors.description = "Description must be 10–1000 characters long";

    // techStack
    if (!projectData.techStack.trim()) newProjectErrors.techStack = "Tech stack is required";
    else if (projectData.techStack.length < 3 || projectData.techStack.length > 100)
      newProjectErrors.techStack = "Tech stack must be 3–100 characters long";

    // projectLink
    if (projectData.projectLink && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(projectData.projectLink))
      newProjectErrors.projectLink = "Invalid project URL";

    // githubLink
    if (projectData.githubLink && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(projectData.githubLink))
      newProjectErrors.githubLink = "Invalid GitHub URL";

    // image
    if (!projectData.image) newProjectErrors.image = "image is required";
    else if (projectData.image) {
      const img = projectData.image;
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(img.type))
        newProjectErrors.image = "Only JPG and PNG allowed";
      if (img.size > 2 * 1024 * 1024)
        newProjectErrors.image = "Image must be under 2 MB";
    }
    setProjectErrors(newProjectErrors);
    return Object.keys(newProjectErrors).length === 0;
  };
  const certificateValidateForm = () => {
    const newCertificateErrors = {};

    // title
    if (!certificateData.title.trim()) newCertificateErrors.title = "Title is required";
    else if (certificateData.title.length < 3 || certificateData.title.length > 100)
      newCertificateErrors.title = "Title must be 3–100 characters long";

    // issuer
    if (!certificateData.issuer.trim()) newCertificateErrors.issuer = "Issuer is required";
    else if (certificateData.issuer.length < 3 || certificateData.issuer.length > 100)
      newCertificateErrors.issuer = "Issuer must be 3–100 characters long";

    // issueDate
    if (!certificateData.issueDate.trim()) newCertificateErrors.issueDate = "Issue date is required";

    // certificateLink
    if (certificateData.certificateLink && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(certificateData.certificateLink))
      newCertificateErrors.certificateLink = "Invalid certificate URL";

    // image
    if (!certificateData.image) newCertificateErrors.image = "image is required";
    else if (certificateData.image) {
      const img = certificateData.image;
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(img.type))
        newCertificateErrors.image = "Only JPG and PNG allowed";
      if (img.size > 2 * 1024 * 1024)
        newCertificateErrors.image = "Image must be under 2 MB";
    }

    setCertificateErrors(newCertificateErrors);
    return Object.keys(newCertificateErrors).length === 0;
  };
  const educationValidateForm = () => {
    const newEducationErrors = {};

    //institution
    if (!educationData.institution.trim()) newEducationErrors.institution = "Institution is required";
    else if (educationData.institution.length < 3 || educationData.institution.length > 100)
      newEducationErrors.institution = "Institution must be 3–100 characters long";

    // degree
    if (!educationData.degree.trim()) newEducationErrors.degree = "Degree is required";
    else if (educationData.degree.length < 2 || educationData.degree.length > 100)
      newEducationErrors.degree = "Degree must be 2–100 characters long";

    // fieldOfStudy
    if (!educationData.fieldOfStudy.trim()) newEducationErrors.fieldOfStudy = "Field of study is required";
    else if (educationData.fieldOfStudy.length < 2 || educationData.fieldOfStudy.length > 100)
      newEducationErrors.fieldOfStudy = "Field of study must be 2–100 characters long";

    // startDate
    if (!educationData.startDate.trim()) newEducationErrors.startDate = "Start date is required";

    // endDate
    if (!educationData.endDate.trim()) newEducationErrors.endDate = "End date is required";

    // grade
    if (!educationData.grade.trim()) newEducationErrors.grade = "grade is required";
    else if (educationData.grade && (educationData.grade < 1 || educationData.grade > 10))
      newEducationErrors.grade = "Grade must be 1-10";

    setEducationErrors(newEducationErrors);
    return Object.keys(newEducationErrors).length === 0;

  };
  const experienceValidateForm = () => {
    const newExperienceErrors = {};

    // company
    if (!experienceData.company.trim()) newExperienceErrors.company = "Company is required";
    else if (experienceData.company.length < 2 || experienceData.company.length > 100)
      newExperienceErrors.company = "Company must be 2–100 characters long";

    // position
    if (!experienceData.position.trim()) newExperienceErrors.position = "Position is required";
    else if (experienceData.position.length < 2 || experienceData.position.length > 100)
      newExperienceErrors.position = "Position must be 2–100 characters long";

    // startDate
    if (!experienceData.startDate.trim()) newExperienceErrors.startDate = "Start date is required";

    // endDate
    if (!experienceData.endDate.trim()) newExperienceErrors.endDate = "End date is required";

    // description
    if (!experienceData.description.trim()) newExperienceErrors.description = "Description is required";
    else if (experienceData.description.length < 10 || experienceData.description.length > 1000)
      newExperienceErrors.description = "Description must be 10–1000 characters long";

    setExperienceErrors(newExperienceErrors);
    return Object.keys(newExperienceErrors).length === 0;
  };
  const hobbieValidateForm = () => {
    const newHobbieErrors = {};

    // hobby
    if (!hobbiesData.hobby.trim()) newHobbieErrors.hobby = "Hobby is required";
    else if (hobbiesData.hobby.length < 2 || hobbiesData.hobby.length > 50)
      newHobbieErrors.hobby = "Hobby must be 2–50 characters long";

    setHobbieErrors(newHobbieErrors);
    return Object.keys(newHobbieErrors).length === 0;

  };

  // Form handle submissions
  const userHandleSubmit = async (e) => {
    e.preventDefault();
    if (!userValidateForm()) return;

    setUserLoading(true);
    try {
      const res = await addUserDetails(userData, selected._id);
      if (res) {
        alert("User details saved successfully!");
        setUserData({
          name: "",
          role: "",
          email: "",
          phone: "",
          location: "",
          about: "",
          profileImage: null,
          resume: null,
        });
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting details:", err);
      alert("Failed to save details. Please check your auth or server.");
    }
    finally {
      setUserLoading(false);
    }
  };
  const socialLinkHandleSubmit = async (e) => {
    e.preventDefault();
    if (!socialLinkValidateForm()) return;
    setSocialLoading(true);
    try {
      const res = await addSocialLinks(socialLinkData, selected._id);
      if (res) {
        alert("Social links saved successfully!");
        setSocialLinkData({
          github: "",
          linkedin: "",
          twitter: "",
          instagram: "",
        });
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting social links:", err);
      alert("Failed to save social links. Please check your auth or server.");
    } finally {
      setSocialLoading(false);
    }
  };
  const skillHandleSubmit = async (e) => {
    e.preventDefault();
    if (!skillValidateForm()) return;

    setSkillLoading(true);
    try {
      const res = await addSkills(skillData, selected._id);

      if (res) {
        alert("Skill saved successfully!");
        setSkillData({
          name: "",
          level: "",
          category: "",
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting skill:", err);
      alert("Failed to save skill. Please check your auth or server.");
    } finally {
      setSkillLoading(false);
    }
  };
  const projectHandleSubmit = async (e) => {
    e.preventDefault();
    if (!projectValidateForm()) return;

    setProjectLoading(true);
    try {
      const res = await addProject(projectData, selected._id);

      if (res) {
        alert("Project saved successfully!");
        setProjectData({
          title: "",
          description: "",
          techStack: "",
          projectLink: "",
          githubLink: "",
          image: null,
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Failed to save project. Please check your auth or server.");
    } finally {
      setProjectLoading(false);
    }
  };
  const certificateHandleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateValidateForm()) return;

    setCertificateLoading(true);
    try {
      const res = await addCertificate(certificateData, selected._id);

      if (res) {
        alert("Certificate saved successfully!");
        setCertificateData({
          title: "",
          issuer: "",
          issueDate: "",
          certificateLink: "",
          image: null,
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting certificate:", err);
      alert("Failed to save certificate. Please check your auth or server.");
    } finally {
      setCertificateLoading(false);
    }
  };
  const educationHandleSubmit = async (e) => {
    e.preventDefault();
    if (!educationValidateForm()) return;

    setEducationLoading(true);
    try {
      const res = await addEducation(educationData, selected._id);

      if (res) {
        alert("Education saved successfully!");
        setEducationData({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting education:", err);
      alert("Failed to save education. Please check your auth or server.");
    } finally {
      setEducationLoading(false);
    }
  };
  const experienceHandleSubmit = async (e) => {
    e.preventDefault();
    if (!experienceValidateForm()) return;

    setExperienceLoading(true);
    try {
      const res = await addExperience(experienceData, selected._id);

      if (res) {
        alert("Experience saved successfully!");
        setExperienceData({
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting experience:", err);
      alert("Failed to save experience. Please check your auth or server.");
    } finally {
      setExperienceLoading(false);
    }
  };
  const hobbieHandleSubmit = async (e) => {
    e.preventDefault();
    if (!hobbieValidateForm()) return;

    setHobbieLoading(true);
    try {
      const res = await addHobbies(hobbiesData, selected._id);

      if (res) {
        alert("Hobbies saved successfully!");
        setHobbiesData({
          hobby: "",
        })
        await loadAllData();
      }
    } catch (err) {
      console.error("Error submitting hobbies:", err);
      alert("Failed to save hobbies. Please check your auth or server.");
    } finally {
      setHobbieLoading(false);
    }
  };

  // handle delete
  const skillHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteSkills(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };
  const projectHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteProject(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };
  const certificateHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteCertificate(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };
  const educationHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteEducation(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };
  const experienceHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteExperience(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };
  const hobbiesHandleDelete = async (id) => {
    const sure = window.confirm("Are you sure you want to remove this item?");
    if (!sure) return;

    try {
      const deleted = await deleteHobbies(id);
      if (deleted) {
        alert("Removed Successfully!");
        await loadAllData();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item");
    }
  };

  // loading states for genrate with ai button
  const [userLoadingAi, setUserLoadingAi] = useState(false);
  const [projectLoadingAi, setProjectLoadingAi] = useState(false);
  const [experienceLoadingAi, setExperienceLoadingAi] = useState(false);

  // generate with ai
  const userHandelGenerate = async () => {
    if (!userData.about.trim()) {
      alert("Enter a few details about yourself first!");
      return;
    }
    setUserLoadingAi(true);
    setUserData((prev) => ({
      ...prev,
      about: "Generating your portfolio 'About Me' section..."
    }));
    const prompt = `
    Write a professional and engaging "About Me" section for a personal portfolio
    based on the following user details:
    "${userData.about}"

    The output should be:
    - Between 50 to 60 words
    - Written in first person
    - Friendly yet professional in tone
    `;
    const generated = await generateUsingAI(prompt);

    if (generated) {
      setUserData((prev) => ({
        ...prev,
        about: generated,
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        about: "Error generating content. Please try again.",
      }));
    }
    setUserLoadingAi(false);
  };
  const projectHandelGenerate = async () => {
    if (!projectData.description.trim()) {
      alert("Enter a few details about your project!");
      return;
    }
    setProjectLoadingAi(true);
    setProjectData((prev) => ({
      ...prev,
      description: "Generating your project 'description' section..."
    }));
    const prompt = `
    Write a clear, professional, and engaging project description 
    based on the following details:
    "${projectData.description}"

    The output should:
    - Be between 50 to 60 words
    - Be written in the first person
    - Highlight the project's purpose, key features, technologies used, and results/impact
    - Maintain a friendly yet professional tone
    `;
    const generated = await generateUsingAI(prompt);

    if (generated) {
      setProjectData((prev) => ({
        ...prev,
        description: generated,
      }));
    } else {
      setProjectData((prev) => ({
        ...prev,
        description: "Error generating content. Please try again.",
      }));
    }
    setProjectLoadingAi(false);
  };
  const experienceHandelGenerate = async () => {
    if (!experienceData.description.trim()) {
      alert("Enter a few details about your experience!");
      return;
    }
    setExperienceLoadingAi(true);
    setEducationData((prev) => ({
      ...prev,
      description: "Generating your Experience 'Description' section..."
    }));
    const prompt = `
    Write a clear, professional, and engaging job experience description based on the following details:
    "${experienceData.description}"

    The output should:
    - Be between 50 to 60 words
    - Be written in the first person
    - Highlight key responsibilities, achievements, and impact
    - Maintain a friendly yet professional tone
    `;
    const generated = await generateUsingAI(prompt);

    if (generated) {
      setExperienceData((prev) => ({
        ...prev,
        description: generated,
      }));
    } else {
      setExperienceData((prev) => ({
        ...prev,
        description: "Error generating content. Please try again.",
      }));
    }
    setExperienceLoadingAi(false);
  };

  return (
    selected && (

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-[#111] text-white rounded-xl border border-gray-700 w-[90%] md:w-[80%] lg:w-[65%] max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-5">
            <h2 className="text-2xl font-semibold text-[#20d78d]">
              Edit Portfolio Details
            </h2>
            <button
              onClick={() => setSelected(null)}
              className="p-2 hover:bg-[#1b1b1b] rounded-md transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* --- User Details Section --- */}
          <div className="relative w-full mx-auto">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setUserDetails(!userDetails)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>User Details</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${userDetails ? "rotate-180 text-[#20d78d]" : "text-gray-400"
                  }`}
              />
            </button>

            {/* Dropdown Content - Expanded User Profile Form */}
            {userDetails && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={userHandleSubmit}
                  className="flex flex-col gap-5"
                >
                  {/* Name */}
                  <div >
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {userErrors.name && <p className="text-red-500 text-sm mt-1">{userErrors.name}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={userData.role}
                      onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {userErrors.role && <p className="text-red-500 text-sm mt-1">{userErrors.role}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {userErrors.email && <p className="text-red-500 text-sm mt-1">{userErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {userErrors.phone && <p className="text-red-500 text-sm mt-1">{userErrors.phone}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      placeholder="City, State, Country"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {userErrors.location && (
                      <p className="text-red-500 text-sm mt-1">{userErrors.location}</p>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setUserData({ ...userData, profileImage: e.target.files[0] })
                      }
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#20d78d] file:text-black hover:file:bg-[#18b776]"
                    />
                    {userErrors.profileImage && (
                      <p className="text-red-500 text-sm mt-1">{userErrors.profileImage}</p>
                    )}
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Resume (.pdf, .doc)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setUserData({ ...userData, resume: e.target.files[0] })
                      }
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#20d78d] file:text-black hover:file:bg-[#18b776]"
                    />
                    {userErrors.resume && (
                      <p className="text-red-500 text-sm mt-1">{userErrors.resume}</p>
                    )}
                  </div>

                  {/* About */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 flex justify-between items-center">
                      About You
                      <button
                        type="button"
                        onClick={userHandelGenerate}
                        disabled={userLoadingAi}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-full transition-colors"
                      >
                        {userLoadingAi ? "Generating..." : "Generate with Ai"}
                      </button>
                    </label>
                    <textarea
                      value={userData.about}
                      onChange={(e) => setUserData({ ...userData, about: e.target.value })}
                      placeholder="Enter key details about yourself (e.g. your profession, skills, goals)... hit generate to auto-fill"
                      className="w-full px-4 py-3 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none resize-none"
                      rows="5"
                    ></textarea>
                    {userErrors.about && (
                      <p className="text-red-500 text-sm mt-1">{userErrors.about}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={userLoading}
                    className={`mt-3 font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-md w-full ${userLoading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-[#20d78d] text-black hover:bg-[#18b776]"
                      }`}
                  >
                    {userLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>

              </div>
            )}
          </div>

          {/* --- Social Links Section --- */}
          <div className="relative w-full mx-auto mt-6">
            <button
              onClick={() => setSocialLinksOpen(!socialLinksOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Social Links</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${socialLinksOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}
              />
            </button>
            {socialLinksOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={socialLinkHandleSubmit}
                  className="flex flex-col gap-5"
                >

                  {/* GitHub Field */}
                  <div >
                    <label className="block text-sm text-gray-400 mb-1">
                      GitHub Link
                    </label>
                    <input
                      type="url"
                      value={socialLinkData.github}
                      onChange={(e) => setSocialLinkData({ ...socialLinkData, github: e.target.value })}
                      placeholder="https://github.com/your-username"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {socialLinkErrors.github && <p className="text-red-500 text-sm mt-1">{socialLinkErrors.github}</p>}
                  </div>

                  {/* Twitter Field */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Twitter (X) Link
                    </label>
                    <input
                      type="url"
                      value={socialLinkData.twitter}
                      onChange={(e) => setSocialLinkData({ ...socialLinkData, twitter: e.target.value })}
                      placeholder="https://twitter.com/your-handle"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {socialLinkErrors.twitter && <p className="text-red-500 text-sm mt-1">{socialLinkErrors.twitter}</p>}
                  </div>

                  {/* LinkedIn Field */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      LinkedIn Link
                    </label>
                    <input
                      type="url"
                      value={socialLinkData.linkedin}
                      onChange={(e) => setSocialLinkData({ ...socialLinkData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {socialLinkErrors.linkedin && <p className="text-red-500 text-sm mt-1">{socialLinkErrors.linkedin}</p>}
                  </div>

                  {/* Instagram Field */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Instagram Link
                    </label>
                    <input
                      type="url"
                      value={socialLinkData.instagram}
                      onChange={(e) => setSocialLinkData({ ...socialLinkData, instagram: e.target.value })}
                      placeholder="https://instagram.com/your-username"
                      className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                    />
                    {socialLinkErrors.instagram && <p className="text-red-500 text-sm mt-1">{socialLinkErrors.instagram}</p>}
                  </div>

                  {/* Save Changes Button */}
                  <button
                    type="submit"
                    disabled={socialLoading}
                    className={`mt-3 font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-md w-full ${socialLoading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-[#20d78d] text-black hover:bg-[#18b776]"
                      }`}
                  >
                    {socialLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* --- Skills Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setSkillsOpen(!skillsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Skills</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${skillsOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}
              />
            </button>

            {/* Dropdown Content - Skills Form */}
            {skillsOpen && (
              // NOTE: Changed absolute to block flow for proper scroll/form behavior
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={skillHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Skill</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Skill Name */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skillData.name}
                        onChange={(e) => setSkillData({ ...skillData, name: e.target.value })}
                        placeholder="e.g., React, Python, Figma"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {skillErrors.name && <p className="text-red-500 text-sm mt-1">{skillErrors.name}</p>}
                    </div>

                    <div className="flex gap-4">
                      {/* Skill Level */}
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">
                          Level
                        </label>
                        <select
                          value={skillData.level}
                          onChange={(e) =>
                            setSkillData({ ...skillData, level: e.target.value })
                          }
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        >
                          <option value="" disabled>Select Level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                        {skillErrors.level && <p className="text-red-500 text-sm mt-1">{skillErrors.level}</p>}
                      </div>

                      {/* Skill Category */}
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={skillData.category}
                          onChange={(e) => setSkillData({ ...skillData, category: e.target.value })}
                          placeholder="e.g., Frontend, Design, Backend"
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {skillErrors.category && <p className="text-red-500 text-sm mt-1">{skillErrors.category}</p>}
                      </div>
                    </div>

                    {/* Add Skill Button */}
                    <button
                      type="submit"
                      disabled={skillLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${skillLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {skillLoading ? "Adding..." : "Add Skill"}
                    </button>
                  </div>

                  {/* Skill List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Skills:</h4>

                    {/* --- START MODIFIED SKILL TAGS --- */}
                    {allData.skills.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.name}({p.level},{p.category})
                        <button
                          type="button"
                          onClick={() => skillHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}

                    {/* --- END MODIFIED SKILL TAGS --- */}

                  </div>
                </form>
              </div>
            )}
          </div>

          {/* --- Projects Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Projects</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${projectsOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}
              />
            </button>

            {/* Dropdown Content - Projects Form */}
            {projectsOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={projectHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Project</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Title Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={projectData.title}
                        onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                        placeholder="e.g., Portfolio Builder SaaS"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {projectErrors.title && <p className="text-red-500 text-sm mt-1">{projectErrors.title}</p>}
                    </div>

                    {/* Tech Stack Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tech Stack</label>
                      <input
                        type="text"
                        value={projectData.techStack}
                        onChange={(e) => setProjectData({ ...projectData, techStack: e.target.value })}
                        placeholder="e.g., React, Tailwind, Node.js"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {projectErrors.techStack && <p className="text-red-500 text-sm mt-1">{projectErrors.techStack}</p>}
                    </div>

                    {/* Links (Project & GitHub) */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">Project Link</label>
                        <input
                          type="url"
                          value={projectData.githubLink}
                          onChange={(e) => setProjectData({ ...projectData, githubLink: e.target.value })}
                          placeholder="https://live-project.com"
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {projectErrors.githubLink && <p className="text-red-500 text-sm mt-1">{projectErrors.githubLink}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
                        <input
                          type="url"
                          value={projectData.projectLink}
                          onChange={(e) => setProjectData({ ...projectData, projectLink: e.target.value })}
                          placeholder="https://github.com/project"
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {projectErrors.projectLink && <p className="text-red-500 text-sm mt-1">{projectErrors.projectLink}</p>}
                      </div>
                    </div>

                    {/* Image Upload Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Project Image</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setProjectData({ ...projectData, image: e.target.files[0] })
                        }
                        accept="image/*"
                        className="w-full text-sm text-gray-400
                     file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                     file:text-sm file:font-semibold file:bg-[#20d78d] file:text-black
                     hover:file:bg-[#18b776]"
                      />
                      {projectErrors.image && <p className="text-red-500 text-sm mt-1">{projectErrors.image}</p>}
                    </div>

                    {/* Description Field with AI Button */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1 flex justify-between items-center">
                        Description
                        <button
                          type="button"
                          onClick={projectHandelGenerate}
                          disabled={projectLoadingAi}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-full transition-colors"
                        >
                          {projectLoadingAi ? "Generating..." : "Generate with Ai"}
                        </button>
                      </label>
                      <textarea
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        placeholder="Describe your project's key features (e.g., purpose, tech stack, problems solved)... hit Generate to auto-create"
                        className="w-full px-4 py-3 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none resize-none"
                        rows="3"
                      ></textarea>
                      {projectErrors.description && <p className="text-red-500 text-sm mt-1">{projectErrors.description}</p>}
                    </div>

                    {/* Add Project Button */}
                    <button
                      type="submit"
                      disabled={projectLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${projectLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {projectLoading ? "Adding..." : "Add Project"}
                    </button>
                  </div>

                  {/* project List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Projects:</h4>
                    {allData.projects.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.title}
                        <button
                          type="button"
                          onClick={() => projectHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}

                  </div>
                </form>
              </div>
            )}
          </div>

          {/* --- Certificates Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setCertificatesOpen(!certificatesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Certificates</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${certificatesOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}

              />
            </button>

            {/* Dropdown Content - Certificates Form */}
            {certificatesOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={certificateHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Certificate</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Title Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={certificateData.title}
                        onChange={(e) => setCertificateData({ ...certificateData, title: e.target.value })}
                        placeholder="e.g., Google Project Management"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {certificateErrors.title && <p className="text-red-500 text-sm mt-1">{certificateErrors.title}</p>}
                    </div>

                    {/* Issuer Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Issuer</label>
                      <input
                        type="text"
                        value={certificateData.issuer}
                        onChange={(e) => setCertificateData({ ...certificateData, issuer: e.target.value })}
                        placeholder="e.g., Coursera, Udemy, Microsoft"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {certificateErrors.issuer && <p className="text-red-500 text-sm mt-1">{certificateErrors.issuer}</p>}
                    </div>

                    {/* Issue Date */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={certificateData.issueDate}
                        onChange={(e) => setCertificateData({ ...certificateData, issueDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {certificateErrors.issueDate && <p className="text-red-500 text-sm mt-1">{certificateErrors.issueDate}</p>}
                    </div>

                    {/* Certificate Link Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Certificate Link</label>
                      <input
                        type="url"
                        value={certificateData.certificateLink}
                        onChange={(e) => setCertificateData({ ...certificateData, certificateLink: e.target.value })}
                        placeholder="https://cert-verification.com/id/123"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {certificateErrors.certificateLink && <p className="text-red-500 text-sm mt-1">{certificateErrors.certificateLink}</p>}
                    </div>

                    {/* Image Upload Field (Certificate Copy) */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Certificate Image</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setCertificateData({ ...certificateData, image: e.target.files[0] })
                        }
                        accept="image/*"
                        className="w-full text-sm text-gray-400
                     file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                     file:text-sm file:font-semibold file:bg-[#20d78d] file:text-black
                     hover:file:bg-[#18b776]"
                      />
                      {certificateErrors.image && <p className="text-red-500 text-sm mt-1">{certificateErrors.image}</p>}
                    </div>

                    {/* Add Certificate Button */}
                    <button
                      type="submit"
                      disabled={certificateLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${certificateLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {certificateLoading ? "Adding..." : "Add Certificate"}
                    </button>
                  </div>

                  {/* certificates List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Certificates:</h4>
                    {allData.certificates.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.title}
                        <button
                          type="button"
                          onClick={() => certificateHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}

                  </div>
                </form>
              </div>
            )}
          </div>

          {/* --- Education Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setEducationOpen(!educationOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Education</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${educationOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}
              />
            </button>

            {/* Dropdown Content - Education Form */}
            {educationOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={educationHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Education Entry</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Institution Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Institution</label>
                      <input
                        type="text"
                        value={educationData.institution}
                        onChange={(e) => setEducationData({ ...educationData, institution: e.target.value })}
                        placeholder="e.g., Stanford University"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {educationErrors.institution && <p className="text-red-500 text-sm mt-1">{educationErrors.institution}</p>}
                    </div>

                    {/* Degree Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Degree</label>
                      <input
                        type="text"
                        value={educationData.degree}
                        onChange={(e) => setEducationData({ ...educationData, degree: e.target.value })}
                        placeholder="e.g., Master of Science (M.S.)"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {educationErrors.degree && <p className="text-red-500 text-sm mt-1">{educationErrors.degree}</p>}
                    </div>

                    {/* Field of Study Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={educationData.fieldOfStudy}
                        onChange={(e) => setEducationData({ ...educationData, fieldOfStudy: e.target.value })}
                        placeholder="e.g., Computer Science"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {educationErrors.fieldOfStudy && <p className="text-red-500 text-sm mt-1">{educationErrors.fieldOfStudy}</p>}
                    </div>

                    {/* Dates & Grade */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={educationData.startDate}
                          onChange={(e) => setEducationData({ ...educationData, startDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {educationErrors.startDate && <p className="text-red-500 text-sm mt-1">{educationErrors.startDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">End Date (or Present)</label>
                        <input
                          type="month"
                          value={educationData.endDate}
                          onChange={(e) => setEducationData({ ...educationData, endDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {educationErrors.endDate && <p className="text-red-500 text-sm mt-1">{educationErrors.endDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Grade/GPA</label>
                        <input
                          type="number"
                          value={educationData.grade}
                          onChange={(e) => setEducationData({ ...educationData, grade: e.target.value })}
                          placeholder="e.g., 3.8 / 4.0"
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {educationErrors.grade && <p className="text-red-500 text-sm mt-1">{educationErrors.grade}</p>}
                      </div>
                    </div>

                    {/* Add Education Button */}
                    <button
                      type="submit"
                      disabled={educationLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${educationLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {educationLoading ? "Adding..." : "Add Education"}
                    </button>
                  </div>
                  {/* education List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Education:</h4>
                    {allData.education.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.degree}({p.fieldOfStudy})
                        <button
                          type="button"
                          onClick={() => educationHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* --- Experience Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setExperienceOpen(!experienceOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Experience</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${experienceOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}
              />
            </button>

            {/* Dropdown Content - Experience Form */}
            {experienceOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={experienceHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add New Experience Entry</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Company Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Company</label>
                      <input
                        type="text"
                        value={experienceData.company}
                        onChange={(e) => setExperienceData({ ...experienceData, company: e.target.value })}
                        placeholder="e.g., Google, Amazon, Your Startup"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {experienceErrors.company && <p className="text-red-500 text-sm mt-1">{experienceErrors.company}</p>}
                    </div>

                    {/* Position Field */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Position</label>
                      <input
                        type="text"
                        value={experienceData.position}
                        onChange={(e) => setExperienceData({ ...experienceData, position: e.target.value })}
                        placeholder="e.g., Software Development Intern"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {experienceErrors.position && <p className="text-red-500 text-sm mt-1">{experienceErrors.position}</p>}
                    </div>

                    {/* Dates */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={experienceData.startDate}
                          onChange={(e) => setExperienceData({ ...experienceData, startDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {experienceErrors.startDate && <p className="text-red-500 text-sm mt-1">{experienceErrors.startDate}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-400 mb-1">End Date (or Present)</label>
                        <input
                          type="month"
                          value={experienceData.endDate}
                          onChange={(e) => setExperienceData({ ...experienceData, endDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                        />
                        {experienceErrors.endDate && <p className="text-red-500 text-sm mt-1">{experienceErrors.endDate}</p>}
                      </div>
                    </div>

                    {/* Description Field with AI Button */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1 flex justify-between items-center">
                        Job Description / Responsibilities
                        <button
                          type="button"
                          onClick={experienceHandelGenerate}
                          disabled={experienceLoadingAi}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-full transition-colors"
                        >
                          {experienceLoadingAi ? "Generating..." : "Generate with Ai"}
                        </button>
                      </label>
                      <textarea
                        value={experienceData.description}
                        onChange={(e) => setExperienceData({ ...experienceData, description: e.target.value })}
                        placeholder="Describe your job role and responsibilities (e.g., tasks, achievements, tools used)... hit Generate for an AI-refined version"
                        className="w-full px-4 py-3 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none resize-none"
                        rows="4"
                      ></textarea>
                      {experienceErrors.description && <p className="text-red-500 text-sm mt-1">{experienceErrors.description}</p>}
                    </div>

                    {/* Add Experience Button */}
                    <button
                      type="submit"
                      disabled={experinceLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${experinceLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {experinceLoading ? "Adding..." : "Add Experience"}
                    </button>
                  </div>

                  {/* Experience List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Experience:</h4>
                    {allData.experience.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.company}({p.position})
                        <button
                          type="button"
                          onClick={() => experienceHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* --- Hobbies Section --- */}
          <div className="relative w-full mx-auto mt-6">
            {/* Dropdown Trigger */}
            <button
              onClick={() => setHobbiesOpen(!hobbiesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1b1b1b] text-gray-200 hover:shadow-[0_0_4px_#20d78d] transition-all duration-200"
            >
              <span>Hobbies</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${hobbiesOpen ? "rotate-180 text-[#20d78d]" : "text-gray-400"}`}

              />
            </button>

            {/* Dropdown Content - Hobbies Form */}
            {hobbiesOpen && (
              <div className="block mt-4 w-full bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-lg p-6">
                <form
                  onSubmit={hobbieHandleSubmit}
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Add Hobbies</h3>
                  <div className="flex flex-col gap-4 border-b border-gray-700 pb-5 mb-5">

                    {/* Hobby Name */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Hobby Name
                      </label>
                      <input
                        type="text"
                        value={hobbiesData.hobby}
                        onChange={(e) => setHobbiesData({ ...hobbiesData, hobby: e.target.value })}
                        placeholder="e.g., Photography, Hiking, Gaming"
                        className="w-full px-4 py-2 rounded-md bg-[#111] text-gray-200 border border-gray-700 focus:border-[#20d78d] outline-none"
                      />
                      {hobbieErrors.hobby && <p className="text-red-500 text-sm mt-1">{hobbieErrors.hobby}</p>}
                    </div>

                    {/* Add Hobby Button */}
                    <button
                      type="submit"
                      disabled={hobbieLoading}
                      className={` font-semibold py-2 rounded-lg transition-all ${hobbieLoading
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600  text-white hover:bg-blue-700"
                        }`}
                    >
                      {hobbieLoading ? "Adding..." : "Add hobby"}
                    </button>
                  </div>

                  {/* hobbies List Display (You'd map over your state array here) */}
                  <div className="mb-4">
                    <h4 className="text-md text-gray-300 mb-2">Current Hobbies:</h4>
                    {allData.hobbies.slice().reverse().map((p) => (
                      <span key={p._id} className="inline-flex items-center text-sm bg-[#20d78d]/20 text-[#20d78d] px-3 py-1 rounded-full mr-2 mb-2">
                        {p.hobby}
                        <button
                          type="button"
                          onClick={() => hobbiesHandleDelete(p._id)}
                          className="ml-2 h-4 w-4 flex items-center justify-center text-red-400 hover:text-red-500 rounded-full focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PortfolioEditorModal;