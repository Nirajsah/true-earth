import React, { useRef, useEffect, useState, useCallback } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import * as THREE from 'three'

const NewWorldGlobe = () => {
  const globeEl = useRef<any>(null) // Ref for the Globe component instance
  const [countries, setCountries] = useState({ features: [] }) // State for geographical country data
  const [hoverD, setHoverD] = useState(null) // State to track the hovered country
  const [fireEvents, setFireEvents] = useState<any>([]) // State for mock fire event data

  /**
   * Generates a set of mock fire event data.
   * Each event includes a unique ID, random latitude and longitude,
   * and a 'size' property used for the point's altitude.
   * @returns {Array<Object>} An array of mock fire event objects.
   */
  const generateMockFireEvents = () => {
    const events = []
    for (let i = 0; i < 70; i++) {
      // Generate 70 mock fire events for better distribution
      events.push({
        id: i,
        lat: Math.random() * 180 - 90, // Random latitude between -90 and +90
        lng: Math.random() * 360 - 180, // Random longitude between -180 and +180
        size: 0.1 + Math.random() * 0.05, // Slightly varying size for visual interest and altitude
      })
    }
    return events
  }

  // Effect hook to load the TopoJSON data and generate mock fire events when the component mounts
  useEffect(() => {
    // Fetch and process geographical data for countries
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then((res) => res.json())
      .then((topojsonData) => {
        // Convert TopoJSON to GeoJSON format
        const geojsonData: any = topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        )
        setCountries(geojsonData)
      })
      .catch((error) => console.error('Error loading TopoJSON:', error))

    // Generate and set mock fire event data
    setFireEvents(generateMockFireEvents())
  }, []) // Empty dependency array means this effect runs once on mount

  // Define material properties for the globe's 'water' surface
  // Using THREE.MeshLambertMaterial for a matte appearance
  const globeMaterial = new THREE.MeshLambertMaterial({
    // color: '#e0f2f7', // Light blue/cyan for water
    opacity: 1.0, // Set to 1.0 for opaque globe surface
    transparent: false, // Ensure full opacity
  })

  // Callback function for handling country hover events
  const onCountryHover = useCallback((polygon: any) => {
    setHoverD(polygon) // Set the hovered polygon data
  }, [])

  // Effect hook to configure globe controls (auto-rotation)
  //   useEffect(() => {
  //     if (globeEl.current) {
  //       // Enable auto-rotation for the globe
  //       globeEl.current.controls().autoRotate = true
  //       // Set the speed of auto-rotation
  //       globeEl.current.controls().autoRotateSpeed = 0.3
  //     }
  //   }, []) // Empty dependency array means this effect runs once on mount

  // Globe configuration based on mode
  const globeConfig = {
    globeImageUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
    backgroundImageUrl: '//unpkg.com/three-globe/example/img/night-sky.png',
    backgroundColor: '#000011',
    atmosphereColor: '#87ceeb',
    containerStyle: { backgroundColor: '#000011' },
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100 font-inter">
      <div className="w-full h-full">
        <Globe
          ref={globeEl} // Attach ref to the Globe component
          globeMaterial={globeMaterial} // Apply custom globe material
          backgroundColor="#fff" // Background color of the scene
          //   atmosphereAltitude={0.15} // Altitude of the atmosphere layer
          polygonsData={countries.features} // GeoJSON data for countries
          polygonCapColor={(d) => (d === hoverD ? '#a8a8a8' : '#d4d4d4')} // Color of country caps (changes on hover)
          polygonSideColor={() => '#c0c0c0'} // Color of country sides
          polygonStrokeColor={() => '#000'} // Color of country borders
          polygonLabel={
            (d: any) => `Country: ${d.properties.name}` // Tooltip label for countries
          }
          //   polygonStrokeWidth={0.2} // Width of country borders for better visibility
          onPolygonHover={onCountryHover} // Callback for country hover events
          polygonsTransitionDuration={300} // Transition duration for polygon color changes
          animateIn={true} // Animate the globe's initial appearance
          // Fire event points configuration
          pointsData={fireEvents} // Data for the fire event points
          pointColor={() => 'red'} // Color of the fire event points (red for "fire")
          pointAltitude={(d: any) => 0.01} // Altitude of the points, based on their 'size' property
          pointRadius={0.4} // Radius of the points for visibility
          pointResolution={12} // Number of segments for point geometry (makes dots smoother)
          pointLabel={(d: any) =>
            `Fire Event at Lat: ${d.lat.toFixed(2)}, Lng: ${d.lng.toFixed(2)}`
          } // Tooltip on hover
        />
      </div>
    </div>
  )
}

export default NewWorldGlobe
