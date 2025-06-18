'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import * as THREE from 'three'
import { useGlobeChat } from '@/contexts/GlobeChatContext'

// Define a unified Event interface that matches the mapped output from WorldGlobe
interface Event {
  id: string
  type: 'fire' | 'earthquake' // Type discriminator
  lat: number // Mapped latitude
  lng: number // Mapped longitude
  country: string | null // Can be null
  timestamp: string // ISO string format already constructed by parent
  size: number // Derived size from parent

  // Fire-specific properties (optional as they only exist on fire events)
  brightness?: number
  intensity?: number

  // Earthquake-specific properties (optional as they only exist on earthquake events)
  magnitude?: number
  magnitude_scale?: string
  depth_km?: number
}

const EnhancedWorldGlobe = ({
  events = [], // Already filtered events from the parent
}: {
  events: Event[]
  selectedCountry: string
  selectedEventType: 'all' | 'fire' | 'earthquake'
  timeRange: string // Use string as it matches TimeRangeKey from parent
  loading: boolean
}) => {
  const globeEl = useRef<any>(null)
  const [countries, setCountries] = useState<any>({ features: [] })
  const { openChatWithEvent } = useGlobeChat()
  // Removed hoverD state as it was unused and onCountryHover is no longer needed for filtering/visual changes based on hover

  // Load country shapes data for rendering the globe
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then((res) => res.json())
      .then((topojsonData) => {
        const geojsonData = topojson.feature(
          topojsonData,
          topojsonData.objects.countries
        )
        setCountries(geojsonData)
      })
      .catch((err) => console.error('Error loading topojson', err))
  }, [])

  // Material for the globe surface
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        color: '#fff',
        opacity: 0.95,
        transparent: true,
      }),
    []
  )

  // Callback for when the globe is ready, sets initial controls
  const globeReady = useCallback(() => {
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = true
      globeEl.current.controls().autoRotateSpeed = 0.3
    }
  }, [])

  // Map the incoming events to the format expected by react-globe.gl.
  // No filtering by timeRange, country, or eventType is needed here,
  // as the 'events' prop is already the final filtered list from the parent.

  const globeConfig = {
    globeImageUrl: '//unpkg.com/three-globe/example/img/earth-day.jpg',
    bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
    backgroundImageUrl: null,
    backgroundColor: '#87ceeb',
    atmosphereColor: '#4a90e2',
    containerStyle: { backgroundColor: '#f0f8ff' },
  }

  const getPointLabel = (event: any) => {
    return `
        <div style="padding: 8px; color: white; border-radius: 4px; font-size: 14px">
          <strong>Type:</strong> ${event.type || 'N/A'}<br/>
          <strong>Country:</strong> ${event.country || 'N/A'}<br/>
          <strong>Location:</strong> ${event.latitude?.toFixed(
            2
          )}, ${event.longitude?.toFixed(2)}<br/>
          <strong>Date:</strong> ${new Date(
            event.timestamp
          ).toLocaleDateString()}
          ${
            event.brightness
              ? `<br/><strong>Brightness:</strong> ${event.brightness}`
              : ''
          }
        </div>
      `
  }

  // Function to generate the label content for countries on hover
  const getCountryLabel = useCallback(
    (country: any) => {
      // Filter events by country name, handling null or undefined country properties
      const countryEvents = events.filter(
        (e) =>
          e.country &&
          e.country.toLowerCase() === country.properties.name?.toLowerCase()
      )

      const fireCount = countryEvents.filter((e) => e.type === 'fire').length
      const earthquakeCount = countryEvents.filter(
        (e) => e.type === 'earthquake'
      ).length

      return `
      <div style="padding: 8px; color: white; border-radius: 4px; font-size: 14px; pointer-events: none;">
        <strong>${country.properties.name || 'Unknown'}</strong><br/>
        🔥 Fires: ${fireCount}<br/>
        🌊 Earthquakes: ${earthquakeCount}<br/>
        Total Events: ${countryEvents.length}
      </div>
    `
    },
    [events]
  ) // Dependency on events to re-calculate counts when events data changes

  return (
    <div
      className="w-full h-full"
      id="globe-wrapper"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <Globe
        ref={globeEl}
        rendererConfig={{ antialias: true, alpha: true }}
        globeImageUrl={globeConfig.globeImageUrl}
        bumpImageUrl={globeConfig.bumpImageUrl}
        backgroundImageUrl={globeConfig.backgroundImageUrl}
        backgroundColor={globeConfig.backgroundColor}
        atmosphereColor={globeConfig.atmosphereColor}
        polygonsData={countries.features}
        polygonAltitude={0.001}
        polygonCapColor={() => 'transparent'} // Default country color
        polygonSideColor={() => '#000'}
        polygonStrokeColor={() => 'transparent'}
        polygonLabel={getCountryLabel} // Label on country hover
        // onPolygonHover is removed as hoverD state is no longer used for visual changes

        // HTML Markers for Events (emojis)
        htmlElementsData={events} // Use the pre-filtered and formatted events
        htmlAltitude={0.01} // Altitude above the globe surface
        htmlLat={(d: any) => d.latitude}
        htmlLng={(d: any) => d.longitude}
        htmlTransitionDuration={300} // Smooth transition for markers
        pointsData={events}
        pointLat={(d: any) => d.latitude}
        pointLng={(d: any) => d.longitude}
        onPointClick={(d: any) => {
          // Open chat with the clicked event
          // Cast the event data to match the GlobeEvent interface
          const event = d as Event
          const mappedEvent = {
            id: event.id,
            type: event.type,
            lat: event.lat,
            lng: event.lng,
            country: event.country,
            timestamp: event.timestamp,
            size: event.size,
            brightness: event.brightness,
            intensity: event.intensity,
            magnitude: event.magnitude,
            magnitude_scale: event.magnitude_scale,
            depth_km: event.depth_km,
          }
          openChatWithEvent(mappedEvent)
        }}
        pointRadius={0.5}
        pointAltitude={0.001}
        htmlElement={(d: any) => {
          const el = document.createElement('div')
          // Use different emojis based on event type
          const emoji =
            d.type === 'fire' ? '🔥' : d.type === 'earthquake' ? '🌊' : '❓'
          el.innerHTML = `<div style="pointer-events: auto; transform: translate(-50%, -50%); 
                          background: rgba(255, 255, 255, 0.8);
                          border-radius: 4px;
                          font-size: 10px;">${emoji}</div>`
          el.style.pointerEvents = 'auto' // Ensures hover/click events work
          return el
        }}
        pointLabel={getPointLabel} // Label for event markers on hover (using htmlElementsData so this applies to the HTML element)
        onGlobeReady={globeReady}
      />
    </div>
  )
}

export default EnhancedWorldGlobe
