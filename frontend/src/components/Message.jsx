import React, { useState, useEffect, useCallback } from "react";
import { X, User, Mail, MessageSquare } from "lucide-react"; 
import { useAuth } from "../context/AuthContext";

const Message = ({ userId }) => {
  const [userPortfolios, setUserPortfolios] = useState([]); // Renamed for clarity
  const { fetchPortfolios, fetchMessages } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // Renamed for clarity
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [messages, setMessages] = useState([]); // Corrected typo 'messgaes'
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // New state for loading messages

  // 1. Fetch Portfolios
  const loadPortfolios = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchPortfolios(userId);
      setUserPortfolios(data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    }
  }, [userId, fetchPortfolios]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // 2. Fetch Messages for a specific Portfolio
  const loadMessages = useCallback(async (portfolioId) => {
    if (!portfolioId) return;
    setIsLoadingMessages(true);
    try {
      const data = await fetchMessages(portfolioId);
      setMessages(data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [fetchMessages]);

  const handlePortfolioClick = (portfolio) => {
    setActivePortfolio(portfolio);
    setIsModalOpen(true);
    loadMessages(portfolio._id); // Call the message fetch function
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-4 md:p-12">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#20d78d] mb-2">
          Messages
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Select a portfolio below to see the messages.
        </p>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPortfolios.length === 0 ? (
          <div className="text-gray-400 col-span-full">
            No portfolios found. Create one to see messages.
          </div>
        ) : (
          userPortfolios.map((portfolio) =>
            // Check for userDetails is good, but filtering here handles it better
            portfolio && portfolio.userDetails ? ( 
              <div key={portfolio._id} className="relative">
                {/* CARD */}
                <div
                  onClick={() => handlePortfolioClick(portfolio)}
                  className="bg-[#1b1b1b] rounded-xl shadow-2xl border border-gray-700 hover:border-[#20d78d] transition-all duration-300 cursor-pointer p-6 space-y-4"
                >
                  <h2 className="text-2xl font-bold">{portfolio.title}</h2>
                  <h3 className="text-gray-400">{portfolio.tagline}</h3>
                </div>
              </div>
            ) : null
          )
        )}
      </div>

      {/* Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] rounded-2xl p-6 w-full max-w-5xl border border-gray-800 max-h-[95vh] overflow-y-auto relative">

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 bg-[#1b1b1b] rounded-full z-10"
              aria-label="Close messages"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-700">
              <h2 className="text-3xl font-bold text-[#20d78d]">
                Messages
              </h2>
              <p className="text-xl text-gray-200 mt-1">
                Selected Portfolio:{" "}
                <span className="font-extrabold">{activePortfolio?.title}</span>
              </p>
            </div>

            {/* Messages List */}
            {isLoadingMessages ? (
              <div className="text-center text-gray-400 py-10">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                No messages found for this portfolio.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reverse the array and map for chronological order (newest first) */}
                {[...messages].reverse().map((m, index) => (
                  <div key={index} className="bg-[#1b1b1b] p-5 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-[#20d78d]" />
                        <span className="text-lg font-semibold text-white">{m.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{m.email}</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[#0e0e0e] rounded-lg border border-gray-800">
                      <p className="text-gray-300 whitespace-pre-wrap">{m.message}</p>
                    </div>

                    {m.createdAt && (
                      <p className="text-xs text-right text-gray-500 mt-2">
                         Received: {new Date(m.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Message