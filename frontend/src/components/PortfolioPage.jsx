import React, { useState, useEffect } from "react";
import { LucideTrash2 } from "lucide-react";
import PortfolioDetailsModal from "./ui/PortfolioDetailsModal";
import { useAuth } from "../context/AuthContext";

const PortfolioPage = ({userId}) => {
  const { user, addPortfolio, fetchPortfolios, deletePortfolio } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    tagline: ""
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch portfolios when component loads
  useEffect(() => {
    const loadPortfolios = async () => {
      const data = await fetchPortfolios(userId);
      setPortfolios(data);
      
    };
    loadPortfolios();
  }, [userId]);
  
  // ✅ Create Portfolio (sends to backend)
  const handleCreate = async () => {
    if (!newPortfolio.title.trim() || !newPortfolio.tagline.trim()) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const created = await addPortfolio(newPortfolio);
      if (created) {
        setPortfolios((prev) => [...prev, created]);
        alert("Portfolio created successfully!");
      }
      setNewPortfolio({ title: "", tagline: "" });
      setShowPopup(false);
    } catch (error) {
      alert("Failed to create portfolio");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = window.prompt('Type "DELETE" to confirm deletion:');
    if (confirm !== "DELETE") return alert("Deletion cancelled.");

    try {
      const deleted = await deletePortfolio(id); // backend delete call
      if (deleted) {
        setPortfolios((prev) => prev.filter((p) => p._id !== id)); // update local state
      } else {
        alert("Failed to delete portfolio");
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Error deleting portfolio");
    }
  };


  return (
    <div className="p-6 min-h-screen bg-[#0e0e0e] text-gray-200">
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#20d78d] mb-2">
            {user ? `${user.name}'s Portfolios` : "My Portfolios"}
          </h1>
          <p className="mb-6 text-md pr-5 text-gray-400">
            Manage and customize your portfolio collection
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="px-3 py-1 bg-[#20d78d] text-black rounded-md font-medium hover:bg-[#18a46b]"
        >
          Create +
        </button>
      </div>

      {/* Portfolio List */}
      <div className="w-full p-4">
        {portfolios.length === 0 ? (
          <div className="text-gray-400">No portfolios found. Click "Create +" to add one.</div>
        ) : (
          [...portfolios].reverse().map((p) => (
            <div
              key={p._id}
              className="flex mb-2 rounded-lg overflow-hidden bg-[#1b1b1b] hover:shadow-[0_0_2px_#20d78d]"
            >
              <div
                onClick={() => setSelected(p)}
                className="p-3 w-full rounded-l-lg cursor-pointer transition-all"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-400">{p.tagline}</p>
              </div>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-4 rounded-r-md text-sm bg-[#1b1b1b] hover:text-red-500 flex items-center transition"
              >
                <LucideTrash2 />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Portfolio Details Modal */}
      {selected && (
        <PortfolioDetailsModal selected={selected} setSelected={setSelected} />
      )}
      {/* Create Portfolio Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl border border-gray-700 w-80 shadow-[0_0_15px_#20d78d30]">
            <h3 className="text-xl font-semibold text-[#20d78d] mb-4">
              Create Portfolio
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={newPortfolio.title}
              onChange={(e) =>
                setNewPortfolio({ ...newPortfolio, title: e.target.value })
              }
              className="w-full mb-3 p-2 rounded-md bg-[#1b1b1b] border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Tagline"
              value={newPortfolio.tagline}
              onChange={(e) =>
                setNewPortfolio({ ...newPortfolio, tagline: e.target.value })
              }
              className="w-full mb-3 p-2 rounded-md bg-[#1b1b1b] border border-gray-700 text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1 border border-gray-600 rounded-md hover:bg-[#1b1b1b]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-1 bg-[#20d78d] text-black rounded-md font-medium hover:bg-[#18a46b] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
