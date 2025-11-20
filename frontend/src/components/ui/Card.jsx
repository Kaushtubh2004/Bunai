import React from "react";

export default function Card() {
  return (
    <section className="relative w-full bg-[#1b1b1b] text-white py-20 px-6 md:px-16 overflow-hidden">
      {/* ✨ Floating Glow Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-3 h-3 bg-[#20d78d] rounded-full blur-md animate-pulseGlow top-10 left-1/4"></div>
        <div className="absolute w-2 h-2 bg-[#20d78d] rounded-full blur-sm animate-floatSlow bottom-16 right-1/3"></div>
        <div className="absolute w-4 h-4 bg-[#20d78d] rounded-full blur-lg animate-floatFast top-1/3 right-10"></div>
      </div>

      {/* 🌐 Content Grid */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* 💻 Image Card */}
        <div
          className="relative group rounded-2xl overflow-hidden
          bg-gradient-to-b from-[#1b1b1b]/80 to-[#111] backdrop-blur-md
          border border-[#20d78d]/30 shadow-[0_0_30px_rgba(32,215,141,0.1)]
          transition-all duration-500 hover:shadow-[0_0_45px_rgba(32,215,141,0.3)]
          hover:-translate-y-2"
        >
          {/* Glowing Border Animation */}
          <div className="absolute inset-0 rounded-2xl border-[1px] border-transparent group-hover:border-[#20d78d] transition-all duration-500"></div>

          {/* Image */}
          <img
            src="../images/laptop.jpg"
            alt="AI Portfolio Preview"
            className="w-full h-auto rounded-2xl opacity-90 group-hover:opacity-100 transition duration-500"
          />

          {/* Overlay Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-20 mix-blend-overlay"></div>
        </div>

        {/* 🧠 Text Section */}
        <div className="text-center md:text-left space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            <span className="text-[#20d78d]">AI-Powered</span> Portfolio Builder
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Create, design, and publish your personal portfolio instantly with
            the power of AI. Our intelligent content generator tailors your
            experience — from text to design — ensuring your website stands out
            in every detail.
          </p>
          <ul className="text-gray-400 space-y-2">
            <li>⚡ Smart content suggestions using AI</li>
            <li>🎨 Modern templates for any profession</li>
            <li>🖥️ Fully responsive and customizable</li>
            <li>🔒 Secure and fast hosting included</li>
          </ul>
        </div>
      </div>

      {/* 🎞️ Animation Keyframes */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-20px); opacity: 1; }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .animate-floatFast {
          animation: floatFast 4s ease-in-out infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
