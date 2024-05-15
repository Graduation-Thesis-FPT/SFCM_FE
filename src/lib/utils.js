import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function removeEmptyValues(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== ""));
}

export function getFirstLetterOfLastWord(text) {
  if (!text) return "";
  const words = text.split(" ");
  const lastWord = words.pop();
  return lastWord ? lastWord[0].toUpperCase() : "";
}
