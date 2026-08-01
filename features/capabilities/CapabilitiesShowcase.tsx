"use client";

import { useRef, useEffect } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { gsap, ScrollTrigger } from "@/lib/gsap/registerPlugins";
import { CAPABILITIES_DATA } from "./capabilities.data";
import { CapabilityCard } from "./CapabilityCard";

export function CapabilitiesShowcase() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const numbersContainerRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    () => {
      // Execute pinned sequence on desktop viewports only
      if (typeof window === "undefined" || window.innerWidth < 768) return;
      if (!pinSectionRef.current || !cardsContainerRef.current) return;

      const cardElements = cardsContainerRef.current.querySelectorAll(
        ".capability-card-slide",
      );
      const numberElements =
        numbersContainerRef.current?.querySelectorAll(
          ".capability-number-slide",
        ) || [];
      const pillItems =
        pillsContainerRef.current?.querySelectorAll(".capability-pill-item") ||
        [];
      const pillTrack =
        pillsContainerRef.current?.querySelector(".capability-pill-track");

      if (cardElements.length < 2) return;

      const tl = gsap.timeline({
        paused: true,
      });

      ScrollTrigger.create({
        trigger: pinSectionRef.current,
        pin: true,
        start: "top top",
        end: `+=${(cardElements.length - 1) * 80}%`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Calculate the discrete slide index based on scroll progress
          const targetIndex = Math.round(self.progress * (cardElements.length - 1));
          
          // Animate the timeline to the exact time of that slide
          // Each slide transition is 0.8s in the timeline
          gsap.to(tl, {
            time: targetIndex * 0.8,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });

      // Initial setup: Stack all elements
      cardElements.forEach((card, i) => {
        if (i !== 0)
          gsap.set(card, { yPercent: 110, pointerEvents: "none" });
        else gsap.set(card, { yPercent: 0, pointerEvents: "auto" });
      });

      numberElements.forEach((num, i) => {
        if (i !== 0) gsap.set(num, { yPercent: 100 });
        else gsap.set(num, { yPercent: 0 });
      });

      const pillWidths: number[] = [];
      pillItems.forEach((item) => {
        pillWidths.push((item as HTMLElement).offsetWidth);
      });

      if (pillsContainerRef.current && pillWidths.length > 0) {
        gsap.set(pillsContainerRef.current, { width: pillWidths[0] });
      }

      const itemHeight = (pillItems[0] as HTMLElement)?.offsetHeight || 48;

      if (pillTrack) {
        gsap.set(pillTrack, { y: 0 });
      }

      // Crossfade through each capability card slide
      cardElements.forEach((card, i) => {
        if (i === 0) return;

        const prevCard = cardElements[i - 1];
        const num = numberElements[i];
        const prevNum = numberElements[i - 1];

        const label = `slide-${i}`;

        // Animate Cards
        tl.to(
          prevCard,
          {
            yPercent: -110,
            pointerEvents: "none",
            duration: 0.8,
            ease: "power2.inOut",
          },
          label,
        ).to(
          card,
          {
            yPercent: 0,
            pointerEvents: "auto",
            duration: 0.8,
            ease: "power2.inOut",
          },
          label,
        );

        // Animate Numbers
        if (num && prevNum) {
          tl.to(
            prevNum,
            { yPercent: -100, duration: 0.8, ease: "power2.inOut" },
            label,
          ).to(
            num,
            { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
            label,
          );
        }

        // Animate Pills
        if (pillsContainerRef.current && pillTrack && i < pillWidths.length) {
          tl.to(
            pillsContainerRef.current,
            { width: pillWidths[i], duration: 0.8, ease: "power2.inOut" },
            label,
          ).to(
            pillTrack,
            { y: -i * itemHeight, duration: 0.8, ease: "power2.inOut" },
            label,
          );
        }
      });

      // Refresh ScrollTrigger after pinned dimensions settle
      ScrollTrigger.refresh();
    },
    { scope: pinSectionRef },
  );

  // Force ScrollTrigger refresh after initial mount & layout stabilization
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-white dark:bg-black select-none transition-colors duration-300">
      {/* 1. MOBILE LAYOUT */}
      <div className="block md:hidden px-6 py-16">
        <div className="flex flex-col gap-3 mb-10 items-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-black dark:text-white flex items-center justify-center gap-3 transition-colors">
            What{" "}
            <span className="font-cursive text-indigo-500 dark:text-[#b19df7] font-light lowercase text-5xl -mt-2 transition-colors">
              I do
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-12">
          {CAPABILITIES_DATA.map((cap) => (
            <div key={cap.id} className="flex flex-col gap-6 items-center">
              <span className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-sm font-semibold w-fit transition-colors">
                {cap.pillCategory}
              </span>
              <CapabilityCard capability={cap} className="w-full" />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="border-2 border-black dark:border-white rounded-full px-6 py-3 text-sm font-bold uppercase flex items-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-black dark:text-white">
            View All Works
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={pinSectionRef}
        className="hidden md:flex flex-row w-full h-screen relative bg-white dark:bg-black overflow-hidden text-black dark:text-white items-center transition-colors duration-300"
      >
        {/* Left Side Container (40%) */}
        <div className="w-[40%] flex flex-col justify-between pl-12 lg:pl-20 pr-8 h-[80vh] min-h-[600px] relative z-10">
          {/* Huge Number Container */}
          <div
            className="relative w-full h-48 lg:h-64 overflow-hidden"
            ref={numbersContainerRef}
          >
            {CAPABILITIES_DATA.map((cap) => (
              <div
                key={`num-${cap.id}`}
                className="capability-number-slide absolute top-0 left-0 w-full h-full flex items-start"
              >
                <span className="text-[12rem] lg:text-[14rem] xl:text-[18rem] leading-[0.8] font-semibold tracking-tighter text-black dark:text-white transition-colors">
                  {cap.number}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Left: What I Do */}
          <div className="flex flex-col gap-6 w-full">
            <h2 className="text-6xl lg:text-7xl xl:text-8xl font-bold flex items-center gap-4 text-black dark:text-white transition-colors">
              What
              <span
                className="font-cursive text-[#b19df7] font-light text-7xl lg:text-8xl xl:text-9xl lowercase"
                style={{ fontFamily: "var(--font-cursive, cursive)" }}
              >
                I do
              </span>
            </h2>

            <div
              className="relative h-[48px] bg-black dark:bg-white rounded-full shadow-md overflow-hidden transition-colors"
              ref={pillsContainerRef}
            >
              <div className="absolute top-0 left-0 flex flex-col capability-pill-track">
                {CAPABILITIES_DATA.map((cap) => (
                  <div
                    key={`pill-${cap.id}`}
                    className="capability-pill-item h-[48px] px-6 flex items-center whitespace-nowrap text-white dark:text-black text-base lg:text-lg font-semibold w-max transition-colors"
                  >
                    {cap.pillCategory}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button className="border-2 border-black dark:border-white rounded-full px-6 py-2.5 text-xs lg:text-sm font-bold uppercase flex items-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-black dark:text-white w-fit">
                View All Works
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Container (60%) */}
        <div className="w-[60%] h-screen flex items-center justify-end relative z-20">
          <div className="w-full h-[96vh] relative overflow-hidden bg-[#171717] border-white/5 shadow-2xl rounded-r-none border-r-0 md:rounded-l-[2.5rem] transition-colors" ref={cardsContainerRef}>
            {CAPABILITIES_DATA.map((cap) => (
              <div
                key={`card-${cap.id}`}
                className="capability-card-slide absolute inset-0 w-full h-full flex items-center"
              >
                <CapabilityCard
                  capability={cap}
                  className="w-full h-full !bg-transparent !border-none !shadow-none !rounded-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesShowcase;
