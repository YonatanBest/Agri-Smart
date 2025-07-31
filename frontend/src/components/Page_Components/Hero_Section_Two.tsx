"use client"

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { BarChart, Brain, Cloud, Leaf, ShieldCheck, Tractor } from "lucide-react";


const HeroSectionTwo: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.set(headerRef.current, {
      borderRadius: 0,
      left: 0,
      xPercent: 0,
      width: "100%",
      top: 0,
      boxShadow: "0",
      background: "rgba(255,255,255,0)",
      border: "none",
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 30) {
        setScrolled(true);
        gsap.to(headerRef.current, {
          duration: 0.15,
          borderRadius: 24,
          left: "50%",
          xPercent: -50,
          width: "95vw",
          maxWidth: 768,
          top: 16,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
          border: "1px solid #e5e7eb",
          ease: "power2.inOut",
        });
      } else {
        setScrolled(false);
        gsap.to(headerRef.current, {
          duration: 0.15,
          borderRadius: 0,
          left: 0,
          xPercent: 0,
          width: "100%",
          maxWidth: "100vw",
          top: 0,
          background: "rgba(255,255,255,0)",
          boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",
          border: "none",
          ease: "power2.inOut",
        });
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Animated Header */}
      <div
        ref={headerRef}
        className="fixed z-50 flex items-center justify-between px-6 py-3 w-full"
        style={{
          top: 0,
          left: 0,
          color: scrolled ? "#111" : "#fff", // fallback for text
          background: scrolled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <span className={`flex font-bold text-lg transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}>
          <Leaf className={`h-6 w-6 ${scrolled ? "text-green-600" : "text-white"}`} />
          Agrilo
        </span>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {["Products", "Solutions", "About-Us"].map((item) => (
            <a
              key={item}
              href="#"
              className={`hover:underline transition-colors duration-300 ${scrolled ? "text-black" : "text-white"}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-300
              ${scrolled
                ? "bg-primary text-white hover:bg-green-900"
                : "bg-white text-gray-900 hover:bg-white/40"}
            `}
          >
            Let's Contact
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section
            className="w-full py-12 sm:py-15 md:py-20 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/img-4.webp')" }}
          >
            {/* Overlay for darkening the background image */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />
            <div className="top-13 md:top-0 container mx-auto px-2 sm:px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center text-center gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4 w-full max-w-xl sm:max-w-2xl">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold tracking-tighter text-white break-words drop-shadow-lg">
                    Empowering Farmers with Intelligent AI Solutions
                  </h1>
                  <p className="max-w-[90vw] sm:max-w-[700px] text-green-100 text-[10px] xs:text-base sm:text-lg md:text-[15px] mx-auto">
                    Agrilo provides cutting-edge artificial intelligence to optimize crop yields, manage resources, and predict market trends for a more sustainable and profitable future.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row justify-center w-full max-w-xs sm:max-w-md mx-auto">
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                    <Link href="/map-section">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-green-100 text-green-700 hover:bg-green-700 hover:text-white w-full sm:w-auto"
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
                <div className="w-full flex justify-center mt-6 sm:mt-8">
                  {/* <Image
                    src="/placeholder.svg?height=550&width=600"
                    width={320}
                    height={220}
                    alt="AI-powered farming"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover w-full h-auto max-w-[90vw] sm:max-w-[400px] md:max-w-[600px]"
                    priority
                  /> */}
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Key Features</h2>
                  <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI solutions are designed to address the most pressing challenges faced by modern farmers.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Tractor className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Precision Farming</h3>
                  <p className="text-gray-500">
                    Optimize planting, irrigation, and harvesting with data-driven insights.
                  </p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Brain className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Disease Detection</h3>
                  <p className="text-gray-500">Early identification of crop diseases and pests to minimize losses.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Cloud className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Weather Prediction</h3>
                  <p className="text-gray-500">
                    Accurate localized weather forecasts to plan farming activities effectively.
                  </p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <BarChart className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
                  <p className="text-gray-500">Predict market prices and demand to make informed selling decisions.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <ShieldCheck className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Resource Optimization</h3>
                  <p className="text-gray-500">Efficiently manage water, fertilizer, and energy consumption.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <div className="flex justify-center mb-2">
                    <Leaf className="h-10 w-10 text-green-600" />
        </div>
                  <h3 className="text-xl font-bold text-gray-900">Sustainable Practices</h3>
                  <p className="text-gray-500">
                    Promote eco-friendly farming methods for long-term environmental health.
                  </p>
        </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionTwo;
