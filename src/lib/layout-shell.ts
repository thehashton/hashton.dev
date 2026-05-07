/**
 * Content rail — Tailwind-only width constraints (avoids `100vw` scrollbar bugs on mobile).
 * Slightly tighter horizontal padding on small screens so copy uses the viewport.
 */
export const shellClass =
  "mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-5 md:px-6";

export const shellProseClass =
  "mx-auto w-full min-w-0 max-w-[900px] px-3 sm:px-5 md:px-6";
