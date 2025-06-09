// src/app/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Page() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
}

function HomePage() {
  const { data: session, status } = useSession();
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrollY, setScrollY] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [charN, setCharN] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [online, setOnline] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const featRef = useRef<HTMLElement>(null);

  const words = [
    "Advanced Moderation.",
    "XP & Leveling.",
    "Premium Unlocks.",
    "Powerful & Easy.",
  ];

  // 1) Init AOS, loader, scroll, theme & cookies, online count
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setOnline(50 + Math.floor(Math.random() * 200));

    // Loader simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setPct(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setVisible(true), 500);
      }
    }, 50);

    // Scroll listener
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);

    // Theme & cookies from localStorage
    setTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");
    setCookies(localStorage.getItem("cookiesAccepted") === "yes");

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 2) Persist theme
  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3) Typewriter effect
  useEffect(() => {
    const full = words[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charN === full.length) setDeleting(true);
        else setCharN((c) => c + 1);
      } else {
        if (charN === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % words.length);
        } else {
          setCharN((c) => c - 1);
        }
      }
    }, deleting ? 50 : 120);
    return () => clearTimeout(timeout);
  }, [charN, deleting, idx]);

  // 4) Canvas animations: background, hero particles, confetti
  useEffect(() => {
    // BACKGROUND PARTICLES
    const bgCanvas = document.getElementById(
      "backgroundCanvas"
    ) as HTMLCanvasElement;
    const bgCtx = bgCanvas.getContext("2d")!;
    let w = window.innerWidth,
      h = window.innerHeight;
    class Particle {
      x = Math.random() * w;
      y = Math.random() * h;
      r = Math.random() * 2 + 1;
      dx = (Math.random() - 0.5) * 1.5;
      dy = (Math.random() - 0.5) * 1.5;
      alpha = Math.random() * 0.5 + 0.3;
      update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > w) this.dx *= -1;
        if (this.y < 0 || this.y > h) this.dy *= -1;
      }
      draw() {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        bgCtx.fill();
      }
    }
    function resizeBG() {
      w = bgCanvas.width = window.innerWidth;
      h = bgCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeBG);
    resizeBG();
    const particles: Particle[] = Array.from({ length: 100 }, () => new Particle());
    function animateBG() {
      bgCtx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateBG);
    }
    animateBG();

    // HERO PARTICLES
    const heroCanvas = document.getElementById(
      "particleCanvas"
    ) as HTMLCanvasElement;
    const heroCtx = heroCanvas.getContext("2d")!;
    let hw = heroCanvas.parentElement!.offsetWidth,
      hh = heroCanvas.parentElement!.offsetHeight;
    class HP extends Particle {
      constructor() {
        super();
        this.dx *= 0.5;
        this.dy *= 0.5;
        this.alpha = 0.2;
        this.r = Math.random() * 1.5 + 0.5;
        this.x = Math.random() * hw;
        this.y = Math.random() * hh;
      }
    }
    function resizeHero() {
      hw = heroCanvas.width = heroCanvas.parentElement!.offsetWidth;
      hh = heroCanvas.height = heroCanvas.parentElement!.offsetHeight;
    }
    window.addEventListener("resize", resizeHero);
    resizeHero();
    const hps: HP[] = Array.from({ length: 60 }, () => new HP());
    function animateHero() {
      heroCtx.clearRect(0, 0, hw, hh);
      hps.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateHero);
    }
    animateHero();

    // CONFETTI
    const confCanvas = document.getElementById(
      "confettiCanvas"
    ) as HTMLCanvasElement;
    const confCtx = confCanvas.getContext("2d")!;
    let confParts: any[] = [];
    function confResize() {
      confCanvas.width = window.innerWidth;
      confCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", confResize);
    confResize();
    ;(window as any).startConf = () => {
      confParts = [];
      for (let i = 0; i < 150; i++) {
        const p = new Particle();
        p.y = Math.random() * -confCanvas.height;
        p.x = Math.random() * confCanvas.width;
        (p as any).sp = Math.random() * 3 + 2;
        (p as any).tilt = Math.random() * 10 - 10;
        (p as any).ts = Math.random() * 0.1 + 0.05;
        (p as any).upd = function () {
          this.y += this.sp;
          this.x += Math.sin(this.y / 10);
          this.tilt += this.ts;
          if (this.y > confCanvas.height) {
            this.y = -10;
            this.x = Math.random() * confCanvas.width;
          }
        };
        (p as any).draw = function () {
          confCtx.beginPath();
          confCtx.lineWidth = this.r / 2;
          confCtx.strokeStyle = `hsl(${Math.random() * 360},70%,60%)`;
          confCtx.moveTo(this.x + this.tilt + this.r / 2, this.y);
          confCtx.lineTo(
            this.x + this.tilt,
            this.y + this.tilt + this.r / 2
          );
          confCtx.stroke();
        };
        confParts.push(p);
      }
      function loopConf() {
        confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
        confParts.forEach((p) => {
          (p as any).upd();
          (p as any).draw();
        });
        requestAnimationFrame(loopConf);
      }
      loopConf();
      setTimeout(() => {
        confCanvas.style.opacity = "0";
      }, 3000);
    };

    // cleanup
    return () => {
      window.removeEventListener("resize", resizeBG);
      window.removeEventListener("resize", resizeHero);
      window.removeEventListener("resize", confResize);
    };
  }, []);

  // scroll helper
  const scrollToRef = (r: React.RefObject<HTMLElement>) => {
    setNavOpen(false);
    r.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* 1) LOADER */}
      { !visible && (
        <div
          id="loader"
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 transition-opacity duration-500"
        >
          <div className="spinner w-24 h-24 border-8 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <div className="mt-2 text-xl font-mono text-indigo-300">{pct}%</div>
        </div>
      ) }

      {/* 2) CONTENT */}
      <div
        id="content"
        className={`pt-12 ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      >
        {/* BACKGROUND */}
        <canvas id="backgroundCanvas" className="fixed inset-0 -z-10" />

        {/* DISCORD BAR */}
        <div className="fixed top-0 w-full bg-gray-900 text-indigo-400 p-2 flex justify-end z-50">
          {status === "loading" ? (
            <div className="w-6 h-6 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : session ? (
            <button
              onClick={() => (window.location.href = "/api/auth/signout")}
              className="bg-red-600 px-4 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/api/auth/signin/discord")}
              className="bg-indigo-700 px-4 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>

        {/* HEADER */}
        <header
          className={`sticky top-0 backdrop-blur-md z-40 transition-all ${
            scrollY > 30 ? "py-2" : "py-6"
          } ${theme === "light" ? "bg-white/80" : "bg-gray-800/80"}`}
        >
          <div className="container mx-auto flex justify-between items-center px-6 max-w-6xl">
            <h1 className="text-3xl font-bold text-indigo-400 animate-pulse">
              Clarivex
            </h1>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToRef(heroRef)}
                className="group relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-400 after:w-0 hover:after:w-full transition-all"
              >
                Home
              </button>
              <button
                onClick={() => scrollToRef(featRef)}
                className="group relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-400 after:w-0 hover:after:w-full transition-all"
              >
                Features
              </button>
              {["/pricing", "/tos", "/privacy", "/support"].map((p) => (
                <Link
                  key={p}
                  href={p}
                  className="group relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-400 after:w-0 hover:after:w-full transition-all"
                >
                  {p.replace("/", "").toUpperCase()}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setTheme((t) => (t === "dark" ? "light" : "dark"))
                }
                className="p-2 rounded-full"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                className="md:hidden flex flex-col gap-1"
                onClick={() => setNavOpen((o) => !o)}
              >
                <span
                  className={`block w-6 h-1 bg-indigo-400 transition-transform ${
                    navOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-1 bg-indigo-400 transition-opacity ${
                    navOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-1 bg-indigo-400 transition-transform ${
                    navOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          {navOpen && (
            <nav className="md:hidden bg-gray-800 text-indigo-400 p-6 space-y-4">
              <button onClick={() => scrollToRef(heroRef)}>Home</button>
              <button onClick={() => scrollToRef(featRef)}>Features</button>
              {["/pricing", "/tos", "/privacy", "/support"].map((p) => (
                <Link key={p} href={p}>
                  {p.replace("/", "").toUpperCase()}
                </Link>
              ))}
            </nav>
          )}
        </header>

        {/* HERO */}
        <section
          id="hero"
          ref={heroRef}
          className="relative text-center py-32 overflow-hidden"
        >
          <div className="absolute inset-0 animated-gradient" />
          <canvas
            id="particleCanvas"
            className="absolute inset-0 -z-10"
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-300 animate-text">
              {words[idx].slice(0, charN)}
              <span className="inline-block w-1 h-10 bg-indigo-400 animate-caret ml-1" />
            </h2>
            <p className="text-xl sm:text-2xl text-indigo-200 mb-12 animate-fade-in">
              The ultimate Discord bot for server management, advanced tools & premium
              features.
            </p>
            <button
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() =>
                setTimeout(() => setTooltip(false), 300)
              }
              className="bg-white dark:bg-gray-900 dark:text-white text-gray-900 py-3 px-6 rounded-full shadow-lg animate-bounce"
            >
              Join Discord
            </button>
            {tooltip && (
              <div className="absolute bg-indigo-600 text-white text-sm py-1 px-3 rounded -mt-12 left-1/2 transform -translate-x-1/2 animate-fade-in">
                Users online: {online}
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          ref={featRef}
          className="bg-gray-900 py-20"
          data-aos="fade-up"
        >
          <div className="container mx-auto grid md:grid-cols-3 gap-10 px-6 max-w-6xl">
            {["Advanced Moderation", "XP & Levels", "Premium Unlocks"].map(
              (t) => (
                <div
                  key={t}
                  className="bg-gray-800 p-8 rounded-xl hover:scale-105 transform transition"
                >
                  <h3 className="text-2xl mb-4 text-indigo-300">{t}</h3>
                  <p className="text-gray-400">Description...</p>
                  <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:scale-105">
                    Learn More
                  </button>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA & CONFETTI */}
        <section className="text-center py-16 bg-gray-900">
          <button
            onClick={() => (window as any).startConf()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-full animate-pulse"
          >
            Get Started Now
          </button>
        </section>
        <canvas
          id="confettiCanvas"
          className="fixed inset-0 pointer-events-none opacity-0 transition-opacity"
        />

        {/* FOOTER */}
        <footer className="bg-gray-900 text-indigo-400 py-6 border-t border-gray-700 text-center animate-fade-in">
          <Link href="/tos" className="mx-2 hover:text-indigo-300">
            TOS
          </Link>
          |
          <Link href="/privacy" className="mx-2 hover:text-indigo-300">
            Privacy
          </Link>
          |
          <Link href="/support" className="mx-2 hover:text-indigo-300">
            Support
          </Link>
          <p className="mt-4">&copy; 2025 Clarivex</p>
        </footer>

        {/* COOKIE BANNER */}
        {!cookies && (
          <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between animate-fade-in-up">
            <span>Usiamo cookie per migliorare la tua esperienza.</span>
            <button
              onClick={() => {
                localStorage.setItem("cookiesAccepted", "yes");
                setCookies(true);
              }}
              className="bg-indigo-500 px-4 rounded"
            >
              Accetta
            </button>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .animated-gradient {
          background: linear-gradient(-45deg, #4f46e5, #3b82f6, #06b6d4, #8b5cf6);
          background-size: 400% 400%;
          animation: gradientBG 20s ease infinite;
        }
        @keyframes gradientBG {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
        @keyframes textMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text {
          background-size: 200% 200%;
          animation: textMove 5s ease infinite;
        }
        @keyframes caretBlink {
          0%,50% { opacity:1; }
          50.1%,100% { opacity:0; }
        }
        .animate-caret {
          animation: caretBlink 1s steps(1) infinite;
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(100%); }
          to { opacity:1; transform:translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out both;
        }
      `}</style>
    </>
  );
}