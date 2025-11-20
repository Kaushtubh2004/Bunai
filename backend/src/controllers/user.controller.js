import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import passport from "../utils/passport.js";
import jwt from "jsonwebtoken";
import { Portfolio } from "../models/portfolio.models.js";
import { UserDetails } from "../models/userDetails.models.js";
import { SocialLinks } from "../models/socialLinks.models.js";
import { Skills } from "../models/skills.models.js";
import { Experience } from "../models/experience.models.js";
import { Hobbies } from "../models/hobbies.models.js";
import { Project } from "../models/projects.models.js";
import { Education } from "../models/education.models.js";
import { Certificate } from "../models/certificates.models.js";
import { Message } from "../models/message.models.js";
import { Visits } from "../models/visits.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";// for genai

// Login Failed
const loginFailed = asyncHandler(async (req, res) => {
  res.status(401).json(new ApiResponse(401, "Login failed"));
});

// Login Success
const loginSuccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication failed"));
  }
  res.status(200).json(new ApiResponse(200, "Login successful", { user: req.user }));
});

// Google OAuth Scope
const googleScope = passport.authenticate("google", {
  scope: ["profile", "email"]
});

// Google OAuth Authenticate
const googleAuthenticate = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new ApiError(401, "Authentication failed");

    const token = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    next(error);
  }
}

// Logout
const logout = asyncHandler(async (req, res) => {

  try {

    req.logout(err => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).json(new ApiResponse(500, "Logout failed"));
      }


      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      return res
        .status(200)
        .json(new ApiResponse(200, "Logged out successfully"));
    });
  } catch (error) {
    console.error("Logout Catch Error:", error);
    return res.status(500).json(new ApiResponse(500, "Logout failed"));
  }
});

// fetch portfolios
const getPortfolios = asyncHandler(async (req, res) => {

  const portfolios = await Portfolio.find({ user: req.query.userId });

  return res
    .status(200)
    .json(new ApiResponse(200, portfolios, "Portfolios fetched successfully"));
});

//add portfolio
const createPortfolio = asyncHandler(async (req, res) => {
  const { title, tagline } = req.body;
  const userId = req.query.userId;

  if (
    [title, tagline, userId].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //unique username genration
  function uniqueString() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }
  const uniqueValue = uniqueString();
  if (!uniqueValue) throw new ApiError(400, "error in genrating unique url")

  const newPortfolio = await Portfolio.create({
    user: userId,
    title,
    tagline,
    username: uniqueValue,
    theme: ""
  });

  const createdPortfolio = await Portfolio.findById(newPortfolio._id);

  if (!createdPortfolio) {
    throw new ApiError(500, "spmething went wrong while creating portfolio");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdPortfolio, "Portfolio created successfully"));

});

// update theme portfolio
const updateThemePortfolio = asyncHandler(async (req, res) => {
  const { theme } = req.body;
  const portfolioId = req.query.portfolioId;
  console.log(theme, portfolioId);

  if (!theme || !portfolioId) {
    throw new ApiError(400, "Theme and Portfolio Id is required");
  }


  // Find and update portfolio
  const updatedPortfolio = await Portfolio.findByIdAndUpdate(
    portfolioId,
    { theme },        // <-- correct field
    { new: true }
  );


  // Check if portfolio exists
  if (!updatedPortfolio) {
    throw new ApiError(404, "Portfolio not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedPortfolio, "Theme updated successfully")
  );
});


// DELETE PORTFOLIO and related all data ...
const deletePortfolio = asyncHandler(async (req, res) => {
  const { id: portfolioId } = req.params;

  const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);

  if (!deletedPortfolio) {
    throw new ApiError(404, "Portfolio not found");
  }

  await Promise.all([
    UserDetails.deleteMany({ portfolio: portfolioId }),
    SocialLinks.deleteMany({ portfolio: portfolioId }),
    Skills.deleteMany({ portfolio: portfolioId }),
    Experience.deleteMany({ portfolio: portfolioId }),
    Hobbies.deleteMany({ portfolio: portfolioId }),
    Project.deleteMany({ portfolio: portfolioId }),
    Education.deleteMany({ portfolio: portfolioId }),
    Certificate.deleteMany({ portfolio: portfolioId }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Portfolio and all related data deleted successfully")
    );
});

// adduserDetails
const addUserDetails = asyncHandler(async (req, res) => {
  const { name, role, email, phone, location, about } = req.body;
  const portfolioId = req.query.userId;
  const imageFile = req.files?.profileImage?.[0];
  const resumeFile = req.files?.resume?.[0];

  // Check required fields
  if (
    [name, role, email, phone, location, portfolioId].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Upload profile image if provided
  let profileImageUrl;
  if (imageFile?.path) {
    const uploadedImage = await uploadOnCloudinary(imageFile.path);
    if (!uploadedImage) throw new ApiError(400, "Failed to upload image to Cloudinary");
    profileImageUrl = uploadedImage.url;
  }

  // Upload resume if provided
  let resumeUrl;
  if (resumeFile?.path) {
    const uploadedResume = await uploadOnCloudinary(resumeFile.path);
    if (!uploadedResume) throw new ApiError(400, "Failed to upload resume to Cloudinary");
    resumeUrl = uploadedResume.url;
  }

  // Check if user details already exist for this portfolio
  let userDetails = await UserDetails.findOne({ portfolio: portfolioId });

  if (userDetails) {
    // Update existing user details
    userDetails.fullName = name;
    userDetails.role = role;
    userDetails.email = email;
    userDetails.phone = phone;
    userDetails.location = location;
    userDetails.about = about || userDetails.about;
    if (profileImageUrl) userDetails.profileImage = profileImageUrl;
    if (resumeUrl) userDetails.resumeLink = resumeUrl;

    await userDetails.save();

    return res
      .status(200)
      .json(new ApiResponse(200, userDetails, "User details updated successfully"));
  }

  // If no existing details, create new entry
  const newUser = await UserDetails.create({
    portfolio: portfolioId,
    fullName: name,
    role,
    email,
    phone,
    location,
    about,
    profileImage: profileImageUrl,
    resumeLink: resumeUrl,
  });

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while creating user details");
  }
  if (newUser) {
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      { userDetails: true },
      { new: true }
    );
  }


  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User details created successfully"));
});

// add social links
const addSocialLinks = asyncHandler(async (req, res) => {
  const { github, linkedin, twitter, instagram } = req.body;
  const portfolioId = req.query.portfolioId;

  if (!portfolioId) throw new ApiError(400, "Portfolio ID is required");

  const updatedLinks = await SocialLinks.findOneAndUpdate(
    { portfolio: portfolioId },
    { github, linkedin, twitter, instagram },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLinks, "Social links saved successfully"));
});

// add skills
const addSkills = asyncHandler(async (req, res) => {
  const { name, level, category } = req.body;
  const portfolioId = req.query.portfolioId;

  if (
    [portfolioId, name, level, category].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newSkill = await Skills.create({
    portfolio: portfolioId,
    name,
    level,
    category,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newSkill, "Skill added successfully"));
});

// DELETE SKILLS
const deleteSkills = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Skills.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Skill not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Skill deleted successfully"));
});

// add experience
const addExperience = asyncHandler(async (req, res) => {
  const { company, position, startDate, endDate, description } = req.body;
  const portfolioId = req.query.portfolioId;

  if (
    [portfolioId, company, position, startDate, endDate, description].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newExperience = await Experience.create({
    portfolio: portfolioId,
    company,
    position,
    startDate,
    endDate,
    description
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newExperience, "Experience added successfully"));
});

// DELETE EXPERIENCE
const deleteExperience = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Experience.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Experience not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Experience deleted successfully"));
});

// add hobbies
const addHobbies = asyncHandler(async (req, res) => {
  const { hobby } = req.body;
  const portfolioId = req.query.portfolioId;

  console.log(portfolioId);

  if (!portfolioId || !hobby)
    throw new ApiError(400, "Portfolio ID and hobby are required");

  const newHobby = await Hobbies.create({
    portfolio: portfolioId,
    hobby,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newHobby, "Hobby added successfully"));
});

// DELETE HOBBIES
const deleteHobbies = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Hobbies.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Hobby not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Hobby deleted successfully"));
});

// add project
const addProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, projectLink, githubLink } = req.body;
  const portfolioId = req.query.portfolioId;


  if (
    [portfolioId, title, description, techStack].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Upload project image to Cloudinary if available
  let imageUrl = "";
  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) throw new ApiError(400, "Image upload failed");
    imageUrl = uploadedImage.url;
  }

  const newProject = await Project.create({
    portfolio: portfolioId,
    title,
    description,
    techStack,
    projectLink,
    githubLink,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newProject, "Project added successfully"));
});

// DELETE PROJECT
const deleteProject = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Project.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Project not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// add education
const addEducation = asyncHandler(async (req, res) => {
  const { institution, degree, fieldOfStudy, startDate, endDate, grade } = req.body;
  const portfolioId = req.query.portfolioId;

  if (
    [portfolioId, institution, degree, fieldOfStudy, startDate, endDate, grade].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newEducation = await Education.create({
    portfolio: portfolioId,
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    grade,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newEducation, "Education record added successfully"));
});

// DELETE EDUCATION
const deleteEducation = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Education.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Education not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Education deleted successfully"));
});

// add certificate
const addCertificate = asyncHandler(async (req, res) => {
  const { title, issuer, issueDate, certificateLink } = req.body;
  const portfolioId = req.query.portfolioId;

  if (
    [portfolioId, title, issuer, issueDate].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Upload image if provided
  let imageUrl = "";
  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) throw new ApiError(400, "Image upload failed");
    imageUrl = uploadedImage.url;
  }

  const newCertificate = await Certificate.create({
    portfolio: portfolioId,
    title,
    issuer,
    issueDate,
    certificateLink,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newCertificate, "Certificate added successfully"));
});

// DELETE CERTIFICATE
const deleteCertificate = asyncHandler(async (req, res) => {
  const id = req.query.itemId;

  if (!id) {
    throw new ApiError(400, "id is required")
  }

  const deleted = await Certificate.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(404, "Certificate not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Certificate deleted successfully"));
});

// add message
const addMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const portfolioId = req.query.portfolioId;

  if ([portfolioId, name, email, message].some((f) => !f || String(f).trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newMessage = await Message.create({
    portfolio: portfolioId,
    name,
    email,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

// fetch message
const fetchMessage = asyncHandler(async (req, res) => {
  const portfolioId = req.query.portfolioId;

  if (!portfolioId) throw new ApiError(400, "portfolio id is required");

  const messages = await Message.find({ portfolio: portfolioId });

  if (!messages) throw new ApiError(400, " error in finding message");

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "messages fetched successfully"));

})

// genai controller
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generateContent = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(400, "About information is required");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(text);
  const generatedText = result.response.text();

  return res.status(200).json({
    success: true,
    about: generatedText,
  });

});

// fetch all portfolio data
const fetchAllData = asyncHandler(async (req, res) => {
  const portfolioId = req.query.portfolioId;

  if (!portfolioId) {
    throw new ApiError(400, "portfolioId is required")
  }

  const userDetails = await UserDetails.find({ portfolio: portfolioId });
  const socialLinks = await SocialLinks.find({ portfolio: portfolioId });
  const skills = await Skills.find({ portfolio: portfolioId });
  const projects = await Project.find({ portfolio: portfolioId });
  const certificates = await Certificate.find({ portfolio: portfolioId });
  const education = await Education.find({ portfolio: portfolioId });
  const experience = await Experience.find({ portfolio: portfolioId });
  const hobbies = await Hobbies.find({ portfolio: portfolioId });

  return res.status(200).json(
    new ApiResponse(200,
      {
        userDetails,
        socialLinks,
        skills,
        projects,
        certificates,
        education,
        experience,
        hobbies
      },
      "Portfolio data fetched successfully"
    )
  );

})

// fetch all data using username
const fetchAllDataUsingUsername = asyncHandler(async (req, res) => {
  const username = req.query.username;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const portfolio = await Portfolio.findOne({ username });
  if (!portfolio) {
    throw new ApiError(400, "Portfolio with this username doesn't exist");
  }

  const portfolioId = portfolio._id;

  const userDetails = await UserDetails.find({ portfolio: portfolioId });
  const socialLinks = await SocialLinks.find({ portfolio: portfolioId });
  const skills = await Skills.find({ portfolio: portfolioId });
  const projects = await Project.find({ portfolio: portfolioId });
  const certificates = await Certificate.find({ portfolio: portfolioId });
  const education = await Education.find({ portfolio: portfolioId });
  const experience = await Experience.find({ portfolio: portfolioId });
  const hobbies = await Hobbies.find({ portfolio: portfolioId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        portfolio,
        userDetails,
        socialLinks,
        skills,
        projects,
        certificates,
        education,
        experience,
        hobbies,
      },
      "Portfolio data fetched successfully"
    )
  );
});

// addvisits
const addVisits = asyncHandler(async (req, res) => {
  const pageId  = req.query.pageId;
  
  if(!pageId)throw new ApiError(400,"pageid is missing");

  await Visits.create({
    pageId,
  });

  res.json({ success: true });
});

// fetchVisits
const fetchVisits = asyncHandler(async (req, res) => {
  const pageId = req.query.pageId;

  if (!pageId) throw new ApiError(400, "page id required");

  // 1. Total visits
  const totalVisits = await Visits.countDocuments({ pageId });

  // 2. Last 5 months visits
  const lastFiveMonths = await Visits.aggregate([
    { $match: { pageId } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // latest first
    { $limit: 5 }
  ]);

  const formattedMonths = lastFiveMonths
    .map((m) => ({
      month: new Date(m._id.year, m._id.month - 1).toLocaleString("default", { month: "short" }),
      year: m._id.year,
      count: m.count,
    }))
    .reverse(); 

  // 3. Growth percentage
  let growth = 0;

  const currMonth = await Visits.countDocuments({
    pageId,
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lte: new Date(),
    },
  });

  const prevMonth = await Visits.countDocuments({
    pageId,
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  });

  if (prevMonth === 0 && currMonth > 0) {
    growth = 100; 
  } else if (prevMonth > 0) {
    growth = ((currMonth - prevMonth) / prevMonth) * 100;
  }

  res.json({
    pageId,
    totalVisits,
    growthPercentage: Math.round(growth),
    lastFiveMonths: formattedMonths,
  });
});



export {
  loginFailed,
  loginSuccess,
  googleAuthenticate,
  googleScope,
  logout,
  getPortfolios,
  createPortfolio,
  updateThemePortfolio,
  deletePortfolio,
  addUserDetails,
  addSocialLinks,
  addSkills,
  deleteSkills,
  addExperience,
  deleteExperience,
  addHobbies,
  deleteHobbies,
  addProject,
  deleteProject,
  addEducation,
  deleteEducation,
  addCertificate,
  deleteCertificate,
  addMessage,
  fetchMessage,
  generateContent,
  fetchAllData,
  fetchAllDataUsingUsername,
  addVisits,
  fetchVisits
};
