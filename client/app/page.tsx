'use client'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { ChartAreaInteractive } from '@/components/ChartArea'
import { ChartBarDefault } from '@/components/ChartBar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <div className="my-10 mx-2 grid grid-cols-2 gap-3 h-auto max-h-[400px] w-auto">
        <ChartAreaInteractive />
        <ChartBarDefault />
      </div>
    </main>
  )
}
