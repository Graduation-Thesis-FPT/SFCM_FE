import { OrderStatus } from "@/constants/order-status";
import { clsx } from "clsx";
import { el } from "date-fns/locale";
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
  return Number(value)
    .toLocaleString("it-IT", {
      style: "currency",
      currency: "VND"
    })
    .replace(/\./g, " ");
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

export const getType = order => {
  if (order?.DE_ORDER_NO?.includes("XK")) {
    return OrderStatus.Export;
  } else if (order?.DE_ORDER_NO?.includes("NK")) {
    return OrderStatus.Import;
  }
};

export const bgAvatar = ROLE_ID => {
  switch (ROLE_ID) {
    case "admin":
      return `bg-red-500`;
    case "procedure-staff":
      return `bg-teal-500`;
    case "tally-operator":
      return `bg-orange-500`;
    case "warehouse-operator":
      return `bg-amber-900`;
    case "customer":
      return `bg-pink-500`;
    default:
      return `bg-slate-500`;
  }
};

export const changeMessage = mess => {
  if (mess.includes("Network Error")) {
    return "Lỗi kết nối mạng!";
  } else if (mess.includes("Maximum call")) {
    return "Dữ liệu quá lớn. Vui lòng kiểm tra lại dữ liệu!";
  } else if (mess.includes("Request failed with status code 500")) {
    return "Lỗi máy chủ. Vui lòng thử lại sau!";
  } else if (mess.includes("Request failed with status code 404")) {
    return "Không tìm thấy dữ liệu. Vui lòng thử lại sau!";
  } else if (
    mess.includes("[BKAV] [200] Thất bại: Không tồn tại Hóa đơn có PartnerInvoiceStringID:")
  ) {
    return "Hóa đơn không tồn tại hoặc đang chờ phê duyệt từ phần mềm kế toán. Vui lòng thử lại sau!";
  } else if (mess.includes("Error")) {
    return "Đã xảy ra lỗi. Vui lòng thử lại sau!";
  } else if (mess.includes("Request")) {
    return "Yêu cầu không hợp lệ. Vui lòng thử lại sau!";
  } else {
    return mess;
  }
};
