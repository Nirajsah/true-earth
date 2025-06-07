'use client'

import Navbar from '../components/Navbar'
import { ChartAreaInteractive } from '@/components/ChartArea'
import { ChartBarDefault } from '@/components/ChartBar'
import WorldGlobe from '../components/WorldGlobe'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <WorldGlobe />
      <div className="my-10 mx-2 grid grid-cols-2 gap-3 h-auto max-h-[400px] w-auto">
        <ChartAreaInteractive />
        <ChartBarDefault />
      </div>
    </main>
  )
}
