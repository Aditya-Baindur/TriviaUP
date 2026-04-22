import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn util
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
