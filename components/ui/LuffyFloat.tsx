"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface LuffyFloatProps {
  /** Tailwind width/height classes for responsive sizing */
  sizeClassName?: string;
  className?: string;
}

export function LuffyFloat({
  sizeClassName = "w-16 h-16 md:w-28 md:h-28 lg:w-36 lg:h-36",
  className = "",
}: LuffyFloatProps) {
  return (
    <motion.div
      className={`relative drop-shadow-[0_8px_24px_rgba(255,255,255,0.15)] ${sizeClassName} ${className}`}
      // Main floating bob — slow, dreamy up-and-down
      animate={{
        y: [0, -14, 0, -8, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Slight tilt / sway layered on top */}
      <motion.div
        className="w-full h-full"
        animate={{
          rotate: [-3, 3, -2, 4, -3],
          x: [0, 5, -3, 4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Subtle scale "breathing" */}
        <motion.div
          className="w-full h-full"
          animate={{
            scale: [1, 1.04, 1, 1.02, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/luffy.png"
            alt="Luffy – Gear 5"
            fill
            className="object-contain pointer-events-none select-none"
            sizes="(max-width: 768px) 64px, (max-width: 1024px) 112px, 144px"
            priority
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LuffyFloat;
