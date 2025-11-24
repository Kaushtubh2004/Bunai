import express from "express";
import {
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
  generateContent,
  fetchAllData,
  fetchAllDataUsingUsername,
  fetchMessage,
  addVisits,
  fetchVisits
} from "../controllers/user.controller.js";
import passport from "passport";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJwt} from "../middlewares/jwt.middleware.js";

const router = express.Router();

// Google OAuth routes
router.get("/google", googleScope);
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  googleAuthenticate);

// Optional success/fail routes (if needed for testing)
router.get("/login/success", verifyJwt, loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);
router.get("/portfolios", getPortfolios);
router.post("/addPortfolio", createPortfolio);
router.delete("/deletePortfolio/:id", deletePortfolio);
router.post(
  "/addUserDetails",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  addUserDetails
);
router.post("/addSocialLinks", addSocialLinks);
router.post("/addSkills",addSkills);
router.post("/addExperience",addExperience);
router.post("/addHobbies",addHobbies);
router.post("/addEducation",addEducation);
router.post("/addProject", upload.single("image"), addProject);
router.post("/addCertificate", upload.single("image"), addCertificate);
router.post("/generateContent", generateContent);
router.get("/fetchAllData",fetchAllData);
router.delete("/deleteSkills",deleteSkills);
router.delete("/deleteProject",deleteProject);
router.delete("/deleteCertificate",deleteCertificate);
router.delete("/deleteEducation",deleteEducation);
router.delete("/deleteExperience",deleteExperience);
router.delete("/deleteHobbies",deleteHobbies);
router.post("/updateThemePortfolio",updateThemePortfolio);
router.get("/fetchAllDataUsingUsername",fetchAllDataUsingUsername);
router.post("/addMessage",addMessage);
router.get("/fetchMessages",fetchMessage);
router.post("/addVisits",addVisits);
router.get("/fetchVisits",fetchVisits);


export default router;
