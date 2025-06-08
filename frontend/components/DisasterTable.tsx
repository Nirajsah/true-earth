import React, { useState, useEffect, useMemo } from 'react'

// Mock data, normally this would come from an API or a larger dataset
const initialDisasterData = [
  {
    'DisNo.': '2000-0023-BGD',
    'Classification Key': 'nat-geo-ear-gro',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Geophysical',
    'Disaster Type': 'Earthquake',
    'Disaster Subtype': 'Ground movement',
    'Event Name': '',
    ISO: 'BGD',
    Country: 'Bangladesh',
    Subregion: 'Southern Asia',
    Region: 'Asia',
    Location: "Maheshkhali area (Cox's Bazar district, Chittagong province)",
    Origin: '',
    'Associated Types': '',
    'OFDA/BHA Response': 'No',
    Appeal: 'No',
    Declaration: 'No',
    "AID Contribution ('000 US$)": null,
    Magnitude: 4.3,
    'Magnitude Scale': 'Moment Magnitude',
    Latitude: 21.431,
    Longitude: 91.762,
    'River Basin': '',
    'Start Year': 2000,
    'Start Month': 1,
    'Start Day': 2,
    'End Year': 2000,
    'End Month': 1,
    'End Day': 2,
    'Total Deaths': null,
    'No. Injured': null,
    'No. Affected': 1000,
    'No. Homeless': null,
    'Total Affected': 1000,
    "Reconstruction Costs ('000 US$)": null,
    "Reconstruction Costs, Adjusted ('000 US$)": null,
    "Insured Damage ('000 US$)": null,
    "Insured Damage, Adjusted ('000 US$)": null,
    "Total Damage ('000 US$)": null,
    "Total Damage, Adjusted ('000 US$)": null,
    CPI: 54.895153,
    'Admin Units': '[{"adm2_code":5772,"adm2_name":"Cox\'s Bazar"}]',
    'Entry Date': '2011-04-07',
    'Last Update': '2023-09-25',
  },
  {
    'DisNo.': '2021-0001-USA',
    'Classification Key': 'nat-cli-dro',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Climatological',
    'Disaster Type': 'Drought',
    'Disaster Subtype': 'Severe Drought',
    'Event Name': 'California Drought',
    ISO: 'USA',
    Country: 'United States',
    Subregion: 'Northern America',
    Region: 'Americas',
    Location: 'California',
    'Start Year': 2021,
    'Start Month': 1,
    'Start Day': 1,
    'End Year': 2023,
    'End Month': 12,
    'End Day': 31,
    'Total Deaths': null,
    'No. Injured': null,
    'No. Affected': 5000000,
    'Total Affected': 5000000,
    "Total Damage ('000 US$)": 15000000,
  },
  {
    'DisNo.': '2022-0005-PAK',
    'Classification Key': 'nat-hyd-flo',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Hydrological',
    'Disaster Type': 'Flood',
    'Disaster Subtype': 'Riverine Flood',
    'Event Name': 'Pakistan Floods',
    ISO: 'PAK',
    Country: 'Pakistan',
    Subregion: 'Southern Asia',
    Region: 'Asia',
    Location: 'Nationwide',
    'Start Year': 2022,
    'Start Month': 6,
    'Start Day': 14,
    'End Year': 2022,
    'End Month': 10,
    'End Day': 20,
    'Total Deaths': 1739,
    'No. Injured': 12867,
    'No. Affected': 33000000,
    'Total Affected': 33000000,
    "Total Damage ('000 US$)": 30000000,
  },
  {
    'DisNo.': '2003-0001-FRA',
    'Classification Key': 'nat-cli-ext',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Climatological',
    'Disaster Type': 'Extreme Temperature',
    'Disaster Subtype': 'Heat Wave',
    'Event Name': 'European Heatwave',
    ISO: 'FRA',
    Country: 'France',
    Subregion: 'Western Europe',
    Region: 'Europe',
    Location: 'France, Europe',
    'Start Year': 2003,
    'Start Month': 8,
    'Start Day': 1,
    'End Year': 2003,
    'End Month': 8,
    'End Day': 15,
    'Total Deaths': 15000,
    'No. Injured': null,
    'No. Affected': null,
    'Total Affected': null,
  },
  {
    'DisNo.': '2023-0010-TUR',
    'Classification Key': 'nat-geo-ear-gro',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Geophysical',
    'Disaster Type': 'Earthquake',
    'Disaster Subtype': 'Ground movement',
    'Event Name': 'Turkey-Syria Earthquake',
    ISO: 'TUR',
    Country: 'Turkey',
    Subregion: 'Western Asia',
    Region: 'Asia',
    Location: 'Southern and Central Turkey, Northern and Western Syria',
    Magnitude: 7.8,
    'Magnitude Scale': 'Moment Magnitude',
    'Start Year': 2023,
    'Start Month': 2,
    'Start Day': 6,
    'End Year': 2023,
    'End Month': 2,
    'End Day': 6,
    'Total Deaths': 59259,
    'No. Injured': 121704,
    'No. Affected': 14000000,
    'Total Affected': 14000000,
  },
  {
    'DisNo.': '2020-0015-AUS',
    'Classification Key': 'nat-met-wil',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Meteorological',
    'Disaster Type': 'Wildfire',
    'Disaster Subtype': 'Bushfire',
    'Event Name': 'Australian Bushfires',
    ISO: 'AUS',
    Country: 'Australia',
    Subregion: 'Australia and New Zealand',
    Region: 'Oceania',
    Location: 'New South Wales, Victoria',
    'Start Year': 2019,
    'Start Month': 9,
    'Start Day': 1,
    'End Year': 2020,
    'End Month': 3,
    'End Day': 31,
    'Total Deaths': 33,
    'No. Injured': null,
    'No. Affected': 3000000,
    'Total Affected': 3000000,
    "Total Damage ('000 US$)": 2500000,
  },
  {
    'DisNo.': '2018-0007-GTM',
    'Classification Key': 'nat-geo-vol',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Geophysical',
    'Disaster Type': 'Volcanic activity',
    'Disaster Subtype': 'Ash fall',
    'Event Name': 'Fuego Volcano Eruption',
    ISO: 'GTM',
    Country: 'Guatemala',
    Subregion: 'Central America',
    Region: 'Americas',
    Location: 'Volcán de Fuego',
    'Start Year': 2018,
    'Start Month': 6,
    'Start Day': 3,
    'End Year': 2018,
    'End Month': 6,
    'End Day': 3,
    'Total Deaths': 425,
    'No. Injured': 28,
    'No. Affected': 1700000,
    'Total Affected': 1700000,
  },
  {
    'DisNo.': '2021-0020-IND',
    'Classification Key': 'nat-hyd-gla',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Hydrological',
    'Disaster Type': 'Glacial lake outburst',
    'Disaster Subtype': 'Glacial lake outburst flood',
    'Event Name': 'Chamoli Glacier Burst',
    ISO: 'IND',
    Country: 'India',
    Subregion: 'Southern Asia',
    Region: 'Asia',
    Location: 'Chamoli district, Uttarakhand',
    'Start Year': 2021,
    'Start Month': 2,
    'Start Day': 7,
    'End Year': 2021,
    'End Month': 2,
    'End Day': 7,
    'Total Deaths': 204,
    'No. Injured': null,
    'No. Affected': null,
    'Total Affected': null,
  },
  {
    'DisNo.': '2017-0003-USA',
    'Classification Key': 'nat-met-sto',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Meteorological',
    'Disaster Type': 'Storm',
    'Disaster Subtype': 'Tropical Cyclone',
    'Event Name': 'Hurricane Harvey',
    ISO: 'USA',
    Country: 'United States',
    Subregion: 'Northern America',
    Region: 'Americas',
    Location: 'Texas, Louisiana',
    Magnitude: null,
    'Start Year': 2017,
    'Start Month': 8,
    'Start Day': 17,
    'End Year': 2017,
    'End Month': 9,
    'End Day': 2,
    'Total Deaths': 107,
    'No. Injured': null,
    'No. Affected': 13000000,
    'Total Affected': 13000000,
    "Total Damage ('000 US$)": 125000000,
  },
  {
    'DisNo.': '2020-0001-PHL',
    'Classification Key': 'nat-geo-vol',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Geophysical',
    'Disaster Type': 'Volcanic activity',
    'Disaster Subtype': 'Ash fall',
    'Event Name': 'Taal Volcano Eruption',
    ISO: 'PHL',
    Country: 'Philippines',
    Subregion: 'South-Eastern Asia',
    Region: 'Asia',
    Location: 'Batangas, Cavite, Laguna',
    'Start Year': 2020,
    'Start Month': 1,
    'Start Day': 12,
    'End Year': 2020,
    'End Month': 1,
    'End Day': 12,
    'Total Deaths': 39,
    'No. Injured': null,
    'No. Affected': 580000,
    'Total Affected': 580000,
  },
  {
    'DisNo.': '2024-0001-JPN',
    'Classification Key': 'nat-geo-ear-gro',
    'Disaster Group': 'Natural',
    'Disaster Subgroup': 'Geophysical',
    'Disaster Type': 'Earthquake',
    'Disaster Subtype': 'Ground movement',
    'Event Name': 'Noto Peninsula Earthquake',
    ISO: 'JPN',
    Country: 'Japan',
    Subregion: 'Eastern Asia',
    Region: 'Asia',
    Location: 'Noto Peninsula, Ishikawa Prefecture',
    Magnitude: 7.6,
    'Magnitude Scale': 'Moment Magnitude',
    'Start Year': 2024,
    'Start Month': 1,
    'Start Day': 1,
    'End Year': 2024,
    'End Month': 1,
    'End Day': 1,
    'Total Deaths': 241,
    'No. Injured': 1297,
    'No. Affected': 70000,
    'Total Affected': 70000,
    "Total Damage ('000 US$)": null,
  },
]

// Helper to format numbers with commas
const formatNumber = (num) => {
  return num !== null && num !== undefined
    ? new Intl.NumberFormat().format(num)
    : 'N/A'
}

// Table columns definition (similar to Shadcn's columns)
const columns = [
  {
    accessorKey: 'Disaster Type',
    header: 'Type',
    cell: ({ value }) => (
      <div className="font-medium text-blue-600">{value}</div>
    ),
  },
  {
    accessorKey: 'Country',
    header: 'Country',
    cell: ({ value }) => <div className="text-gray-800">{value}</div>,
  },
  {
    accessorKey: 'Location',
    header: 'Location',
    cell: ({ value }) => (
      <div className="text-sm text-gray-600">{value || 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'Start Year',
    header: 'Year',
    cell: ({ value }) => <div className="text-center">{value}</div>,
  },
  {
    accessorKey: 'Magnitude',
    header: 'Magnitude',
    cell: ({ value }) => (
      <div className="text-center">{value !== null ? value : 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'Total Deaths',
    header: 'Deaths',
    cell: ({ value }) => (
      <div className="text-right font-semibold text-red-600">
        {formatNumber(value)}
      </div>
    ),
  },
  {
    accessorKey: 'No. Affected',
    header: 'Affected (Count)',
    cell: ({ value }) => (
      <div className="text-right">{formatNumber(value)}</div>
    ),
  },
  {
    accessorKey: 'Total Affected',
    header: 'Total Affected',
    cell: ({ value }) => (
      <div className="text-right font-semibold">{formatNumber(value)}</div>
    ),
  },
  {
    accessorKey: "Total Damage ('000 US$)",
    header: 'Damage (K US$)',
    cell: ({ value }) => (
      <div className="text-right text-green-700">{formatNumber(value)}</div>
    ),
  },
]

// Reusable Input component (mimicking Shadcn's Input)
const Input = ({ type = 'text', placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
)

// Reusable Tabs component (mimicking Shadcn's Tabs)
// It now takes `value` and `onValueChange` directly for controlled behavior
const Tabs = ({ value, onValueChange, children }) => {
  return (
    <div className="flex space-x-1 rounded-md bg-muted p-1">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isActive: child.props.value === value, // Compare with parent's controlled value
          onClick: () => onValueChange(child.props.value), // Propagate click to parent
        })
      )}
    </div>
  )
}

// Reusable TabsList component (mimicking Shadcn's TabsList)
const TabsList = ({ children }) => (
  <div className="flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
    {children}
  </div>
)

// Reusable TabsTrigger component (mimicking Shadcn's TabsTrigger)
const TabsTrigger = ({ value, isActive, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      isActive ? 'bg-background text-foreground shadow' : 'hover:bg-muted/50'
    }`}
  >
    {children}
  </button>
)

// Basic Table component (mimicking Shadcn's Table)
const Table = ({ children }) => (
  // Added overflow-x-auto for horizontal scrolling on small screens
  <div className="relative w-full overflow-x-auto rounded-md border">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
)

// TableHeader, TableRow, TableHead, TableBody, TableCell (mimicking Shadcn)
const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
)
const TableRow = ({ children, className }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
)
const TableHead = ({ children }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
    {children}
  </th>
)
const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
)
const TableCell = ({ children, className }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
)

function DisasterTable() {
  const [data] = useState(initialDisasterData)
  const [countryFilter, setCountryFilter] = useState('')
  const [disasterTypeFilter, setDisasterTypeFilter] = useState('All') // Initial state for the tab filter

  // Extract all unique disaster types for the tabs
  const disasterTypes = useMemo(() => {
    const types = new Set(data.map((item) => item['Disaster Type']))
    return ['All', ...Array.from(types).sort()]
  }, [data])

  // Filtered data based on country and disaster type
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCountry = countryFilter
        ? item.Country.toLowerCase().includes(countryFilter.toLowerCase())
        : true

      const matchesDisasterType =
        disasterTypeFilter === 'All'
          ? true
          : item['Disaster Type'] === disasterTypeFilter // This logic remains correct

      return matchesCountry && matchesDisasterType
    })
  }, [data, countryFilter, disasterTypeFilter])

  return (
    <div>
      <div className="container mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Global Disaster Data
        </h1>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {' '}
          {/* Added gap */}
          {/* Country Filter */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Filter by country..."
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full md:max-w-xs"
            />
          </div>
          {/* Disaster Type Tabs */}
          <div className="flex-none w-full md:w-auto overflow-x-auto pb-2 custom-scrollbar">
            {' '}
            {/* Added overflow for tabs on small screens, pb-2 for scrollbar, custom-scrollbar for styling */}
            <Tabs
              value={disasterTypeFilter}
              onValueChange={setDisasterTypeFilter}
            >
              <TabsList>
                {disasterTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow
                  key={row['DisNo.']}
                  className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell
                        ? column.cell({ value: row[column.accessorKey], row })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Display Total Records */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} records.
        </div>
      </div>
    </div>
  )
}

export default DisasterTable
// ```

// **To use this code:**

// 1.  **Ensure you have Tailwind CSS set up** in your React project. If not, you'll need to install it and configure `tailwind.config.js` to scan your component files.
// 2.  Save the code as `App.jsx` (or `App.js`).
// 3.  Make sure your `index.js` or `main.jsx` renders the `App` component.
// 4.  Add a basic global CSS file (e.g., `index.css`) with:
//     ```css
//     @tailwind base;
//     @tailwind components;
//     @tailwind utilities;

//     /* Optional: Custom scrollbar for tabs on small screens */
//     .custom-scrollbar::-webkit-scrollbar {
//       height: 4px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-track {
//       background: #f1f1f1;
//       border-radius: 2px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb {
//       background: #888;
//       border-radius: 2px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//       background: #555;
//     }
//     ```

// Now, the table should handle overflow horizontally on smaller screens, and the disaster type tabs will correctly filter the da
