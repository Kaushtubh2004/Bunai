import React, { useState, useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const NotFound = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

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
        <div className="relative h-screen bg-[#1b1b1b] text-white flex items-center justify-center overflow-hidden">

            {init && (
                <Particles
                    id="tsparticles"
                    options={particlesOptions}
                    className="absolute top-0 left-0 w-full h-full"
                />
            )}

            <div className="relative z-10 text-center">
                <h1 className="text-7xl font-extrabold text-[#20d78d] drop-shadow-[0_0_15px_#20d78d] animate-pulse">
                    404
                </h1>
                <p className="mt-3 text-xl text-[#20d78d]/80 tracking-wide">
                    Page Not Found
                </p>
            </div>

        </div>
    );
};

export default NotFound;
