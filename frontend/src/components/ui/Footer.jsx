import React from "react";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#1b1b1b] text-gray-300 overflow-hidden">
     
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#20d78d] to-transparent animate-glowLine"></div>

      <div className="relative z-10 mx-auto px-6 py-10 text-center backdrop-blur-md bg-[#1b1b1b]/40 shadow-[0_-2px_15px_rgba(32,215,141,0.1)]">
        <h2 className="text-[#20d78d] text-xl font-semibold mb-2 tracking-wide">
          BunAi
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Empowering your creativity with AI-driven portfolio building.
        </p>

        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="#"
            className="p-3 rounded-full bg-[#20d78d]/10 hover:bg-[#20d78d]/20 transition-all duration-300 hover:shadow-[0_0_15px_#20d78d]"
          >
            <Github className="text-[#20d78d]" size={22} />
          </a>
          <a
            href="#"
            className="p-3 rounded-full bg-[#20d78d]/10 hover:bg-[#20d78d]/20 transition-all duration-300 hover:shadow-[0_0_15px_#20d78d]"
          >
            <Linkedin className="text-[#20d78d]" size={22} />
          </a>
          <a
            href="#"
            className="p-3 rounded-full bg-[#20d78d]/10 hover:bg-[#20d78d]/20 transition-all duration-300 hover:shadow-[0_0_15px_#20d78d]"
          >
            <Mail className="text-[#20d78d]" size={22} />
          </a>
          
        </div>
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} BunAi — All rights reserved.
        </p>
      </div>

      {/* ✨ Animated Glow Line Keyframes */}
      <style>{`
        @keyframes glowLine {
          0% { transform: translateX(-100%); opacity: 0.2; }
          50% { transform: translateX(100%); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0.2; }
        }
        .animate-glowLine {
          animation: glowLine 6s linear infinite;
          background: linear-gradient(90deg, transparent, #20d78d, transparent);
        }
      `}</style>
    </footer>
  );
}
