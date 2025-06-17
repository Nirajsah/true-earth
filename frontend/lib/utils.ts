import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available on the server')
  }
  let id: string = sessionStorage.getItem('sessionId') || ''
  if (!id) {
    id = crypto.randomUUID() // or use a strong random generator
    sessionStorage.setItem('sessionId', id)
  }
  return id
}
