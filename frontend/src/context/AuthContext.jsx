import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverUrl = "https://bunai-bgja.onrender.com/api/v1/users";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // 1️⃣ get token from storage

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${serverUrl}/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // 2️⃣ send token to backend
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Invalid token");

        const data = await res.json();
        console.log("Auth check response:", data);

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.replace("/");
  };

  // ✅ Add Portfolio
  const addPortfolio = async (portfolio) => {
    if (!user) return;

    try {
      const res = await fetch(`${serverUrl}/addPortfolio?userId=${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(portfolio),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create portfolio");

      setUser((prev) => ({
        ...prev,
        portfolios: [...(prev.portfolios || []), data.data],
      }));

      return data.data;
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  // ✅ Fetch User Portfolios
  const fetchPortfolios = async (userId) => {
    if (!userId) return [];

    try {
      const res = await fetch(`${serverUrl}/portfolios?userId=${userId}`, {
        method: "GET",

      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch portfolios");

      return data.data;
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      return [];
    }
  };

  // ✅ Delete Portfolio and related data
  const deletePortfolio = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deletePortfolio/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete portfolio");

      return data.data;
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  // ✅ Add User Details
  const addUserDetails = async (userDetails, portfolioId) => {
    if (!portfolioId) {
      console.error("Portfolio ID is missing");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const formData = new FormData();
      for (const key in userDetails) {
        if (userDetails[key] !== null && userDetails[key] !== undefined) {
          formData.append(key, userDetails[key]);
        }
      }

      const res = await fetch(
        `${serverUrl}/addUserDetails?userId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user details");

      // ✅ Update user context safely
      setUser((prev) => ({
        ...prev,
        userDetails: [...(prev.userDetails || []), data.data],
      }));

      return data.data;
    } catch (error) {
      console.error("Error creating user details:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ add Social links
  const addSocialLinks = async (socialLinks, portfolioId) => {
    if (!portfolioId) {
      console.error("Portfolio ID is missing");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/addSocialLinks?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ portfolioId, ...socialLinks }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save social links");

      // ✅ Update user context properly
      setUser((prev) => ({
        ...prev,
        socialLinks: data.data, // replaces or sets new value
      }));

      return data.data;
    } catch (error) {
      console.error("Error adding social links:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ add Skills
  const addSkills = async (skillData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/addSkills?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(skillData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save skill");

      return data.data;
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ add Project
  const addProject = async (projectData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const formData = new FormData();

      Object.entries(projectData).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await fetch(
        `${serverUrl}/addProject?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save project");

      return data.data;
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ add Certificate
  const addCertificate = async (certificateData, portfolioId) => {
    if (!portfolioId) {
      console.error("Portfolio ID is missing");
      return;
    }

    try {
      const formData = new FormData();

      // Certificate fields
      Object.entries(certificateData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add portfolio id to formData
      formData.append("portfolioId", portfolioId);

      const res = await fetch(`${serverUrl}/addCertificate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save certificate");

      return data.data;

    } catch (error) {
      console.error("Error adding certificate:", error);
      alert("Authorization failed. Please log in again.");
    }
  };


  // ✅ add Education
  const addEducation = async (educationData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/addEducation?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(educationData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save education");

      return data.data;
    } catch (error) {
      console.error("Error adding education:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ add Experience
  const addExperience = async (experienceData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/addExperience?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(experienceData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save experience");

      return data.data;
    } catch (error) {
      console.error("Error adding experience:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ Add Hobbies
  const addHobbies = async (hobbiesData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/addHobbies?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            hobby: hobbiesData.hobby,  // Ensure it's sent as JSON
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save hobbies");

      return data.data;
    } catch (error) {
      console.error("Error adding hobbies:", error);
      alert("Authorization failed. Please log in again.");
    }
  };

  // ✅ generate using ai
  const generateUsingAI = async (text) => {
    if (!text || !text.trim()) {
      alert("Enter a few details about yourself first!");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.success) {
        return data.about;
      } else {
        alert(data.message || "Failed to generate about section");
        return null;
      }
    } catch (err) {
      console.error(err);
      alert("Server error occurred.");
      return null;
    }
  };

  // ✅ fetch all data
  const fetchAllData = async (portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {
      const res = await fetch(`${serverUrl}/fetchAllData?portfolioId=${portfolioId}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch all data");

      return data.data;
    } catch (error) {
      console.error("Error fetching all data:", error);
      return [];
    }
  };

  // ✅ Delete skills
  const deleteSkills = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteSkills?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ Delete project
  const deleteProject = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteProject?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ Delete certificate
  const deleteCertificate = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteCertificate?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ Delete education
  const deleteEducation = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteEducation?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ Delete experience
  const deleteExperience = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteExperience?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ Delete hobbies
  const deleteHobbies = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`${serverUrl}/deleteHobbies?itemId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      return data.data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ update Theme of Portfolio 
  const updateThemePortfolio = async (theme, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");


    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${serverUrl}/updateThemePortfolio?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ theme }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "updated theme");

      return data.data;
    } catch (error) {
      console.error("Error update in theme:", error);
      return [];
    }
  }

  // ✅ fetch all data using username
  const fetchAllDataUsingUsername = async (username) => {
    if (!username) return console.error("username is missing");

    try {
      const res = await fetch(`${serverUrl}/fetchAllDataUsingUsername?username=${username}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch all data");

      return data.data;
    } catch (error) {
      console.error("Error fetching all data:", error);
      return [];
    }
  };

  // ✅ add message
  const addMessage = async (messageData, portfolioId) => {
    if (!portfolioId) return console.error("Portfolio ID is missing");

    try {

      const res = await fetch(
        `${serverUrl}/addMessage?portfolioId=${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save message");

      return data.data;
    } catch (error) {
      console.error("Error adding message:", error);
      alert("Authorization failed. Please log in again.");
    }
  }

  // ✅ fetch messages
  const fetchMessages = async (portfolioId) => {
    if (!portfolioId) return console.error("portfolio id  is missing");

    try {
      const res = await fetch(`${serverUrl}/fetchMessages?portfolioId=${portfolioId}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch messages");

      return data.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  //add visits
  const addVisits = async (pageId) => {

    if (!pageId) return console.error("Page ID is missing");

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/users/addVisits?pageId=${pageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to visit");

      return data.data;
    } catch (error) {
      console.error("Error adding visit:", error);
    }
  }

  // fetch Visits
  const fetchVisits = async (pageId) => {
    if (!pageId) return console.error("Page ID is missing");

    try {
      const res = await fetch(
        `${serverUrl}/fetchVisits?pageId=${pageId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch visits");

      return data;
    } catch (error) {
      console.error("Error fetching visit count:", error);
    }
  };



  return (
    <AuthContext.Provider value={{
      user,
      loading,
      logout,
      addPortfolio,
      fetchPortfolios,
      deletePortfolio,
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
      deleteHobbies,
      updateThemePortfolio,
      fetchAllDataUsingUsername,
      addMessage,
      fetchMessages,
      addVisits,
      fetchVisits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
