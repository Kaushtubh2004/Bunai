import React, { useState } from 'react';

const Navbar = ({ started }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    await started();
    setLoading(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#1b1b1b]/80 border-b border-[#2c2c2c] shadow-[0_0_20px_rgba(32,215,141,0.05)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand Name */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img
                className="h-10 w-auto"
                src="../images/logo.png"
                alt="Brand Logo"
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-[#20d78d] to-[#5ef2b3] bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(32,215,141,0.3)]">
                BunAi
              </span>
            </div>
          </div>

          {/* Right-side Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={handleGetStarted}
              className="bg-[#20d78d]/90 text-black font-semibold px-5 py-2.5 rounded-lg cursor-pointer 
                         transition-all duration-300 ease-in-out
                         hover:bg-[#20d78d] hover:shadow-[0_0_15px_rgba(32,215,141,0.6)]
                         backdrop-blur-md active:scale-95"
            >
              {loading ? (
                <span className="animate-spin text-sm text-[#1b1b1b]">Loading...</span>
              ) : (
                'Get Started'
              )}
            </button>
          </div>

          {/* Hamburger Menu Icon (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-[#20d78d] hover:bg-[#2a2a2a]/60 focus:outline-none focus:ring-2 focus:ring-[#20d78d]/30"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-700 ease-in-out bg-[#1b1b1b]/80 backdrop-blur-lg border-t border-[#2c2c2c]`}
        id="mobile-menu"
      >
        <div className="px-3 py-3 space-y-3">
          <button
            onClick={handleGetStarted}
            className="bg-[#20d78d]/90 text-black font-semibold w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(32,215,141,0.6)] active:scale-95"
          >
            {loading ? (
              <span className="animate-spin text-sm text-[#1b1b1b]">Loading...</span>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
