import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusClassName(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "reviewed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-green-100 text-green-800";
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Beklemede";
    case "reviewed":
      return "İncelendi";
    default:
      return "İletişime Geçildi";
  }
}