import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "") // Fix: \w matches letters, numbers, _
    .replace(/ +/g, "-");
}

export function formatDate(date:Date) : string{
    return new Intl.DateTimeFormat('en-US',{
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
}

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

