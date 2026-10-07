import { Inter, Martian_Mono } from "next/font/google";

/**
 * Interface, titles and cards. The reading text is Georgia, which every
 * system already has, so the body costs no download at all.
 */
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/** Code only. Narrowed so a long line fits the column. */
const mono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-martian",
});

/**
 * Shared because `global-not-found.tsx` renders its own document: it bypasses
 * the layout by design, so anything the layout puts on `<html>` has to be
 * repeated there or the 404 arrives unstyled and in the wrong theme.
 */
export const htmlClass = `${sans.variable} ${mono.variable} h-full antialiased`;

/**
 * Runs before first paint, so the page never renders in the wrong theme.
 * Reading this on the server instead would opt every route into dynamic
 * rendering, and next/script defers inline content past the first paint, which
 * is the one thing this cannot do.
 *
 * It owns the whole rule, not just the first paint: the class (what is painted)
 * and `data-theme-choice` (what the reader picked) are two facts, because
 * "system" resolved to dark is indistinguishable from "dark" by class alone.
 * `window.__theme.set` is how the control changes it, so the resolution logic
 * exists once instead of being mirrored in TypeScript.
 */
export const applyTheme = `(function(){var K="theme",r=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function read(){try{return localStorage.getItem(K)||"system"}catch(e){return "system"}}function apply(c){r.dataset.themeChoice=c;r.classList.toggle("dark",c==="dark"||(c==="system"&&m.matches))}window.__theme={set:function(c){try{localStorage.setItem(K,c)}catch(e){}apply(c);dispatchEvent(new Event("themechoice"))}};m.addEventListener("change",function(){if(read()==="system")apply("system")});apply(read())})()`;
