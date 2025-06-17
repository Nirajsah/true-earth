'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Flame, Waves, Calendar, Globe2, Filter } from 'lucide-react'
import EnhancedWorldGlobe from './EnhancedWorldGlobe' // Assuming this component exists and handles props

// --- UPDATED TYPE DEFINITIONS ---
type FireEvent = {
  id: string // Representing ObjectId as string on the client-side
  latitude: number
  longitude: number
  brightness: number
  reference_temp: number
  date: number // YYYYMMDD
  time: number // Minutes past midnight
  satellite: string
  confidence: number
  frp: number
  daynight: 'Day' | 'Night'
  country: string
  type: 'fire' // Added type discriminator for union
  // Mapped client-side properties for consistency with EarthquakeEvent
  lat: number
  lng: number
  size: number // Placeholder, could be derived from frp/brightness
  intensity: number // Placeholder, could be derived from brightness/frp
  timestamp: string // Will be constructed
}

type EarthquakeEvent = {
  id: string
  date: number // YYYYMMDD
  time: number // Minutes past midnight
  latitude: number
  longitude: number
  depth_km: number
  magnitude: number
  magnitude_scale: string
  country: string | null // Can be null
  type: 'earthquake' // Added type discriminator for union
  // Mapped client-side properties for consistency with FireEvent
  lat: number
  lng: number
  size: number // Placeholder, could be derived from magnitude
  timestamp: string // Will be constructed
}

// Define specific time range options for each event type
type TimeRangeKey = '1d' | '3d' | '7d' | '1w' | '1m' | '6m' | 'all'
type TimeRangeOption = {
  value: TimeRangeKey
  label: string
}

const FIRE_TIME_RANGES: TimeRangeOption[] = [
  { value: '1d', label: 'Last 1 Day' },
  { value: '3d', label: 'Last 3 Days' },
  { value: '7d', label: 'Last 7 Days' },
]

const EARTHQUAKE_TIME_RANGES: TimeRangeOption[] = [
  { value: '1d', label: 'Last 1 Day' },
  { value: '1w', label: 'Last 1 Week' },
  { value: '1m', label: 'Last 1 Month' },
  { value: '6m', label: 'Last 6 Months' },
  { value: 'all', label: 'All Time' },
]

const WorldGlobe: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('7d') // Default to 7d for initial load
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedEventType, setSelectedEventType] = useState<
    'all' | 'fire' | 'earthquake'
  >('all')

  // Caching states for fetched data
  const [cachedFireData, setCachedFireData] = useState<
    Record<string, FireEvent[]>
  >({})
  const [cachedEarthquakeData, setCachedEarthquakeData] = useState<
    Record<string, EarthquakeEvent[]>
  >({})

  // State to hold the events currently being displayed (could be from cache or new fetch)
  const [currentFireEvents, setCurrentFireEvents] = useState<FireEvent[]>([])
  const [currentEarthquakeEvents, setCurrentEarthquakeEvents] = useState<
    EarthquakeEvent[]
  >([])

  const [countryList, setCountryList] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<
    (FireEvent | EarthquakeEvent)[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)

  // Define hardcoded date ranges for data availability
  const FIRE_MIN_DATE = useMemo(() => new Date('2025-06-08T00:00:00Z'), [])
  const FIRE_MAX_DATE = useMemo(() => new Date('2025-06-15T23:59:59Z'), []) // Adjusted to end of day
  const EARTHQUAKE_MIN_DATE = useMemo(
    () => new Date('2024-01-01T00:00:00Z'),
    []
  )
  const EARTHQUAKE_MAX_DATE = useMemo(
    () => new Date('2025-06-14T23:59:59Z'),
    []
  ) // Adjusted to end of day

  // Derived state for time range options based on selectedEventType
  const timeRangeOptions = useMemo(() => {
    if (selectedEventType === 'fire') {
      return FIRE_TIME_RANGES
    }
    if (selectedEventType === 'earthquake') {
      return EARTHQUAKE_TIME_RANGES
    }
    // If 'all', show a combined set or a default set.
    // Default to fire options for 'all' to ensure a baseline
    return FIRE_TIME_RANGES
  }, [selectedEventType])

  // Reset timeRange when event type changes to ensure compatibility
  useEffect(() => {
    if (
      selectedEventType === 'fire' &&
      !FIRE_TIME_RANGES.some((opt) => opt.value === timeRange)
    ) {
      setTimeRange('7d') // Default for fire
    } else if (
      selectedEventType === 'earthquake' &&
      !EARTHQUAKE_TIME_RANGES.some((opt) => opt.value === timeRange)
    ) {
      setTimeRange('1w') // Default for earthquake
    } else if (
      selectedEventType === 'all' &&
      !FIRE_TIME_RANGES.some((opt) => opt.value === timeRange)
    ) {
      setTimeRange('7d') // Default for all (using fire's default)
    }
  }, [selectedEventType, timeRange])

  // Helper to calculate clamped dates based on time range and event type
  const getClampedDates = useCallback(
    (eventType: 'fire' | 'earthquake', range: TimeRangeKey) => {
      // Current time in IST (India Standard Time)
      const nowIST = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      )

      let minDate: Date
      let maxDate: Date

      if (eventType === 'fire') {
        minDate = FIRE_MIN_DATE
        maxDate = FIRE_MAX_DATE
      } else {
        // earthquake
        minDate = EARTHQUAKE_MIN_DATE
        maxDate = EARTHQUAKE_MAX_DATE
      }

      let calculatedFromDate: Date
      let calculatedToDate: Date

      if (range === 'all') {
        calculatedFromDate = minDate
        calculatedToDate = maxDate
      } else {
        // Clamp 'to' date to max data date or current time, whichever is earlier
        calculatedToDate = nowIST > maxDate ? maxDate : nowIST

        let daysOffset = 0
        if (range === '1d') daysOffset = 1
        else if (range === '3d') daysOffset = 3
        else if (range === '7d' || range === '1w') daysOffset = 7
        else if (range === '1m') daysOffset = 30 // Approximation for month
        else if (range === '6m') daysOffset = 180 // Approximation for 6 months

        calculatedFromDate = new Date(
          calculatedToDate.getTime() - daysOffset * 24 * 60 * 60 * 1000
        )
      }

      // Final clamping to ensure dates are within the available dataset range
      const clampedFrom =
        calculatedFromDate < minDate ? minDate : calculatedFromDate
      const clampedTo = calculatedToDate > maxDate ? maxDate : calculatedToDate

      // Format dates as YYYYMMDD
      const fromFormatted = `${clampedFrom.getFullYear()}${String(
        clampedFrom.getMonth() + 1
      ).padStart(2, '0')}${String(clampedFrom.getDate()).padStart(2, '0')}`
      const toFormatted = `${clampedTo.getFullYear()}${String(
        clampedTo.getMonth() + 1
      ).padStart(2, '0')}${String(clampedTo.getDate()).padStart(2, '0')}`

      return {
        from: fromFormatted,
        to: toFormatted,
        cacheKey: `${fromFormatted}-${toFormatted}`,
      }
    },
    [FIRE_MIN_DATE, FIRE_MAX_DATE, EARTHQUAKE_MIN_DATE, EARTHQUAKE_MAX_DATE]
  )

  // Helper function to convert raw server event data into client-side Event types
  // This also adds the 'type' discriminator and calculates 'timestamp', 'lat', 'lng', 'size', 'intensity'
  const mapFireEvent = (raw: any): FireEvent => {
    // Construct timestamp from date (YYYYMMDD) and time (minutes past midnight)
    const year = Math.floor(raw.date / 10000)
    const month = Math.floor((raw.date % 10000) / 100)
    const day = raw.date % 100
    const hours = Math.floor(raw.time / 60)
    const minutes = raw.time % 60

    const dt = new Date(Date.UTC(year, month - 1, day, hours, minutes))

    return {
      id: raw.id,
      type: 'fire',
      latitude: raw.latitude,
      longitude: raw.longitude,
      brightness: raw.brightness,
      reference_temp: raw.reference_temp,
      date: raw.date,
      time: raw.time,
      satellite: raw.satellite,
      confidence: raw.confidence,
      frp: raw.frp,
      daynight: raw.daynight,
      country: raw.country,
      lat: raw.latitude,
      lng: raw.longitude,
      size: raw.frp / 50 + 1, // Example: derive size from FRP, adjust as needed
      intensity: raw.brightness, // Example: use brightness as intensity
      timestamp: dt.toISOString(),
    }
  }

  const mapEarthquakeEvent = (raw: any): EarthquakeEvent => {
    // Construct timestamp from date (YYYYMMDD) and time (minutes past midnight)
    const year = Math.floor(raw.date / 10000)
    const month = Math.floor((raw.date % 10000) / 100)
    const day = raw.date % 100
    const hours = Math.floor(raw.time / 60)
    const minutes = raw.time % 60

    const dt = new Date(Date.UTC(year, month - 1, day, hours, minutes))

    return {
      id: raw.id,
      type: 'earthquake',
      date: raw.date,
      time: raw.time,
      latitude: raw.latitude,
      longitude: raw.longitude,
      depth_km: raw.depth_km,
      magnitude: raw.magnitude,
      magnitude_scale: raw.magnitude_scale,
      country: raw.country, // Can be null
      lat: raw.latitude,
      lng: raw.longitude,
      size: raw.magnitude * 0.8 + 1, // Example: derive size from magnitude, adjust as needed
      timestamp: dt.toISOString(),
    }
  }

  // Fetch both fire and earthquake events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        let allFireEvents: FireEvent[] = []
        let allEarthquakeEvents: EarthquakeEvent[] = []

        // --- Fetch Fire Events ---
        const {
          from: fireFrom,
          to: fireTo,
          cacheKey: fireCacheKey,
        } = getClampedDates('fire', timeRange)
        if (cachedFireData[fireCacheKey]) {
          allFireEvents = cachedFireData[fireCacheKey]
        } else {
          const fireRes = await fetch(
            `http://localhost:4000/api/fire_events?from=${fireFrom}&to=${fireTo}`
          )
          if (!fireRes.ok)
            throw new Error(`HTTP error! status: ${fireRes.status}`)
          const fireData: any[] = await fireRes.json()
          const mappedFireData = fireData.map(mapFireEvent) // Map raw data to client type
          setCachedFireData((prev) => ({
            ...prev,
            [fireCacheKey]: mappedFireData,
          }))
          allFireEvents = mappedFireData
        }
        setCurrentFireEvents(allFireEvents)

        // --- Fetch Earthquake Events ---
        const {
          from: quakeFrom,
          to: quakeTo,
          cacheKey: quakeCacheKey,
        } = getClampedDates('earthquake', timeRange)
        if (cachedEarthquakeData[quakeCacheKey]) {
          allEarthquakeEvents = cachedEarthquakeData[quakeCacheKey]
        } else {
          const quakeRes = await fetch(
            `http://localhost:4000/api/quake_events?from=${quakeFrom}&to=${quakeTo}`
          )
          if (!quakeRes.ok)
            throw new Error(`HTTP error! status: ${quakeRes.status}`)
          const quakeData: any[] = await quakeRes.json()
          const mappedQuakeData = quakeData.map(mapEarthquakeEvent) // Map raw data to client type
          setCachedEarthquakeData((prev) => ({
            ...prev,
            [quakeCacheKey]: mappedQuakeData,
          }))
          allEarthquakeEvents = mappedQuakeData
        }
        setCurrentEarthquakeEvents(allEarthquakeEvents)

        // Consolidate countries from both datasets for the filter list
        // Filter out null or empty country strings
        const combinedEvents = [...allFireEvents, ...allEarthquakeEvents]
        const allCountries = Array.from(
          new Set(
            combinedEvents
              .map((e) => e.country)
              .filter((country) => country !== null && country !== '')
          )
        ).sort()
        setCountryList(allCountries)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        // Optionally, set an error state to display to the user
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [timeRange, getClampedDates, cachedFireData, cachedEarthquakeData]) // Re-fetch when timeRange changes or cache is updated

  // Filter by type, country
  const filterEvents = useCallback(() => {
    let events: (FireEvent | EarthquakeEvent)[] = []

    if (selectedEventType === 'all') {
      events = [...currentFireEvents, ...currentEarthquakeEvents]
    } else if (selectedEventType === 'fire') {
      events = currentFireEvents
    } else if (selectedEventType === 'earthquake') {
      events = currentEarthquakeEvents
    }

    if (selectedCountry !== 'all') {
      // Ensure country exists and matches selectedCountry
      events = events.filter((e) => e.country === selectedCountry)
    }

    setFilteredEvents(events)
  }, [
    currentFireEvents,
    currentEarthquakeEvents,
    selectedCountry,
    selectedEventType,
  ])

  useEffect(() => {
    filterEvents()
  }, [filterEvents]) // Run filter when dependencies change

  const eventStats = {
    total: filteredEvents.length,
    fire: filteredEvents.filter((e) => e.type === 'fire').length,
    earthquake: filteredEvents.filter((e) => e.type === 'earthquake').length,
  }

  if (loading) {
    return (
      <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">
            Loading global event data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 space-y-4">
        <Card className="w-80 shadow-lg backdrop-blur-sm bg-white/95">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" /> Event Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Event Type
              </label>
              <Select
                value={selectedEventType}
                onValueChange={(v) => {
                  setSelectedEventType(v as 'all' | 'fire' | 'earthquake')
                  setSelectedCountry('all') // Reset country filter on type change
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="fire">🔥 Fire Events</SelectItem>
                  <SelectItem value="earthquake">🌊 Earthquakes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Time Range
              </label>
              <Select
                value={timeRange}
                onValueChange={(v) => setTimeRange(v as TimeRangeKey)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">All Countries</SelectItem>
                  {countryList.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="w-80 shadow-lg backdrop-blur-sm bg-white/95">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" /> Event Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <Badge variant="secondary" className="font-semibold">
                  {eventStats.total}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500" /> Fire Events
                </span>
                <Badge variant="destructive" className="font-semibold">
                  {eventStats.fire}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Waves className="w-3 h-3 text-orange-500" /> Earthquakes
                </span>
                <Badge
                  variant="outline"
                  className="font-semibold border-orange-500 text-orange-600"
                >
                  {eventStats.earthquake}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Globe */}
      <div className="w-full h-full">
        <EnhancedWorldGlobe
          loading={loading}
          events={filteredEvents}
          selectedCountry={selectedCountry}
          selectedEventType={selectedEventType}
          timeRange={timeRange}
        />
      </div>
    </div>
  )
}

export default WorldGlobe
