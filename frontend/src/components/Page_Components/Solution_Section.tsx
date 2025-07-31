
"use client"

import { useRef } from "react" // Removed useEffect
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react" // Import useGSAP
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircleIcon, InfoIcon } from "lucide-react"
import Iphone15Pro from "../magicui/iphone-15-pro"

// Register ScrollTrigger plugin once globally
gsap.registerPlugin(ScrollTrigger)

export default function ScrollAnimation() {
  // Refs for the main section and the animated elements
  const sectionRef = useRef(null)
  const phoneRef = useRef(null)
  const faqContainerRef = useRef(null)
  const featuresContainerRef = useRef(null)
  const aboutUsContainerRef = useRef(null)

  // useGSAP hook for all GSAP animations within this component
  useGSAP(
    () => {
      // Get the DOM elements using their refs (current property)
      const phone = phoneRef.current
      const faqContainer = faqContainerRef.current
      const featuresContainer = featuresContainerRef.current
      const aboutUsContainer = aboutUsContainerRef.current

      // Stage 1: Initial View (Top of Scroll)
      // Set initial styles for the phone, FAQ container, Features container, and About Us container.
      gsap.set(phone, {
        width: "300px",
        height: "500px",
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
      })

      // FAQ container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(faqContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, effectively off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // Features container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(featuresContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // About Us container: Initially off-screen below, transparent, and set to its final size.
      gsap.set(aboutUsContainer, {
        width: "60%",
        height: "auto",
        position: "absolute",
        left: "10%",
        top: "100%", // Start 100% from the top, off-screen below
        xPercent: 0,
        yPercent: -50,
        opacity: 0,
        padding: "32px",
      })

      // Create a GSAP timeline for the scroll-triggered animation.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, // Use sectionRef.current as the trigger
          start: "top top",
          end: "+=1200", // Significantly reduced duration for faster animation
          scrub: true,
          pin: true,
          pinSpacing: true,
          // markers: true, // Uncomment for debugging
        },
      })

      // Phase 1: Phone moves right, FAQ slides in from bottom
      tl.to(
        phone,
        {
          left: "calc(100% - 25% - 20px)",
          xPercent: 0,
          ease: "power1.inOut",
        },
        0,
      )
        .to(
          faqContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          0,
        )

        // Phase 2: FAQ slides out top, Features slides in from bottom
        .to(
          faqContainer,
          {
            top: "0%",
            opacity: 0,
            ease: "power1.inOut",
          },
          "+=0.2",
        )
        .to(
          featuresContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          "<",
        )

        // Phase 3: Features slides out top, About Us slides in from bottom
        .to(
          featuresContainer,
          {
            top: "0%",
            opacity: 0,
            ease: "power1.inOut",
          },
          "+=0.2",
        )
        .to(
          aboutUsContainer,
          {
            top: "50%",
            opacity: 1,
            ease: "power1.inOut",
          },
          "<",
        )
    },
    { scope: sectionRef }, // The scope for useGSAP, automatically handles cleanup
  )

  // Define FAQ data
  const faqs = [
    {
      question: "What is GSAP?",
      answer: "GSAP is a JavaScript library for high-performance web animations.",
    },
    {
      question: "What is ScrollTrigger?",
      answer: "ScrollTrigger is a GSAP plugin for scroll-based animations and pinning.",
    },
    {
      question: "Is GSAP free?",
      answer: "GSAP is free for most projects; a Business Green license is for commercial uses.",
    },
  ]

  // Define Key Features data
  const features = [
    "Smooth Animations",
    "Scroll-Triggered Effects",
    "Responsive Design",
    "Easy Integration",
    "High Performance",
  ]

  // Define About Us content
  const aboutUsContent = {
    title: "About Our Platform",
    description:
      "Our platform is dedicated to providing cutting-edge solutions for modern web development. We focus on delivering intuitive user experiences with powerful, performant technologies like Next.js and GSAP. Our mission is to empower developers to create stunning, interactive web applications with ease.",
    mission: "Empowering developers to build the future of the web.",
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Phone element: Represents the phone device, initially centered */}
      <div
        ref={phoneRef}
        className="text-white text-2xl font-bold flex items-center justify-center rounded-3xl z-10"
      >
        <Iphone15Pro
          className="size-full"
          videoSrc="https://videos.pexels.com/video-files/8946986/8946986-uhd_1440_2732_25fps.mp4"
      />
      </div>

          {/* FAQ Toggles Container: Initially hidden, slides in, then slides out */}
      <div
        ref={faqContainerRef}
        className="bg-gray-100 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">FAQs</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Key Features Container: Initially hidden, slides in to replace FAQ, then slides out */}
      <div
        ref={featuresContainerRef}
        className="bg-purple-100 p-8 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* About Us Container: Initially hidden, slides in to replace Features */}
      <div
        ref={aboutUsContainerRef}
        className="bg-green-100 p-8 rounded-lg shadow-inner text-gray-800 max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <InfoIcon className="h-8 w-8 text-green-600" />
          {aboutUsContent.title}
        </h2>
        <p className="text-lg mb-4 text-center">{aboutUsContent.description}</p>
        <p className="text-md font-semibold text-center text-green-700">Mission: {aboutUsContent.mission}</p>
      </div>


     
    </section>
  )
}
