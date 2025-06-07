'use client'

import React from 'react'

const Navbar = () => {
  return (
    <nav className="sticky border-b top-0 z-50 p-4 bg-transparent backdrop-blur-xl w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">True Earth</h1>
        <div className="font-semibold">
          <a href="#" className="mx-2 hover:text-gray-300">
            Home
          </a>
          <a href="#" className="mx-2 hover:text-gray-300">
            About
          </a>
          <a href="#" className="mx-2 hover:text-gray-300">
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
