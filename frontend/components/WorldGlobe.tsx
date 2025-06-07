'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { GeoPermissibleObjects } from 'd3-geo';

const WorldGlobe = () => {
  const [timeRange, setTimeRange] = useState('90d'); // State for the time range selection
  const globeContainerRef = useRef<HTMLDivElement>(null);

  // State to hold the dimensions of the globe container for responsiveness
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Refs for D3 objects that need to persist across renders but aren't part of React state
  const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const pathRef = useRef<d3.GeoPath<any, GeoPermissibleObjects> | null>(null);

  // 1. Effect for updating dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (globeContainerRef.current) {
        setDimensions({
          width: globeContainerRef.current.clientWidth,
          height: globeContainerRef.current.clientHeight,
        });
      }
    };

    // Set initial dimensions
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []); // Empty dependency array: runs once on mount and cleans up on unmount

  // 2. Effect for D3 Initialization (runs once after initial render)
  useEffect(() => {
    // Only initialize D3 if dimensions are valid and it hasn't been initialized
    if (dimensions.width === 0 || dimensions.height === 0 || svgRef.current) return;

    // Select the container and append SVG
    const svg = d3.select(globeContainerRef.current)
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    svgRef.current = svg; // Store SVG selection in ref

    // Append a group element to the SVG for all map features
    const g = svg.append("g");
    gRef.current = g; // Store group selection in ref

    // Define the orthographic projection
    const initialScale = Math.min(dimensions.width, dimensions.height) / 2.5; // Scale based on container
    const projection = d3.geoOrthographic()
      .scale(initialScale)
      .center([0, 0]) // Initial center
      .rotate([0, 0]) // Initial rotation
      .translate([dimensions.width / 2, dimensions.height / 2]) // Translate to center of SVG
      .clipAngle(90)
      .precision(0.1);

    projectionRef.current = projection; // Store projection in ref

    // Define the path generator
    const path: any = d3.geoPath<any, GeoPermissibleObjects>()
      .projection(projection);
    pathRef.current = path; // Store path generator in ref

    // Add a sphere (ocean background)
    g.append("path")
      .datum({ type: "Sphere" } as GeoPermissibleObjects)
      .attr("class", "sphere")
      .attr("d", path)
      .attr("fill", "#a8c0f5"); // Light blue for oceans

    // Load world map data (TopoJSON)
    d3.json("/assets/worldmap.json").then((world: any) => {
      const topojsonObject = feature(world, world.objects.countries);

      const countries: FeatureCollection<Geometry | null, GeoJsonProperties> = {
        type: "FeatureCollection",
        features: [topojsonObject as Feature<Geometry | null, GeoJsonProperties>]
      };

      // Draw countries
      g.selectAll(".country")
        .data(countries.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", (d: Feature<Geometry | null, GeoJsonProperties>) => path(d as GeoPermissibleObjects))
        .attr("fill", "#cccccc")
        .attr("stroke", "#333333")
        .attr("stroke-width", 0.5)
        .on("mouseover", function (event: MouseEvent, d: Feature<Geometry | null, GeoJsonProperties>) {
          d3.select(this).attr("fill", "orange");
          // console.log(d.properties?.name); // Uncomment to see country names
        })
        .on("mouseout", function (event: MouseEvent, d: Feature<Geometry | null, GeoJsonProperties>) {
          d3.select(this).attr("fill", "#cccccc");
        });
    }).catch(error => {
      console.error("Error loading the TopoJSON data:", error);
      svg.append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", dimensions.height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text("Error loading map data. Ensure /assets/world-110m.json exists.");
    });

    // --- D3 Interaction: Drag for Rotation, Scroll for Zoom ---
    let rotationOnStart: [number, number, number];

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("start", function (event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
        const currentRotation = projectionRef.current!.rotate();
        rotationOnStart = [currentRotation[0], currentRotation[1], currentRotation[2] || 0];
      })
      .on("drag", function (event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
        if (!projectionRef.current || !gRef.current || !pathRef.current) return;
        const sensitivity = 0.75;
        const newRotation: [number, number, number] = [
          rotationOnStart[0] + event.dx * sensitivity,
          rotationOnStart[1] - event.dy * sensitivity,
          rotationOnStart[2]
        ];
        projectionRef.current.rotate(newRotation);
        gRef.current.selectAll("path").attr("d", (d: any) => pathRef.current!(d));
      });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([initialScale / 2, initialScale * 4])
      .on("zoom", function (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
        if (!projectionRef.current || !gRef.current || !pathRef.current) return;
        projectionRef.current.scale(event.transform.k);
        gRef.current.selectAll("path").attr("d", (d: any) => pathRef.current!(d));
      });

    svg.call(drag);
    svg.call(zoom);

    // Cleanup: This part is crucial for preventing multiple D3 initializations
    return () => {
      if (svgRef.current) {
        svgRef.current.remove();
        svgRef.current = null;
        gRef.current = null;
        projectionRef.current = null;
        pathRef.current = null;
      }
    };
  }, [dimensions.width, dimensions.height]); // Re-run this effect only if dimensions are available for initial setup

  // 3. Effect for handling responsiveness (runs when dimensions change AFTER initial setup)
  useEffect(() => {
    if (!svgRef.current || !projectionRef.current || !pathRef.current || !gRef.current) return;

    // Update SVG dimensions
    svgRef.current.attr("width", dimensions.width).attr("height", dimensions.height);

    // Update projection translation to keep globe centered
    projectionRef.current.translate([dimensions.width / 2, dimensions.height / 2]);

    // Update projection scale based on new dimensions, maintaining relative size
    const newScale = Math.min(dimensions.width, dimensions.height) / 2.5;
    // Check if the current zoom level is significantly different from the new base scale
    // If so, update it. This prevents resetting zoom when just resizing slightly.
    // A more robust solution might involve storing the zoom transform and re-applying it.
    if (Math.abs(projectionRef.current.scale() - newScale) > 10) { // A threshold
      projectionRef.current.scale(newScale);
    }

    // Redraw all paths with the updated projection
    gRef.current.selectAll("path").attr("d", (d: any) => pathRef.current!(d));

  }, [dimensions]); // This effect depends only on dimensions


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
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" /></svg>
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
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" /></svg>
          </span>
        </div>
      </div>
      {/* This div will hold the D3-generated SVG */}
      <div
        ref={globeContainerRef}
        className="flex-1 w-full h-full"
        style={{ touchAction: 'none' }} // Prevent default touch actions (e.g., scrolling) on the globe
      >
        {/* D3 will render the SVG here */}
      </div>
    </div>
  );
};

export default WorldGlobe;
