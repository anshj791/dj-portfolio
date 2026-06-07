import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function yearsSince(startYear: number) {
  return Math.max(0, new Date().getFullYear() - startYear);
}
