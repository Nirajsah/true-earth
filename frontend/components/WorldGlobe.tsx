'use client'

import React, { useState } from 'react'
import NewWorldGlobe from './NewWorldGlobe'

const WorldGlobe = () => {
  const [timeRange, setTimeRange] = useState('90d') // State for the time range selection

  return (
    // Replaced Card with a div and applied Tailwind classes for styling
    <div className="relative w-full max-w-[1280px] h-[700px] mx-auto my-10 flex flex-col items-center justify-start overflow-hidden border rounded-lg">
      {/* Replaced CardHeader with a div */}
      <div className="flex absolute top-0 left-0 w-full justify-between items-center gap-2 py-4 px-6 sm:flex-row z-10">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="hidden w-[160px] rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 sm:ml-auto sm:flex cursor-pointer"
            aria-label="Select a value"
          >
            <option value="90d">Last 3 months</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
          </select>
          {/* Custom arrow for select, mimicking shadcn select trigger */}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 sm:hidden">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
            </svg>
          </span>
        </div>
        {/* Replaced Select, SelectTrigger, SelectContent, SelectItem, SelectValue with standard HTML select */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="hidden w-[160px] rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 sm:ml-auto sm:flex cursor-pointer"
            aria-label="Select a value"
          >
            <option value="90d">Last 3 months</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
          </select>
          {/* Custom arrow for select, mimicking shadcn select trigger */}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 sm:hidden">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
            </svg>
          </span>
        </div>
      </div>
      {/* This div will hold the D3-generated SVG */}

      <NewWorldGlobe />
    </div>
  )
}

export default WorldGlobe
