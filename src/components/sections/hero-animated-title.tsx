"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type HeroAnimatedTitleProps = {
  text: string;
  className?: string;
};

export function HeroAnimatedTitle({ text, className }: HeroAnimatedTitleProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return (
      <h1 className={cn("display-text max-w-[18ch] text-ink lg:text-[5rem] lg:leading-[0.98]", className)}>
        {text}
      </h1>
    );
  }

  return (
    <h1 className={cn("display-text max-w-[18ch] lg:text-[5rem] lg:leading-[0.98]", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="mr-4 inline-block last:mr-0">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wordIndex * 0.1 + letterIndex * 0.03,
                type: "spring",
                stiffness: 150,
                damping: 25,
              }}
              className="inline-block text-ink"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}
