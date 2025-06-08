'use client'

import Navbar from '../components/Navbar'
import { ChartAreaInteractive } from '@/components/ChartArea'
import { ChartBarDefault } from '@/components/ChartBar'
import DisasterTable from '@/components/DisasterTable'
import dynamic from 'next/dynamic'

// Dynamically import WorldGlobe to avoid SSR issues
const DynamicWorldGlobe = dynamic(() => import('@/components/WorldGlobe'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center">
      <Navbar />
      <DynamicWorldGlobe />
      <div className="my-10 mx-2 grid grid-cols-2 gap-3 h-auto max-h-[400px] w-auto">
        <ChartAreaInteractive />
        <ChartBarDefault />
      </div>
      <DisasterTable />
    </main>
  )
}
