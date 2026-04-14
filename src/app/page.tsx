"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, Pause } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Zmienne do efektu Tilt (Glassmorphism card)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Obsługa powrotu do początku po zakończeniu pliku audio
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const randomSeeds = React.useMemo(() => {
    return Array.from({ length: 24 }).map(() => ({
      height: Math.random() * 60 + 40,
      duration: Math.random() * 0.3,
      delay: Math.random() * 0.2,
    }));
  }, []);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-12 overflow-hidden perspective-1000">

      {/* Niewidzialny plik audio */}
      <audio
        ref={audioRef}
        src="/intro.mp3"
        type="audio/mpeg"
        preload="auto"
        onEnded={handleAudioEnded}
      />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Kontener Glassmorphism */}
        <motion.div
          animate={{ y: [0, -8, 0] }} // Floating animation
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative w-full rounded-3xl bg-black/40 backdrop-blur-[25px] border border-white/10 p-8 md:p-12 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Delikatny świetlisty blob w rogu samej karty */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Avatar z efektem Ping */}
          <div className="relative mb-6">
            <div className="ping-border-animation absolute inset-0 rounded-full" />
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden bg-white shadow-2xl">
              <Image src="/avatar_1.png" alt="Jakub Łaski Profile" fill className="object-cover object-center scale-[1.31] translate-y-6" />

              {/* Overlay: wewnętrzna ramka nachodząca NA zdjęcie, by ukryć białe przerwy przy ramionach */}
              <div className="absolute inset-0 rounded-full border-[8px] border-black md:border-[12px] z-20 pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-[4px] border-accent z-30 pointer-events-none" />
            </div>
          </div>

          {/* Nagłówek */}
          <h1
            style={{ transform: "translateZ(30px)" }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2"
          >
            Jakub Łaski
          </h1>
          <p
            style={{ transform: "translateZ(20px)" }}
            className="text-sm md:text-md text-slate-300 font-light mb-8"
          >
            Applied Computer Science Engineer <br className="md:hidden" /> | AI & Full-Stack Developer
          </p>

          {/* AI Voice Player & Visualizer */}
          <div
            style={{ transform: "translateZ(40px)" }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-inner"
          >
            <button
              onClick={toggleAudio}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-accent text-white hover:bg-orange-500 transition-colors focus:outline-none focus:ring-4 focus:ring-accent/30"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" translate="yes" style={{ transform: "translateX(2px)" }} />}
            </button>

            {/* Visualizer (Modyfikowane przez animacje CSS/Framer) */}
            <div className="flex-1 flex items-center justify-center gap-1 h-8 px-4 overflow-hidden">
              {randomSeeds.map((seed, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? ["20%", `${seed.height}%`, "20%"] : "10%",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isPlaying ? 0.4 + seed.duration : 0.5,
                    ease: "easeInOut",
                    delay: seed.delay,
                  }}
                  className={`w-1.5 rounded-full ${isPlaying ? 'bg-accent' : 'bg-white/20'}`}
                  style={{ minHeight: "4px" }}
                />
              ))}
            </div>
          </div>

          {/* Footer - Socials */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="w-full flex justify-center gap-6 mt-4"
          >
            <a
              href="https://github.com/xaski404"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.26c3-.3 6-1.5 6-6.4a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.15-3.8s-1.2-.38-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.62 5 2 5 2a5.3 5.3 0 0 0-.15 3.8A5.4 5.4 0 0 0 3 9.6c0 4.9 3 6.1 6 6.4A4.8 4.8 0 0 0 8 19v3"></path></svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jakub-%C5%82aski-274a4b370/"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>

        </motion.div>
      </motion.div>
    </main >
  );
}
