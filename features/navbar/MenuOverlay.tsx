"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants/nav-links";
import { SOCIAL_LINKS } from "@/constants/social-links";
import { siteConfig } from "@/config/site.config";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useLenis } from "@/hooks/useLenis";
import { gsap } from "@/lib/gsap/registerPlugins";
import { X } from "lucide-react";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const GhostIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 0C8.954 0 0 8.954 0 20v20l6.667-6.667L13.333 40l6.667-6.667L26.667 40l6.667-6.667L40 40V20C40 8.954 31.046 0 20 0z"
      fill="#FF0000"
    />
    <circle cx="12" cy="16" r="4" fill="white" />
    <circle cx="28" cy="16" r="4" fill="white" />
    <circle cx="14" cy="16" r="2" fill="#0000FF" />
    <circle cx="30" cy="16" r="2" fill="#0000FF" />
  </svg>
);

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Control body scroll & Lenis smooth scroll locking
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, lenis]);

  // GSAP animation context for staggered entrance & exit
  useGsapContext(
    () => {
      if (!overlayRef.current) return;

      const links = overlayRef.current.querySelectorAll(".menu-link-item");
      const footerElements =
        overlayRef.current.querySelectorAll(".menu-footer-item");

      const pageElements = ["header", "#main-content", "footer"];

      if (isOpen) {
        gsap.killTweensOf([
          overlayRef.current,
          links,
          footerElements,
          ...pageElements,
        ]);

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0,
        })
          .fromTo(
            overlayRef.current,
            { x: "100vw" },
            { x: "0vw", duration: 0.8, ease: "power4.out" },
          )
          .to(
            pageElements,
            { x: "-100vw", duration: 0.8, ease: "power4.out" },
            "<",
          )
          .fromTo(
            links,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.4",
          )
          .fromTo(
            footerElements,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
            "-=0.5",
          );
      } else {
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        tl.to(overlayRef.current, {
          x: "100vw",
          duration: 0.6,
        })
          .to(pageElements, { x: "0vw", duration: 0.6 }, "<")
          .to(overlayRef.current, {
            autoAlpha: 0,
            duration: 0,
          });
      }
    },
    { scope: overlayRef, dependencies: [isOpen] },
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-[#111111] opacity-0 invisible"
      aria-hidden={!isOpen}
    >
      {/* Left Panel */}
      <div
        ref={leftPanelRef}
        className="w-full lg:w-[60%] h-[55%] lg:h-full bg-white lg:rounded-r-[40px] p-8 md:p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden text-black z-10 shadow-2xl"
      >
        <div className="max-w-4xl z-10 relative">
          <h1 className="text-[clamp(2rem,6vw,5.5rem)] lg:text-[clamp(2.5rem,4vw,5.5rem)] font-bold uppercase leading-[1.1] tracking-tight">
            HELLO, I&apos;M{" "}
            <span className="font-cursive lowercase font-normal text-[clamp(2.5rem,8vw,6.5rem)] lg:text-[clamp(3.5rem,5vw,6.5rem)] tracking-normal inline-block transform -rotate-2 -ml-1 -mb-1 md:-ml-2 md:-mb-2 text-black/90">
              {siteConfig.author}
            </span>
            <br />
            SOFTWARE DEVELOPER
            <br />
            CRAFTS{" "}
            <span className="font-cursive lowercase font-normal text-[clamp(2.5rem,8vw,6.5rem)] lg:text-[clamp(3.5rem,5vw,6.5rem)] tracking-normal inline-block transform -rotate-2 mt-1 -ml-1 md:mt-2 md:-ml-2 text-black/90">
              creative
            </span>
            <br />
            EXPERIENCES
          </h1>
        </div>

        {/* Decorative Image */}
        <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 xl:bottom-16 xl:left-20 w-[clamp(6rem,12vw,12rem)] h-[clamp(3rem,6vw,6rem)] bg-gray-200 rounded-full overflow-hidden shadow-lg border-2 border-black transform -rotate-3 z-0">
          <Image
            src="/images/abstract.png"
            fill
            className="object-cover"
            alt="Decorative"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div
        ref={rightPanelRef}
        className="w-full lg:w-[40%] h-[45%] lg:h-full bg-[#111111] p-8 md:p-12 lg:p-20 flex flex-col justify-center relative z-0"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 lg:top-12 lg:right-12 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all z-50"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8 lg:space-y-16 lg:pl-8">
          {/* Sitemap */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 lg:mb-8 font-semibold menu-footer-item">
              Sitemap
            </h4>
            <div className="flex flex-col gap-2 lg:gap-5">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="menu-link-item overflow-hidden">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white hover:text-white/70 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 lg:mb-6 font-semibold menu-footer-item">
              Follow
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-footer-item text-white hover:text-white/70 transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mt-6 lg:mt-16">
              <Link
                href="/contact"
                onClick={onClose}
                className="menu-footer-item text-white hover:text-white/70 transition-colors"
              >
                Get In Touch
              </Link>
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="menu-footer-item text-white hover:text-white/70 transition-colors"
              >
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* Pacman Icon */}
        <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 text-white menu-footer-item">
          <GhostIcon />
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;
