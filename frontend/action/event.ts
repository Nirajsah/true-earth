'use server'

export async function getFireEvents(from: string, to: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/fire_events?from=${from}&to=${to}`
  )
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return await res.json()
}

export async function getQuakeEvents(from: string, to: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/quake_events?from=${from}&to=${to}`
  )
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return await res.json()
}
