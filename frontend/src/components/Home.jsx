import React, { useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // smaller bundle

export default function Home({ started }) {
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    await started();
    setLoading(false);
  };

  // Initialize the particles engine
  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  // Particle configuration (neon wires / dots)
  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: { value: 50 },
      color: { value: "#20d78d" },
      links: {
        enable: true,
        color: "#20d78d",
        opacity: 0.4,
        width: 1,
        distance: 150,
      },
      move: {
        enable: true,
        speed: 1,
        outModes: "bounce",
      },
      opacity: { value: 0.6 },
      size: { value: 2 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative h-screen bg-[#1b1b1b] text-white overflow-hidden">
      {/* Particles background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute top-0 left-0 w-full h-full"
        />
      )}

      {/* Foreground content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl mt-[10vh] md:text-6xl lg:text-7xl font-bold max-w-4xl">
          Craft Your Professional Portfolio. Instantly.{" "}
          <span className="text-[#20d78d]">With AI.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          Go from concept to a published, stunning portfolio website in
          minutes, powered by intelligent content suggestions.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-[#20d78d] text-white font-semibold mt-10 px-10 py-4 cursor-pointer rounded-lg
                         transition-all duration-300 ease-in-out
                         hover:bg-[#29d490] hover:shadow-lg hover:shadow-[#7beabb]/40
                         transform hover:-translate-y-0.5"
        >
          {loading ? (
            <span className="animate-spin">Loading...</span>
          ) : (
            "Start Building Your Portfolio"
          )}
        </button>
      </div>
    </div>
  );
}
