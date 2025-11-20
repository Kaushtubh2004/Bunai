import React, { useState, useEffect } from "react";
import { X, Layout, CheckCircle, Link } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ---- TEMPLATE OPTIONS ----
const templates = [
  {
    id: 1,
    name: "Minimal",
    category: "Minimal",
    image: "../images/minimal.png",
    description: "Simple, clean layout with calm visual balance.",
  },
  {
    id: 2,
    name: "Premium",
    category: "Premium",
    image: "../images/premium.png",
    description: "Elegant layout with a refined, high-end feel.",
  },
  {
    id: 3,
    name: "Fresh",
    category: "Fresh",
    image: "../images/fresh.png",
    description: "Bright, lively layout with a modern touch.",
  },
  {
    id: 4,
    name: "Urban",
    category: "Urban",
    image: "../images/urban.png",
    description: "Bold, city-inspired layout with sharp edges.",
  },
  {
    id: 5,
    name: "Soft",
    category: "Soft",
    image: "../images/soft.png",
    description: "Gentle colors with a smooth, relaxed style.",
  },
  {
    id: 6,
    name: "Vibrant",
    category: "Vibrant",
    image: "../images/vibrant.png",
    description: "Energetic design with strong color impact.",
  },
];

const Template = ({ userId }) => {
  const { fetchPortfolios, updateThemePortfolio } = useAuth();
  const [userPortfolio, setUserPortfolio] = useState([]);

  const [open, setOpen] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);


  // ---- FETCH USER PORTFOLIOS ----
  const loadData = async () => {
    if (!userId) return;
    const data = await fetchPortfolios(userId);
    setUserPortfolio(data);
  };
  useEffect(() => {
    loadData();
  }, [userId]);

  // ---- SELECT TEMPLATE ----
  const handleTemplateSelect = async (theme, portfolioId) => {
    if (!portfolioId) return;

    setThemeLoading(true);

    try {
      const res = await updateThemePortfolio(theme, portfolioId);

      if (res) {
        setActivePortfolio((prev) => ({
          ...prev,
          theme: theme,
        }));
        await loadData();
      }

    } catch (err) {
      console.error("Error updating theme:", err);
      alert("Failed to update theme.");
    } finally {
      setThemeLoading(false); // <-- end loading
    }
  };


  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-4 md:p-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#20d78d] mb-2">
          Manage Portfolios
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Select a portfolio below to choose or change its design template.
        </p>
        <p className="text-sm text-green-500">Note : +Add atleast userdetails in portfolio to select theme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPortfolio.length === 0 ? (
          <div className="text-gray-400">
            No portfolios found. Create one to select a template.
          </div>
        ) : (
          [...userPortfolio].reverse().map((portfolio) =>
            portfolio.userDetails && (
              <div key={portfolio._id} className="relative">

                {/* CARD */}
                <div
                  onClick={() => {
                    setActivePortfolio(portfolio);
                    setOpen(true);
                  }}
                  className="bg-[#1b1b1b] rounded-xl shadow-2xl border border-gray-700 hover:border-[#20d78d] transition-all duration-300 cursor-pointer p-6 space-y-4"
                >
                  <h2 className="text-2xl font-bold">{portfolio.title}</h2>
                  <h3 className="text-gray-400">{portfolio.tagline}</h3>

                  <div className="pt-2 border-t border-gray-800 flex items-center text-lg">
                    <Layout size={20} className="mr-2 text-[#20d78d]" />
                    {portfolio.theme
                      ? `Template: ${portfolio.theme}`
                      : "No template selected"}
                  </div>
                </div>

                {portfolio.theme && (
                  <a
                    href={`http://localhost:5173/portfolio/${portfolio.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 right-3 bg-[#20d78d] hover:bg-[#18b375] text-black font-semibold px-3 py-1 rounded-lg flex items-center gap-1 text-sm shadow-md"
                  >
                    <Link size={16} />
                    Visit
                  </a>
                )}
              </div>
            )
          )
        )}

      </div>



      {/* ----- Modal ----- */}
      {
        open && activePortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#111] rounded-2xl p-6 w-full max-w-5xl border border-gray-800 max-h-[95vh] overflow-y-auto relative">

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 bg-[#1b1b1b] rounded-full"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="mb-6 pb-4 border-b border-gray-700">
                <h2 className="text-3xl font-bold text-[#20d78d]">
                  Template Selection
                </h2>
                <p className="text-xl text-gray-200 mt-1">
                  Editing Portfolio:{" "}
                  <span className="font-extrabold">{activePortfolio?.title}</span>
                </p>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((t) => {
                  const isSelected = activePortfolio?.theme === t.name;

                  return (
                    <div
                      key={t.id}
                      onClick={() => !themeLoading && handleTemplateSelect(t.name, activePortfolio._id)}
                      className={`bg-[#1b1b1b] rounded-xl shadow-xl border-4 transition-all cursor-pointer relative
                      ${isSelected
                          ? "border-[#20d78d] ring-4 ring-[#20d78d]/40"
                          : "border-gray-700 hover:border-gray-500"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1 bg-[#20d78d] rounded-full flex items-center justify-center">
                          {themeLoading ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle size={20} className="text-black" />
                          )}
                        </div>
                      )}


                      <div className="h-36 overflow-hidden rounded-t-xl">
                        <img src={t.image} className="w-full h-full object-cover" />
                      </div>

                      <div className="p-4">
                        <h3 className="text-xl font-bold">{t.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{t.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )
      }
    </div >
  );
};

export default Template;
