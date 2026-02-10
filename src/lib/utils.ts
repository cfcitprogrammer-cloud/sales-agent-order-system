import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCartId(): string {
  const now = new Date();

  // MMDDYY
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);

  // HHMMSS
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateTime = `${mm}${dd}${yy}${hh}${min}${ss}`;

  // Random 4 lowercase letters
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let randomChars = "";
  for (let i = 0; i < 4; i++) {
    randomChars += letters[Math.floor(Math.random() * letters.length)];
  }

  return `${dateTime}${randomChars}`;
}
