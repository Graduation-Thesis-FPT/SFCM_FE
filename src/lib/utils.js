import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

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

export function rmLastAstAddBrk(str) {
  if (str.endsWith(" *")) {
    return `(${str.slice(0, -2)})`;
  } else {
    return `(${str})`;
  }
}

export function removeLastAsterisk(str) {
  if (str.endsWith(" *")) {
    return `${str.slice(0, -2)}`;
  } else {
    return str;
  }
}

export function formatVnd(value) {
  return Number(value).toLocaleString("it-IT", {
    style: "currency",
    currency: "VND"
  });
}

export const exportToExcel = (exportData, fileName) => {
  try {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName !== "" ? fileName : "SFCM.xlsx");
  } catch (error) {
    console.log(error);
  }
};
