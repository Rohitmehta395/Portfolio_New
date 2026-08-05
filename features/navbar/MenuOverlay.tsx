"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/nav-links";
import { SOCIAL_LINKS } from "@/constants/social-links";
import { siteConfig } from "@/config/site.config";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useLenis } from "@/hooks/useLenis";
import { gsap } from "@/lib/gsap/registerPlugins";
import { X, ArrowUpRight } from "lucide-react";
import { LuffyFloat } from "@/components/ui/LuffyFloat";
import { HandwrittenText } from "@/components/ui/HandwrittenText";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();

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
      const leftPanelLines =
        overlayRef.current.querySelectorAll(".left-panel-line");

      const pageElements = ["header", "#main-content", "footer"];

      if (isOpen) {
        gsap.killTweensOf([
          overlayRef.current,
          links,
          footerElements,
          leftPanelLines,
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
            leftPanelLines,
            { scale: 1.5, y: 50, opacity: 0 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "back.out(1.2)",
            },
            "-=0.5",
          )
          .fromTo(
            links,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.6",
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
    { scope: overlayRef, dependencies: [isOpen, pathname] },
  );

  const renderLeftPanelContent = () => {
    switch (pathname) {
      case "/journey":
        return (
          <>
            <h1 className="left-panel-line flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 tracking-tight leading-none mb-4">
              <span className="font-extrabold font-display text-4xl md:text-5xl lg:text-6xl text-black">
                My
              </span>
              <span className="font-cursive text-[#8B5CF6] font-normal text-5xl md:text-6xl lg:text-7xl transform -rotate-1 py-1 leading-none">
                <HandwrittenText>Journey</HandwrittenText>
              </span>
            </h1>
            <p className="left-panel-line text-sm md:text-base lg:text-lg text-black/70 max-w-lg text-center leading-relaxed font-normal normal-case tracking-normal">
              A detailed narrative of my software engineering career, milestones, and personal evolution.
            </p>
          </>
        );

      case "/works":
        return (
          <>
            <h1 className="left-panel-line flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 tracking-tight leading-none mb-4">
              <span className="font-extrabold font-display text-4xl md:text-5xl lg:text-6xl text-black">
                My
              </span>
              <span className="font-cursive text-[#8B5CF6] font-normal text-5xl md:text-6xl lg:text-7xl transform -rotate-1 py-1 leading-none">
                <HandwrittenText>Works</HandwrittenText>
              </span>
            </h1>
            <p className="left-panel-line text-sm md:text-base lg:text-lg text-black/70 max-w-lg text-center leading-relaxed font-normal normal-case tracking-normal">
              A showcase of web applications, SaaS products, and mobile experiences engineered for performance, scale, and refined UX.
            </p>
          </>
        );

      case "/experience":
        return (
          <>
            <h1 className="left-panel-line flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 tracking-tight leading-none mb-4">
              <span className="font-extrabold font-display text-4xl md:text-5xl lg:text-6xl text-black">
                My
              </span>
              <span className="font-cursive text-[#8B5CF6] font-normal text-5xl md:text-6xl lg:text-7xl transform -rotate-1 py-1 leading-none">
                <HandwrittenText>Experience</HandwrittenText>
              </span>
            </h1>
            <p className="left-panel-line text-sm md:text-base lg:text-lg text-black/70 max-w-lg text-center leading-relaxed font-normal normal-case tracking-normal">
              A timeline of my professional journey, engineering roles, and software projects.
            </p>
          </>
        );

      default:
        return (
          <>
            <div className="left-panel-line flex items-center justify-center gap-2">
              HELLO, I&apos;M{" "}
              <span className="font-cursive font-normal text-[clamp(1.75rem,3.5vw,3.5rem)] tracking-normal transform -rotate-2 -mt-1 md:-mt-2 text-black/90">
                <HandwrittenText>{siteConfig.author}</HandwrittenText>
              </span>
            </div>

            <div className="left-panel-line flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              A
              <span className="relative w-16 md:w-20 lg:w-24 h-8 md:h-10 lg:h-12 bg-gray-100 rounded-full overflow-hidden shadow-sm border border-black/10 flex-shrink-0 inline-flex">
                <Image
                  src="/images/laptop.png"
                  fill
                  className="object-cover"
                  alt="Laptop"
                />
              </span>
              SOFTWARE DEVELOPER
            </div>

            <div className="left-panel-line flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              WHO
              <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#8b5cf6] rounded-full text-white flex-shrink-0 shadow-sm">
                <ArrowUpRight
                  className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                  strokeWidth={2.5}
                />
              </span>
              CRAFTS{" "}
              <span className="font-cursive lowercase font-normal text-[clamp(1.75rem,3.5vw,3.5rem)] tracking-normal transform -rotate-2 mt-1 text-black/90">
                <HandwrittenText>creative</HandwrittenText>
              </span>
            </div>

            <div className="left-panel-line flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              DIGITAL
              <span className="relative w-16 md:w-20 lg:w-24 h-8 md:h-10 lg:h-12 bg-gray-200 rounded-full overflow-hidden shadow-sm border border-black/10 flex-shrink-0 inline-flex">
                <Image
                  src="/images/abstract.png"
                  fill
                  className="object-cover"
                  alt="Abstract faces"
                />
              </span>
              EXPERIENCES
            </div>
          </>
        );
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-[#111111] opacity-0 invisible"
      aria-hidden={!isOpen}
    >
      {/* Left Panel */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex w-full lg:w-[60%] lg:h-full bg-white lg:rounded-r-[40px] p-8 md:p-12 lg:p-20 flex-col justify-center items-center relative overflow-hidden text-black z-10 shadow-2xl"
      >
        <div className="w-full flex flex-col items-center justify-center z-10 relative">
          <div className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-bold normal-case leading-tight tracking-tight flex flex-col items-center text-center gap-3 md:gap-4 w-full">
            {renderLeftPanelContent()}
          </div>
        </div>
      </div>


      {/* Right Panel */}
      <div
        ref={rightPanelRef}
        className="w-full lg:w-[40%] h-full bg-[#111111] p-8 md:p-12 lg:p-20 flex flex-col justify-center relative z-0"
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
            <h4 className="text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3 lg:mb-8 font-semibold menu-footer-item">
              Sitemap
            </h4>
            <div className="flex flex-col gap-2 lg:gap-5">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="menu-link-item overflow-hidden">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white hover:text-white/70 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3 lg:mb-6 font-semibold menu-footer-item">
              Follow
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] md:text-xs font-bold tracking-[0.15em] uppercase">
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
          </div>
        </div>

        {/* Bottom Left Links */}
        <div className="absolute bottom-6 left-8 md:bottom-12 md:left-12 lg:bottom-12 lg:left-28 flex flex-col lg:flex-row gap-y-4 lg:gap-x-10 text-[15px] md:text-xs font-bold tracking-[0.15em] uppercase z-10">
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

        {/* Luffy Float */}
        <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 menu-footer-item">
          <LuffyFloat />
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;
