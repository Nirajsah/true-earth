// 'use client'

// import * as React from 'react'
// import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'

// export const description = 'An interactive area chart'

// // --- NEW MOCK CLIMATE DATA ---
// const chartData = [
//   // Data from January 2024 to June 2025 (inclusive)
//   { date: '2024-01-01', temp: 1.05, co2: 420.5, pm2_5: 18.2, sea_level: 98.0 },
//   { date: '2024-02-01', temp: 1.10, co2: 420.8, pm2_5: 17.5, sea_level: 98.2 },
//   { date: '2024-03-01', temp: 1.15, co2: 421.1, pm2_5: 19.1, sea_level: 98.4 },
//   { date: '2024-04-01', temp: 1.20, co2: 421.4, pm2_5: 20.3, sea_level: 98.6 },
//   { date: '2024-05-01', temp: 1.25, co2: 421.7, pm2_5: 19.8, sea_level: 98.8 },
//   { date: '2024-06-01', temp: 1.30, co2: 422.0, pm2_5: 18.5, sea_level: 99.0 },
//   { date: '2024-07-01', temp: 1.28, co2: 422.3, pm2_5: 16.7, sea_level: 99.2 },
//   { date: '2024-08-01', temp: 1.32, co2: 422.6, pm2_5: 15.9, sea_level: 99.4 },
//   { date: '2024-09-01', temp: 1.37, co2: 422.9, pm2_5: 17.0, sea_level: 99.6 },
//   { date: '2024-10-01', temp: 1.42, co2: 423.2, pm2_5: 18.8, sea_level: 99.8 },
//   { date: '2024-11-01', temp: 1.47, co2: 423.5, pm2_5: 21.0, sea_level: 100.0 },
//   { date: '2024-12-01', temp: 1.52, co2: 423.8, pm2_5: 22.5, sea_level: 100.2 },
//   { date: '2025-01-01', temp: 1.55, co2: 424.1, pm2_5: 20.1, sea_level: 100.4 },
//   { date: '2025-02-01', temp: 1.58, co2: 424.4, pm2_5: 19.0, sea_level: 100.6 },
//   { date: '2025-03-01', temp: 1.61, co2: 424.7, pm2_5: 21.5, sea_level: 100.8 },
//   { date: '2025-04-01', temp: 1.64, co2: 425.0, pm2_5: 22.8, sea_level: 101.0 },
//   { date: '2025-05-01', temp: 1.67, co2: 425.3, pm2_5: 21.2, sea_level: 101.2 },
//   { date: '2025-06-01', temp: 1.70, co2: 425.6, pm2_5: 20.0, sea_level: 101.4 },
// ];

// const chartConfig = {
//   visitors: {
//     label: 'Visitors',
//   },
//   desktop: {
//     label: 'Desktop',
//     color: 'var(--chart-1)',
//   },
//   mobile: {
//     label: 'Mobile',
//     color: 'var(--chart-2)',
//   },
// } satisfies ChartConfig

// export function ChartAreaInteractive() {
//   const [timeRange, setTimeRange] = React.useState('90d')

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date)
//     const referenceDate = new Date('2024-06-30')
//     let daysToSubtract = 90
//     if (timeRange === '30d') {
//       daysToSubtract = 30
//     } else if (timeRange === '7d') {
//       daysToSubtract = 7
//     }
//     const startDate = new Date(referenceDate)
//     startDate.setDate(startDate.getDate() - daysToSubtract)
//     return date >= startDate
//   })

//   return (
//     <Card className="pt-0">
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1">
//           <CardTitle>Area Chart - Interactive</CardTitle>
//           <CardDescription>
//             Showing total visitors for the last 3 months
//           </CardDescription>
//         </div>
//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger
//             className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
//             aria-label="Select a value"
//           >
//             <SelectValue placeholder="Last 3 months" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="90d" className="rounded-lg">
//               Last 3 months
//             </SelectItem>
//             <SelectItem value="30d" className="rounded-lg">
//               Last 30 days
//             </SelectItem>
//             <SelectItem value="7d" className="rounded-lg">
//               Last 7 days
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <AreaChart data={filteredData}>
//             <defs>
//               <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//               <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value)
//                 return date.toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric',
//                 })
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                     })
//                   }}
//                   indicator="dot"
//                 />
//               }
//             />
//             <Area
//               dataKey="temp"
//               type="natural"
//               fill="url(#fillMobile)"
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <Area
//               dataKey="co2"
//               type="natural"
//               fill="url(#fillDesktop)"
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//             <Area
//               dataKey="pm2_5"
//               type="natural"
//               fill="url(#fillMobile)"
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <Area
//               dataKey="sea_level"
//               type="natural"
//               fill="url(#fillDesktop)"
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }



'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const description = 'An interactive area chart'

const chartData = 
  [
  {
    "date": "2000-01-01",
    "temp": 0.98,
    "co2": 369.8,
    "pm2_5": 11.7,
    "sea_level": 95.2
  },
  {
    "date": "2000-01-31",
    "temp": 1.47,
    "co2": 370.4,
    "pm2_5": 12.5,
    "sea_level": 95.0
  },
  {
    "date": "2000-03-01",
    "temp": 1.62,
    "co2": 370.2,
    "pm2_5": 11.0,
    "sea_level": 95.5
  },
  {
    "date": "2000-03-31",
    "temp": 1.21,
    "co2": 370.5,
    "pm2_5": 11.9,
    "sea_level": 95.5
  },
  {
    "date": "2000-04-30",
    "temp": 0.82,
    "co2": 371.6,
    "pm2_5": 12.5,
    "sea_level": 95.0
  },
  {
    "date": "2000-05-30",
    "temp": 1.3,
    "co2": 371.1,
    "pm2_5": 12.8,
    "sea_level": 95.3
  },
  {
    "date": "2000-06-29",
    "temp": 0.57,
    "co2": 371.5,
    "pm2_5": 12.6,
    "sea_level": 95.4
  },
  {
    "date": "2000-07-29",
    "temp": 1.67,
    "co2": 370.9,
    "pm2_5": 9.8,
    "sea_level": 95.1
  },
  {
    "date": "2000-08-28",
    "temp": 0.62,
    "co2": 370.7,
    "pm2_5": 9.6,
    "sea_level": 95.0
  },
  {
    "date": "2000-09-27",
    "temp": 1.05,
    "co2": 371.1,
    "pm2_5": 12.2,
    "sea_level": 94.9
  },
  {
    "date": "2000-10-27",
    "temp": 0.64,
    "co2": 371.0,
    "pm2_5": 10.0,
    "sea_level": 94.8
  },
  {
    "date": "2000-11-26",
    "temp": 1.38,
    "co2": 373.0,
    "pm2_5": 9.5,
    "sea_level": 95.7
  },
  {
    "date": "2000-12-26",
    "temp": 1.29,
    "co2": 373.0,
    "pm2_5": 8.8,
    "sea_level": 95.6
  },
  {
    "date": "2001-01-25",
    "temp": 1.32,
    "co2": 372.4,
    "pm2_5": 8.3,
    "sea_level": 95.5
  },
  {
    "date": "2001-02-24",
    "temp": 1.52,
    "co2": 372.9,
    "pm2_5": 8.7,
    "sea_level": 95.0
  },
  {
    "date": "2001-03-26",
    "temp": 0.75,
    "co2": 373.5,
    "pm2_5": 8.4,
    "sea_level": 95.3
  },
  {
    "date": "2001-04-25",
    "temp": 1.62,
    "co2": 373.7,
    "pm2_5": 12.2,
    "sea_level": 95.1
  },
  {
    "date": "2001-05-25",
    "temp": 1.68,
    "co2": 372.9,
    "pm2_5": 10.4,
    "sea_level": 95.2
  },
  {
    "date": "2001-06-24",
    "temp": 0.91,
    "co2": 373.0,
    "pm2_5": 9.1,
    "sea_level": 96.0
  },
  {
    "date": "2001-07-24",
    "temp": 1.12,
    "co2": 374.1,
    "pm2_5": 11.2,
    "sea_level": 95.2
  },
  {
    "date": "2001-08-23",
    "temp": 1.47,
    "co2": 374.2,
    "pm2_5": 10.0,
    "sea_level": 95.9
  },
  {
    "date": "2001-09-22",
    "temp": 0.52,
    "co2": 375.1,
    "pm2_5": 11.7,
    "sea_level": 95.8
  },
  {
    "date": "2001-10-22",
    "temp": 1.69,
    "co2": 374.8,
    "pm2_5": 10.5,
    "sea_level": 96.0
  },
  {
    "date": "2001-11-21",
    "temp": 1.21,
    "co2": 375.4,
    "pm2_5": 12.9,
    "sea_level": 95.3
  },
  {
    "date": "2001-12-21",
    "temp": 0.97,
    "co2": 375.6,
    "pm2_5": 10.6,
    "sea_level": 96.0
  },
  {
    "date": "2002-01-20",
    "temp": 1.24,
    "co2": 375.4,
    "pm2_5": 8.7,
    "sea_level": 95.7
  },
  {
    "date": "2002-02-19",
    "temp": 1.57,
    "co2": 375.0,
    "pm2_5": 12.5,
    "sea_level": 95.9
  },
  {
    "date": "2002-03-21",
    "temp": 1.65,
    "co2": 376.0,
    "pm2_5": 11.0,
    "sea_level": 95.6
  },
  {
    "date": "2002-04-20",
    "temp": 1.04,
    "co2": 376.0,
    "pm2_5": 11.8,
    "sea_level": 95.7
  },
  {
    "date": "2002-05-20",
    "temp": 1.69,
    "co2": 376.5,
    "pm2_5": 10.7,
    "sea_level": 95.5
  },
  {
    "date": "2002-06-19",
    "temp": 1.68,
    "co2": 376.8,
    "pm2_5": 9.9,
    "sea_level": 95.4
  },
  {
    "date": "2002-07-19",
    "temp": 0.53,
    "co2": 376.3,
    "pm2_5": 8.7,
    "sea_level": 96.2
  },
  {
    "date": "2002-08-18",
    "temp": 0.82,
    "co2": 376.7,
    "pm2_5": 12.6,
    "sea_level": 96.2
  },
  {
    "date": "2002-09-17",
    "temp": 1.27,
    "co2": 375.9,
    "pm2_5": 8.3,
    "sea_level": 96.3
  },
  {
    "date": "2002-10-17",
    "temp": 0.95,
    "co2": 377.5,
    "pm2_5": 10.4,
    "sea_level": 95.6
  },
  {
    "date": "2002-11-16",
    "temp": 0.64,
    "co2": 377.7,
    "pm2_5": 10.5,
    "sea_level": 96.1
  },
  {
    "date": "2002-12-16",
    "temp": 0.88,
    "co2": 376.8,
    "pm2_5": 12.8,
    "sea_level": 95.9
  },
  {
    "date": "2003-01-15",
    "temp": 1.66,
    "co2": 376.8,
    "pm2_5": 11.8,
    "sea_level": 96.0
  },
  {
    "date": "2003-02-14",
    "temp": 1.04,
    "co2": 376.8,
    "pm2_5": 8.6,
    "sea_level": 96.0
  },
  {
    "date": "2003-03-16",
    "temp": 0.73,
    "co2": 377.6,
    "pm2_5": 12.9,
    "sea_level": 96.0
  },
  {
    "date": "2003-04-15",
    "temp": 1.57,
    "co2": 377.7,
    "pm2_5": 11.4,
    "sea_level": 96.7
  },
  {
    "date": "2003-05-15",
    "temp": 0.54,
    "co2": 378.7,
    "pm2_5": 10.8,
    "sea_level": 96.0
  },
  {
    "date": "2003-06-14",
    "temp": 0.61,
    "co2": 379.1,
    "pm2_5": 12.0,
    "sea_level": 96.7
  },
  {
    "date": "2003-07-14",
    "temp": 1.13,
    "co2": 379.3,
    "pm2_5": 12.2,
    "sea_level": 96.8
  },
  {
    "date": "2003-08-13",
    "temp": 1.1,
    "co2": 379.3,
    "pm2_5": 11.6,
    "sea_level": 95.8
  },
  {
    "date": "2003-09-12",
    "temp": 1.43,
    "co2": 378.7,
    "pm2_5": 9.6,
    "sea_level": 96.6
  },
  {
    "date": "2003-10-12",
    "temp": 1.46,
    "co2": 378.6,
    "pm2_5": 12.4,
    "sea_level": 96.9
  },
  {
    "date": "2003-11-11",
    "temp": 1.34,
    "co2": 380.4,
    "pm2_5": 12.2,
    "sea_level": 96.3
  },
  {
    "date": "2003-12-11",
    "temp": 0.78,
    "co2": 378.9,
    "pm2_5": 12.7,
    "sea_level": 96.3
  },
  {
    "date": "2004-01-10",
    "temp": 0.75,
    "co2": 378.9,
    "pm2_5": 12.4,
    "sea_level": 96.6
  },
  {
    "date": "2004-02-09",
    "temp": 1.34,
    "co2": 381.0,
    "pm2_5": 11.1,
    "sea_level": 96.2
  },
  {
    "date": "2004-03-10",
    "temp": 1.53,
    "co2": 380.6,
    "pm2_5": 8.2,
    "sea_level": 96.1
  },
  {
    "date": "2004-04-09",
    "temp": 1.09,
    "co2": 379.9,
    "pm2_5": 12.5,
    "sea_level": 96.7
  },
  {
    "date": "2004-05-09",
    "temp": 1.61,
    "co2": 379.8,
    "pm2_5": 8.1,
    "sea_level": 96.7
  },
  {
    "date": "2004-06-08",
    "temp": 1.64,
    "co2": 381.8,
    "pm2_5": 9.3,
    "sea_level": 96.2
  },
  {
    "date": "2004-07-08",
    "temp": 1.24,
    "co2": 380.1,
    "pm2_5": 8.7,
    "sea_level": 96.6
  },
  {
    "date": "2004-08-07",
    "temp": 0.86,
    "co2": 380.6,
    "pm2_5": 8.9,
    "sea_level": 96.9
  },
  {
    "date": "2004-09-06",
    "temp": 1.23,
    "co2": 382.0,
    "pm2_5": 12.9,
    "sea_level": 97.0
  },
  {
    "date": "2004-10-06",
    "temp": 1.24,
    "co2": 382.2,
    "pm2_5": 8.9,
    "sea_level": 96.3
  },
  {
    "date": "2004-11-05",
    "temp": 0.75,
    "co2": 382.8,
    "pm2_5": 9.5,
    "sea_level": 97.1
  },
  {
    "date": "2004-12-05",
    "temp": 1.16,
    "co2": 382.7,
    "pm2_5": 8.8,
    "sea_level": 96.8
  },
  {
    "date": "2005-01-04",
    "temp": 1.01,
    "co2": 383.1,
    "pm2_5": 8.5,
    "sea_level": 96.4
  },
  {
    "date": "2005-02-03",
    "temp": 1.65,
    "co2": 382.8,
    "pm2_5": 12.6,
    "sea_level": 97.3
  },
  {
    "date": "2005-03-05",
    "temp": 0.83,
    "co2": 382.1,
    "pm2_5": 11.8,
    "sea_level": 97.0
  },
  {
    "date": "2005-04-04",
    "temp": 0.99,
    "co2": 382.5,
    "pm2_5": 12.9,
    "sea_level": 96.5
  },
  {
    "date": "2005-05-04",
    "temp": 0.59,
    "co2": 383.6,
    "pm2_5": 10.6,
    "sea_level": 96.8
  },
  {
    "date": "2005-06-03",
    "temp": 1.41,
    "co2": 383.9,
    "pm2_5": 9.2,
    "sea_level": 97.5
  },
  {
    "date": "2005-07-03",
    "temp": 1.63,
    "co2": 382.6,
    "pm2_5": 11.6,
    "sea_level": 97.0
  },
  {
    "date": "2005-08-02",
    "temp": 0.59,
    "co2": 383.1,
    "pm2_5": 11.6,
    "sea_level": 97.0
  },
  {
    "date": "2005-09-01",
    "temp": 0.53,
    "co2": 384.2,
    "pm2_5": 12.0,
    "sea_level": 97.1
  },
  {
    "date": "2005-10-01",
    "temp": 0.7,
    "co2": 383.4,
    "pm2_5": 9.1,
    "sea_level": 97.0
  },
  {
    "date": "2005-10-31",
    "temp": 1.23,
    "co2": 384.8,
    "pm2_5": 11.3,
    "sea_level": 96.9
  },
  {
    "date": "2005-11-30",
    "temp": 0.69,
    "co2": 384.4,
    "pm2_5": 12.9,
    "sea_level": 97.5
  },
  {
    "date": "2005-12-30",
    "temp": 0.8,
    "co2": 385.0,
    "pm2_5": 8.3,
    "sea_level": 97.7
  },
  {
    "date": "2006-01-29",
    "temp": 1.64,
    "co2": 384.1,
    "pm2_5": 9.2,
    "sea_level": 97.1
  },
  {
    "date": "2006-02-28",
    "temp": 0.76,
    "co2": 385.9,
    "pm2_5": 9.2,
    "sea_level": 97.3
  },
  {
    "date": "2006-03-30",
    "temp": 1.35,
    "co2": 384.9,
    "pm2_5": 9.9,
    "sea_level": 96.9
  },
  {
    "date": "2006-04-29",
    "temp": 0.77,
    "co2": 385.2,
    "pm2_5": 12.8,
    "sea_level": 97.1
  },
  {
    "date": "2006-05-29",
    "temp": 0.51,
    "co2": 384.9,
    "pm2_5": 8.1,
    "sea_level": 96.9
  },
  {
    "date": "2006-06-28",
    "temp": 1.16,
    "co2": 386.4,
    "pm2_5": 10.3,
    "sea_level": 97.0
  },
  {
    "date": "2006-07-28",
    "temp": 1.32,
    "co2": 386.2,
    "pm2_5": 10.7,
    "sea_level": 97.0
  },
  {
    "date": "2006-08-27",
    "temp": 0.7,
    "co2": 386.5,
    "pm2_5": 11.8,
    "sea_level": 96.9
  },
  {
    "date": "2006-09-26",
    "temp": 1.25,
    "co2": 386.7,
    "pm2_5": 8.6,
    "sea_level": 97.9
  },
  {
    "date": "2006-10-26",
    "temp": 1.69,
    "co2": 387.4,
    "pm2_5": 11.1,
    "sea_level": 97.4
  },
  {
    "date": "2006-11-25",
    "temp": 0.84,
    "co2": 386.3,
    "pm2_5": 9.0,
    "sea_level": 97.6
  },
  {
    "date": "2006-12-25",
    "temp": 1.61,
    "co2": 387.5,
    "pm2_5": 11.4,
    "sea_level": 97.9
  },
  {
    "date": "2007-01-24",
    "temp": 1.12,
    "co2": 387.4,
    "pm2_5": 11.5,
    "sea_level": 98.0
  },
  {
    "date": "2007-02-23",
    "temp": 0.55,
    "co2": 387.0,
    "pm2_5": 11.0,
    "sea_level": 97.5
  },
  {
    "date": "2007-03-25",
    "temp": 1.32,
    "co2": 386.8,
    "pm2_5": 12.5,
    "sea_level": 97.5
  },
  {
    "date": "2007-04-24",
    "temp": 1.32,
    "co2": 388.4,
    "pm2_5": 9.2,
    "sea_level": 97.4
  },
  {
    "date": "2007-05-24",
    "temp": 1.66,
    "co2": 388.3,
    "pm2_5": 11.3,
    "sea_level": 97.2
  },
  {
    "date": "2007-06-23",
    "temp": 1.06,
    "co2": 387.6,
    "pm2_5": 9.8,
    "sea_level": 98.1
  },
  {
    "date": "2007-07-23",
    "temp": 1.22,
    "co2": 387.5,
    "pm2_5": 11.2,
    "sea_level": 97.6
  },
  {
    "date": "2007-08-22",
    "temp": 0.76,
    "co2": 388.2,
    "pm2_5": 8.0,
    "sea_level": 97.7
  },
  {
    "date": "2007-09-21",
    "temp": 1.45,
    "co2": 388.8,
    "pm2_5": 10.5,
    "sea_level": 97.5
  },
  {
    "date": "2007-10-21",
    "temp": 1.02,
    "co2": 388.5,
    "pm2_5": 12.1,
    "sea_level": 97.9
  },
  {
    "date": "2007-11-20",
    "temp": 1.22,
    "co2": 389.3,
    "pm2_5": 8.2,
    "sea_level": 98.4
  },
  {
    "date": "2007-12-20",
    "temp": 1.49,
    "co2": 389.1,
    "pm2_5": 12.9,
    "sea_level": 98.1
  },
  {
    "date": "2008-01-19",
    "temp": 1.64,
    "co2": 389.6,
    "pm2_5": 12.7,
    "sea_level": 97.8
  },
  {
    "date": "2008-02-18",
    "temp": 1.37,
    "co2": 389.8,
    "pm2_5": 11.0,
    "sea_level": 98.3
  },
  {
    "date": "2008-03-19",
    "temp": 1.61,
    "co2": 390.2,
    "pm2_5": 9.1,
    "sea_level": 97.5
  },
  {
    "date": "2008-04-18",
    "temp": 0.79,
    "co2": 390.8,
    "pm2_5": 11.2,
    "sea_level": 98.4
  },
  {
    "date": "2008-05-18",
    "temp": 0.99,
    "co2": 391.3,
    "pm2_5": 10.6,
    "sea_level": 97.6
  },
  {
    "date": "2008-06-17",
    "temp": 1.01,
    "co2": 390.0,
    "pm2_5": 12.0,
    "sea_level": 97.8
  },
  {
    "date": "2008-07-17",
    "temp": 1.49,
    "co2": 390.9,
    "pm2_5": 12.9,
    "sea_level": 98.6
  },
  {
    "date": "2008-08-16",
    "temp": 0.58,
    "co2": 391.3,
    "pm2_5": 8.7,
    "sea_level": 98.4
  },
  {
    "date": "2008-09-15",
    "temp": 0.8,
    "co2": 390.4,
    "pm2_5": 11.8,
    "sea_level": 97.8
  },
  {
    "date": "2008-10-15",
    "temp": 0.63,
    "co2": 390.6,
    "pm2_5": 11.7,
    "sea_level": 97.9
  },
  {
    "date": "2008-11-14",
    "temp": 1.14,
    "co2": 391.3,
    "pm2_5": 11.4,
    "sea_level": 98.4
  },
  {
    "date": "2008-12-14",
    "temp": 1.15,
    "co2": 391.4,
    "pm2_5": 12.1,
    "sea_level": 98.7
  },
  {
    "date": "2009-01-13",
    "temp": 0.52,
    "co2": 391.0,
    "pm2_5": 10.5,
    "sea_level": 98.0
  },
  {
    "date": "2009-02-12",
    "temp": 0.5,
    "co2": 392.3,
    "pm2_5": 9.2,
    "sea_level": 98.1
  },
  {
    "date": "2009-03-14",
    "temp": 1.52,
    "co2": 392.8,
    "pm2_5": 11.2,
    "sea_level": 98.8
  },
  {
    "date": "2009-04-13",
    "temp": 1.14,
    "co2": 391.7,
    "pm2_5": 9.1,
    "sea_level": 98.7
  },
  {
    "date": "2009-05-13",
    "temp": 1.3,
    "co2": 392.6,
    "pm2_5": 12.7,
    "sea_level": 98.2
  },
  {
    "date": "2009-06-12",
    "temp": 1.06,
    "co2": 392.1,
    "pm2_5": 12.1,
    "sea_level": 98.5
  },
  {
    "date": "2009-07-12",
    "temp": 0.52,
    "co2": 393.7,
    "pm2_5": 10.5,
    "sea_level": 98.8
  },
  {
    "date": "2009-08-11",
    "temp": 1.46,
    "co2": 393.4,
    "pm2_5": 11.1,
    "sea_level": 98.0
  },
  {
    "date": "2009-09-10",
    "temp": 1.24,
    "co2": 392.7,
    "pm2_5": 11.8,
    "sea_level": 98.7
  },
  {
    "date": "2009-10-10",
    "temp": 0.59,
    "co2": 393.8,
    "pm2_5": 11.6,
    "sea_level": 98.8
  },
  {
    "date": "2009-11-09",
    "temp": 1.54,
    "co2": 394.9,
    "pm2_5": 10.3,
    "sea_level": 98.4
  },
  {
    "date": "2009-12-09",
    "temp": 1.29,
    "co2": 394.9,
    "pm2_5": 8.8,
    "sea_level": 98.6
  },
  {
    "date": "2010-01-08",
    "temp": 0.88,
    "co2": 393.5,
    "pm2_5": 9.8,
    "sea_level": 99.1
  },
  {
    "date": "2010-02-07",
    "temp": 1.51,
    "co2": 395.2,
    "pm2_5": 11.2,
    "sea_level": 98.5
  },
  {
    "date": "2010-03-09",
    "temp": 1.47,
    "co2": 394.7,
    "pm2_5": 8.0,
    "sea_level": 98.4
  },
  {
    "date": "2010-04-08",
    "temp": 0.99,
    "co2": 395.2,
    "pm2_5": 11.1,
    "sea_level": 99.0
  },
  {
    "date": "2010-05-08",
    "temp": 0.55,
    "co2": 395.6,
    "pm2_5": 12.2,
    "sea_level": 98.9
  },
  {
    "date": "2010-06-07",
    "temp": 1.35,
    "co2": 394.4,
    "pm2_5": 10.1,
    "sea_level": 99.2
  },
  {
    "date": "2010-07-07",
    "temp": 1.34,
    "co2": 396.1,
    "pm2_5": 12.0,
    "sea_level": 99.2
  },
  {
    "date": "2010-08-06",
    "temp": 1.25,
    "co2": 395.7,
    "pm2_5": 9.3,
    "sea_level": 99.3
  },
  {
    "date": "2010-09-05",
    "temp": 1.5,
    "co2": 395.8,
    "pm2_5": 8.4,
    "sea_level": 98.7
  },
  {
    "date": "2010-10-05",
    "temp": 1.41,
    "co2": 395.5,
    "pm2_5": 11.2,
    "sea_level": 98.9
  },
  {
    "date": "2010-11-04",
    "temp": 1.49,
    "co2": 396.4,
    "pm2_5": 10.9,
    "sea_level": 98.7
  },
  {
    "date": "2010-12-04",
    "temp": 1.58,
    "co2": 397.1,
    "pm2_5": 10.4,
    "sea_level": 99.0
  },
  {
    "date": "2011-01-03",
    "temp": 1.38,
    "co2": 397.7,
    "pm2_5": 11.5,
    "sea_level": 98.8
  },
  {
    "date": "2011-02-02",
    "temp": 1.31,
    "co2": 397.7,
    "pm2_5": 9.7,
    "sea_level": 99.2
  },
  {
    "date": "2011-03-04",
    "temp": 1.39,
    "co2": 396.7,
    "pm2_5": 8.7,
    "sea_level": 99.0
  },
  {
    "date": "2011-04-03",
    "temp": 0.61,
    "co2": 398.1,
    "pm2_5": 11.7,
    "sea_level": 99.3
  },
  {
    "date": "2011-05-03",
    "temp": 0.83,
    "co2": 397.3,
    "pm2_5": 12.8,
    "sea_level": 99.0
  },
  {
    "date": "2011-06-02",
    "temp": 0.85,
    "co2": 397.1,
    "pm2_5": 8.7,
    "sea_level": 99.4
  },
  {
    "date": "2011-07-02",
    "temp": 0.87,
    "co2": 398.0,
    "pm2_5": 11.2,
    "sea_level": 99.4
  },
  {
    "date": "2011-08-01",
    "temp": 0.75,
    "co2": 397.6,
    "pm2_5": 11.7,
    "sea_level": 99.4
  },
  {
    "date": "2011-08-31",
    "temp": 0.97,
    "co2": 399.1,
    "pm2_5": 12.4,
    "sea_level": 98.9
  },
  {
    "date": "2011-09-30",
    "temp": 0.75,
    "co2": 398.3,
    "pm2_5": 8.3,
    "sea_level": 99.2
  },
  {
    "date": "2011-10-30",
    "temp": 1.44,
    "co2": 399.3,
    "pm2_5": 12.3,
    "sea_level": 99.3
  },
  {
    "date": "2011-11-29",
    "temp": 0.53,
    "co2": 398.6,
    "pm2_5": 11.5,
    "sea_level": 99.3
  },
  {
    "date": "2011-12-29",
    "temp": 0.86,
    "co2": 399.4,
    "pm2_5": 11.8,
    "sea_level": 99.2
  },
  {
    "date": "2012-01-28",
    "temp": 1.67,
    "co2": 399.1,
    "pm2_5": 8.5,
    "sea_level": 99.7
  },
  {
    "date": "2012-02-27",
    "temp": 1.16,
    "co2": 398.9,
    "pm2_5": 11.2,
    "sea_level": 99.9
  },
  {
    "date": "2012-03-28",
    "temp": 1.16,
    "co2": 399.9,
    "pm2_5": 11.5,
    "sea_level": 99.2
  },
  {
    "date": "2012-04-27",
    "temp": 1.19,
    "co2": 400.0,
    "pm2_5": 9.7,
    "sea_level": 99.3
  },
  {
    "date": "2012-05-27",
    "temp": 0.69,
    "co2": 399.3,
    "pm2_5": 8.1,
    "sea_level": 99.1
  },
  {
    "date": "2012-06-26",
    "temp": 1.14,
    "co2": 399.7,
    "pm2_5": 10.0,
    "sea_level": 99.1
  },
  {
    "date": "2012-07-26",
    "temp": 0.84,
    "co2": 401.2,
    "pm2_5": 12.8,
    "sea_level": 99.6
  },
  {
    "date": "2012-08-25",
    "temp": 1.27,
    "co2": 401.7,
    "pm2_5": 8.2,
    "sea_level": 99.8
  },
  {
    "date": "2012-09-24",
    "temp": 0.75,
    "co2": 400.3,
    "pm2_5": 9.5,
    "sea_level": 99.7
  },
  {
    "date": "2012-10-24",
    "temp": 0.89,
    "co2": 401.8,
    "pm2_5": 12.7,
    "sea_level": 99.5
  },
  {
    "date": "2012-11-23",
    "temp": 0.5,
    "co2": 401.0,
    "pm2_5": 8.4,
    "sea_level": 100.1
  },
  {
    "date": "2012-12-23",
    "temp": 0.72,
    "co2": 402.3,
    "pm2_5": 11.9,
    "sea_level": 99.8
  },
  {
    "date": "2013-01-22",
    "temp": 1.57,
    "co2": 401.0,
    "pm2_5": 10.9,
    "sea_level": 99.4
  },
  {
    "date": "2013-02-21",
    "temp": 0.86,
    "co2": 402.9,
    "pm2_5": 11.8,
    "sea_level": 100.0
  },
  {
    "date": "2013-03-23",
    "temp": 1.31,
    "co2": 401.4,
    "pm2_5": 9.6,
    "sea_level": 100.1
  },
  {
    "date": "2013-04-22",
    "temp": 0.55,
    "co2": 402.5,
    "pm2_5": 12.3,
    "sea_level": 100.1
  },
  {
    "date": "2013-05-22",
    "temp": 0.65,
    "co2": 402.4,
    "pm2_5": 11.0,
    "sea_level": 99.6
  },
  {
    "date": "2013-06-21",
    "temp": 0.84,
    "co2": 401.9,
    "pm2_5": 10.7,
    "sea_level": 100.3
  },
  {
    "date": "2013-07-21",
    "temp": 0.96,
    "co2": 402.6,
    "pm2_5": 8.5,
    "sea_level": 99.6
  },
  {
    "date": "2013-08-20",
    "temp": 1.2,
    "co2": 404.0,
    "pm2_5": 11.8,
    "sea_level": 99.6
  },
  {
    "date": "2013-09-19",
    "temp": 1.34,
    "co2": 402.8,
    "pm2_5": 9.0,
    "sea_level": 99.5
  },
  {
    "date": "2013-10-19",
    "temp": 0.51,
    "co2": 404.1,
    "pm2_5": 12.8,
    "sea_level": 100.1
  },
  {
    "date": "2013-11-18",
    "temp": 1.7,
    "co2": 404.7,
    "pm2_5": 11.9,
    "sea_level": 100.1
  },
  {
    "date": "2013-12-18",
    "temp": 0.77,
    "co2": 403.9,
    "pm2_5": 9.6,
    "sea_level": 100.4
  },
  {
    "date": "2014-01-17",
    "temp": 1.05,
    "co2": 404.6,
    "pm2_5": 12.7,
    "sea_level": 100.4
  },
  {
    "date": "2014-02-16",
    "temp": 1.63,
    "co2": 404.9,
    "pm2_5": 12.0,
    "sea_level": 99.7
  },
  {
    "date": "2014-03-18",
    "temp": 1.59,
    "co2": 404.1,
    "pm2_5": 12.3,
    "sea_level": 100.3
  },
  {
    "date": "2014-04-17",
    "temp": 1.34,
    "co2": 404.2,
    "pm2_5": 9.2,
    "sea_level": 100.0
  },
  {
    "date": "2014-05-17",
    "temp": 0.94,
    "co2": 404.7,
    "pm2_5": 11.0,
    "sea_level": 100.6
  },
  {
    "date": "2014-06-16",
    "temp": 0.76,
    "co2": 404.7,
    "pm2_5": 10.8,
    "sea_level": 100.0
  },
  {
    "date": "2014-07-16",
    "temp": 0.69,
    "co2": 405.5,
    "pm2_5": 11.7,
    "sea_level": 100.5
  },
  {
    "date": "2014-08-15",
    "temp": 1.28,
    "co2": 405.4,
    "pm2_5": 8.6,
    "sea_level": 100.8
  },
  {
    "date": "2014-09-14",
    "temp": 1.13,
    "co2": 406.8,
    "pm2_5": 10.8,
    "sea_level": 100.8
  },
  {
    "date": "2014-10-14",
    "temp": 1.42,
    "co2": 406.9,
    "pm2_5": 9.0,
    "sea_level": 100.3
  },
  {
    "date": "2014-11-13",
    "temp": 1.51,
    "co2": 406.5,
    "pm2_5": 10.9,
    "sea_level": 100.9
  },
  {
    "date": "2014-12-13",
    "temp": 1.05,
    "co2": 407.3,
    "pm2_5": 9.4,
    "sea_level": 100.8
  },
  {
    "date": "2015-01-12",
    "temp": 1.38,
    "co2": 405.8,
    "pm2_5": 10.4,
    "sea_level": 100.3
  },
  {
    "date": "2015-02-11",
    "temp": 0.85,
    "co2": 406.5,
    "pm2_5": 12.0,
    "sea_level": 100.7
  },
  {
    "date": "2015-03-13",
    "temp": 1.17,
    "co2": 407.7,
    "pm2_5": 10.6,
    "sea_level": 100.1
  },
  {
    "date": "2015-04-12",
    "temp": 1.55,
    "co2": 406.6,
    "pm2_5": 8.7,
    "sea_level": 100.5
  },
  {
    "date": "2015-05-12",
    "temp": 0.77,
    "co2": 406.6,
    "pm2_5": 8.0,
    "sea_level": 100.6
  },
  {
    "date": "2015-06-11",
    "temp": 1.27,
    "co2": 407.1,
    "pm2_5": 8.8,
    "sea_level": 100.7
  },
  {
    "date": "2015-07-11",
    "temp": 1.61,
    "co2": 407.1,
    "pm2_5": 8.1,
    "sea_level": 101.0
  },
  {
    "date": "2015-08-10",
    "temp": 1.62,
    "co2": 408.4,
    "pm2_5": 11.4,
    "sea_level": 101.1
  },
  {
    "date": "2015-09-09",
    "temp": 1.01,
    "co2": 408.9,
    "pm2_5": 11.2,
    "sea_level": 100.2
  },
  {
    "date": "2015-10-09",
    "temp": 0.72,
    "co2": 407.8,
    "pm2_5": 8.8,
    "sea_level": 100.9
  },
  {
    "date": "2015-11-08",
    "temp": 1.38,
    "co2": 409.6,
    "pm2_5": 10.0,
    "sea_level": 100.6
  },
  {
    "date": "2015-12-08",
    "temp": 1.39,
    "co2": 409.5,
    "pm2_5": 10.3,
    "sea_level": 101.0
  },
  {
    "date": "2016-01-07",
    "temp": 1.19,
    "co2": 408.5,
    "pm2_5": 10.7,
    "sea_level": 100.9
  },
  {
    "date": "2016-02-06",
    "temp": 0.8,
    "co2": 409.7,
    "pm2_5": 12.4,
    "sea_level": 101.1
  },
  {
    "date": "2016-03-07",
    "temp": 1.56,
    "co2": 409.2,
    "pm2_5": 12.8,
    "sea_level": 101.4
  },
  {
    "date": "2016-04-06",
    "temp": 1.23,
    "co2": 410.2,
    "pm2_5": 13.0,
    "sea_level": 101.1
  },
  {
    "date": "2016-05-06",
    "temp": 1.48,
    "co2": 410.6,
    "pm2_5": 12.6,
    "sea_level": 101.3
  },
  {
    "date": "2016-06-05",
    "temp": 0.62,
    "co2": 409.1,
    "pm2_5": 10.9,
    "sea_level": 100.8
  },
  {
    "date": "2016-07-05",
    "temp": 0.88,
    "co2": 410.2,
    "pm2_5": 8.9,
    "sea_level": 101.4
  },
  {
    "date": "2016-08-04",
    "temp": 0.81,
    "co2": 409.8,
    "pm2_5": 9.3,
    "sea_level": 101.0
  },
  {
    "date": "2016-09-03",
    "temp": 0.86,
    "co2": 411.4,
    "pm2_5": 11.8,
    "sea_level": 101.5
  },
  {
    "date": "2016-10-03",
    "temp": 1.48,
    "co2": 409.8,
    "pm2_5": 9.8,
    "sea_level": 101.1
  },
  {
    "date": "2016-11-02",
    "temp": 1.35,
    "co2": 411.7,
    "pm2_5": 11.2,
    "sea_level": 101.6
  },
  {
    "date": "2016-12-02",
    "temp": 0.52,
    "co2": 411.6,
    "pm2_5": 12.4,
    "sea_level": 101.6
  },
  {
    "date": "2017-01-01",
    "temp": 1.1,
    "co2": 411.7,
    "pm2_5": 9.5,
    "sea_level": 101.2
  },
  {
    "date": "2017-01-31",
    "temp": 0.81,
    "co2": 411.9,
    "pm2_5": 11.2,
    "sea_level": 101.6
  },
  {
    "date": "2017-03-02",
    "temp": 1.07,
    "co2": 410.9,
    "pm2_5": 12.7,
    "sea_level": 101.0
  },
  {
    "date": "2017-04-01",
    "temp": 1.41,
    "co2": 412.0,
    "pm2_5": 12.4,
    "sea_level": 101.5
  },
  {
    "date": "2017-05-01",
    "temp": 1.67,
    "co2": 412.8,
    "pm2_5": 10.3,
    "sea_level": 101.5
  },
  {
    "date": "2017-05-31",
    "temp": 0.71,
    "co2": 412.1,
    "pm2_5": 12.6,
    "sea_level": 101.3
  },
  {
    "date": "2017-06-30",
    "temp": 1.14,
    "co2": 412.1,
    "pm2_5": 10.3,
    "sea_level": 101.2
  },
  {
    "date": "2017-07-30",
    "temp": 1.31,
    "co2": 412.1,
    "pm2_5": 12.2,
    "sea_level": 101.6
  },
  {
    "date": "2017-08-29",
    "temp": 1.12,
    "co2": 414.0,
    "pm2_5": 10.5,
    "sea_level": 101.6
  },
  {
    "date": "2017-09-28",
    "temp": 1.17,
    "co2": 412.5,
    "pm2_5": 9.0,
    "sea_level": 101.4
  },
  {
    "date": "2017-10-28",
    "temp": 1.27,
    "co2": 413.7,
    "pm2_5": 8.8,
    "sea_level": 101.2
  },
  {
    "date": "2017-11-27",
    "temp": 0.98,
    "co2": 413.8,
    "pm2_5": 9.4,
    "sea_level": 101.3
  },
  {
    "date": "2017-12-27",
    "temp": 1.61,
    "co2": 413.3,
    "pm2_5": 12.3,
    "sea_level": 102.0
  },
  {
    "date": "2018-01-26",
    "temp": 1.35,
    "co2": 414.7,
    "pm2_5": 11.5,
    "sea_level": 101.5
  },
  {
    "date": "2018-02-25",
    "temp": 1.37,
    "co2": 414.6,
    "pm2_5": 11.0,
    "sea_level": 101.8
  },
  {
    "date": "2018-03-27",
    "temp": 0.76,
    "co2": 414.5,
    "pm2_5": 8.2,
    "sea_level": 101.7
  },
  {
    "date": "2018-04-26",
    "temp": 0.97,
    "co2": 414.5,
    "pm2_5": 10.2,
    "sea_level": 102.1
  },
  {
    "date": "2018-05-26",
    "temp": 1.37,
    "co2": 413.9,
    "pm2_5": 12.0,
    "sea_level": 101.9
  },
  {
    "date": "2018-06-25",
    "temp": 0.82,
    "co2": 414.5,
    "pm2_5": 11.8,
    "sea_level": 101.6
  },
  {
    "date": "2018-07-25",
    "temp": 0.77,
    "co2": 415.4,
    "pm2_5": 8.1,
    "sea_level": 101.3
  },
  {
    "date": "2018-08-24",
    "temp": 1.11,
    "co2": 414.6,
    "pm2_5": 12.0,
    "sea_level": 101.8
  },
  {
    "date": "2018-09-23",
    "temp": 0.84,
    "co2": 416.0,
    "pm2_5": 12.6,
    "sea_level": 102.1
  },
  {
    "date": "2018-10-23",
    "temp": 1.2,
    "co2": 416.1,
    "pm2_5": 11.4,
    "sea_level": 101.9
  },
  {
    "date": "2018-11-22",
    "temp": 1.31,
    "co2": 415.3,
    "pm2_5": 8.5,
    "sea_level": 101.9
  },
  {
    "date": "2018-12-22",
    "temp": 0.6,
    "co2": 415.9,
    "pm2_5": 9.6,
    "sea_level": 102.1
  },
  {
    "date": "2019-01-21",
    "temp": 0.86,
    "co2": 415.7,
    "pm2_5": 11.3,
    "sea_level": 102.1
  },
  {
    "date": "2019-02-20",
    "temp": 1.02,
    "co2": 415.7,
    "pm2_5": 9.0,
    "sea_level": 102.4
  },
  {
    "date": "2019-03-22",
    "temp": 1.63,
    "co2": 416.3,
    "pm2_5": 8.6,
    "sea_level": 102.2
  },
  {
    "date": "2019-04-21",
    "temp": 1.49,
    "co2": 416.5,
    "pm2_5": 11.3,
    "sea_level": 102.0
  },
  {
    "date": "2019-05-21",
    "temp": 0.93,
    "co2": 417.1,
    "pm2_5": 11.1,
    "sea_level": 102.6
  },
  {
    "date": "2019-06-20",
    "temp": 1.2,
    "co2": 417.1,
    "pm2_5": 10.9,
    "sea_level": 102.5
  },
  {
    "date": "2019-07-20",
    "temp": 0.81,
    "co2": 416.7,
    "pm2_5": 10.1,
    "sea_level": 102.0
  },
  {
    "date": "2019-08-19",
    "temp": 1.45,
    "co2": 418.2,
    "pm2_5": 12.8,
    "sea_level": 101.9
  },
  {
    "date": "2019-09-18",
    "temp": 1.55,
    "co2": 417.3,
    "pm2_5": 10.3,
    "sea_level": 101.8
  },
  {
    "date": "2019-10-18",
    "temp": 1.49,
    "co2": 417.7,
    "pm2_5": 12.1,
    "sea_level": 102.4
  },
  {
    "date": "2019-11-17",
    "temp": 1.13,
    "co2": 418.0,
    "pm2_5": 12.9,
    "sea_level": 102.2
  },
  {
    "date": "2019-12-17",
    "temp": 0.68,
    "co2": 417.9,
    "pm2_5": 9.7,
    "sea_level": 102.5
  },
  {
    "date": "2020-01-16",
    "temp": 1.46,
    "co2": 419.5,
    "pm2_5": 11.7,
    "sea_level": 101.9
  },
  {
    "date": "2020-02-15",
    "temp": 0.58,
    "co2": 418.1,
    "pm2_5": 11.8,
    "sea_level": 102.5
  },
  {
    "date": "2020-03-16",
    "temp": 1.29,
    "co2": 419.8,
    "pm2_5": 9.4,
    "sea_level": 102.1
  },
  {
    "date": "2020-04-15",
    "temp": 0.99,
    "co2": 418.7,
    "pm2_5": 11.5,
    "sea_level": 102.5
  },
  {
    "date": "2020-05-15",
    "temp": 0.61,
    "co2": 419.4,
    "pm2_5": 12.2,
    "sea_level": 102.0
  },
  {
    "date": "2020-06-14",
    "temp": 1.18,
    "co2": 419.8,
    "pm2_5": 11.8,
    "sea_level": 102.3
  },
  {
    "date": "2020-07-14",
    "temp": 0.88,
    "co2": 420.1,
    "pm2_5": 9.6,
    "sea_level": 103.0
  },
  {
    "date": "2020-08-13",
    "temp": 1.06,
    "co2": 419.8,
    "pm2_5": 12.7,
    "sea_level": 102.8
  },
  {
    "date": "2020-09-12",
    "temp": 0.99,
    "co2": 421.1,
    "pm2_5": 11.0,
    "sea_level": 102.7
  },
  {
    "date": "2020-10-12",
    "temp": 0.56,
    "co2": 420.5,
    "pm2_5": 9.0,
    "sea_level": 102.8
  },
  {
    "date": "2020-11-11",
    "temp": 0.51,
    "co2": 421.6,
    "pm2_5": 8.3,
    "sea_level": 102.7
  },
  {
    "date": "2020-12-11",
    "temp": 1.08,
    "co2": 420.3,
    "pm2_5": 10.6,
    "sea_level": 102.7
  },
  {
    "date": "2021-01-10",
    "temp": 1.3,
    "co2": 420.5,
    "pm2_5": 9.0,
    "sea_level": 102.4
  },
  {
    "date": "2021-02-09",
    "temp": 1.38,
    "co2": 420.7,
    "pm2_5": 9.2,
    "sea_level": 102.7
  },
  {
    "date": "2021-03-11",
    "temp": 0.84,
    "co2": 421.4,
    "pm2_5": 9.6,
    "sea_level": 103.1
  },
  {
    "date": "2021-04-10",
    "temp": 1.4,
    "co2": 422.5,
    "pm2_5": 9.3,
    "sea_level": 102.9
  },
  {
    "date": "2021-05-10",
    "temp": 1.11,
    "co2": 421.9,
    "pm2_5": 11.7,
    "sea_level": 102.4
  },
  {
    "date": "2021-06-09",
    "temp": 1.52,
    "co2": 422.5,
    "pm2_5": 9.8,
    "sea_level": 103.3
  },
  {
    "date": "2021-07-09",
    "temp": 1.62,
    "co2": 422.1,
    "pm2_5": 8.5,
    "sea_level": 103.1
  },
  {
    "date": "2021-08-08",
    "temp": 1.48,
    "co2": 422.8,
    "pm2_5": 9.2,
    "sea_level": 103.4
  },
  {
    "date": "2021-09-07",
    "temp": 0.55,
    "co2": 423.2,
    "pm2_5": 10.1,
    "sea_level": 102.8
  },
  {
    "date": "2021-10-07",
    "temp": 0.93,
    "co2": 423.0,
    "pm2_5": 12.0,
    "sea_level": 103.1
  },
  {
    "date": "2021-11-06",
    "temp": 0.81,
    "co2": 422.8,
    "pm2_5": 11.6,
    "sea_level": 102.7
  },
  {
    "date": "2021-12-06",
    "temp": 1.24,
    "co2": 424.3,
    "pm2_5": 10.5,
    "sea_level": 102.9
  },
  {
    "date": "2022-01-05",
    "temp": 0.79,
    "co2": 422.7,
    "pm2_5": 12.2,
    "sea_level": 103.2
  },
  {
    "date": "2022-02-04",
    "temp": 1.53,
    "co2": 424.3,
    "pm2_5": 8.1,
    "sea_level": 103.3
  },
  {
    "date": "2022-03-06",
    "temp": 0.65,
    "co2": 424.6,
    "pm2_5": 9.1,
    "sea_level": 102.9
  },
  {
    "date": "2022-04-05",
    "temp": 0.92,
    "co2": 425.1,
    "pm2_5": 11.5,
    "sea_level": 102.7
  },
  {
    "date": "2022-05-05",
    "temp": 0.97,
    "co2": 425.0,
    "pm2_5": 10.5,
    "sea_level": 103.4
  },
  {
    "date": "2022-06-04",
    "temp": 0.74,
    "co2": 424.6,
    "pm2_5": 12.1,
    "sea_level": 103.2
  },
  {
    "date": "2022-07-04",
    "temp": 1.08,
    "co2": 425.5,
    "pm2_5": 12.5,
    "sea_level": 103.2
  },
  {
    "date": "2022-08-03",
    "temp": 0.8,
    "co2": 425.5,
    "pm2_5": 11.6,
    "sea_level": 103.4
  },
  {
    "date": "2022-09-02",
    "temp": 0.9,
    "co2": 424.5,
    "pm2_5": 10.5,
    "sea_level": 103.7
  },
  {
    "date": "2022-10-02",
    "temp": 1.61,
    "co2": 425.7,
    "pm2_5": 12.4,
    "sea_level": 103.6
  },
  {
    "date": "2022-11-01",
    "temp": 1.11,
    "co2": 426.5,
    "pm2_5": 12.2,
    "sea_level": 103.6
  },
  {
    "date": "2022-12-01",
    "temp": 0.92,
    "co2": 425.5,
    "pm2_5": 11.4,
    "sea_level": 103.1
  },
  {
    "date": "2022-12-31",
    "temp": 1.64,
    "co2": 426.6,
    "pm2_5": 11.0,
    "sea_level": 102.9
  },
  {
    "date": "2023-01-30",
    "temp": 1.69,
    "co2": 426.5,
    "pm2_5": 8.6,
    "sea_level": 103.1
  },
  {
    "date": "2023-03-01",
    "temp": 0.74,
    "co2": 427.2,
    "pm2_5": 8.5,
    "sea_level": 103.5
  },
  {
    "date": "2023-03-31",
    "temp": 1.15,
    "co2": 426.9,
    "pm2_5": 9.5,
    "sea_level": 103.6
  },
  {
    "date": "2023-04-30",
    "temp": 0.74,
    "co2": 426.6,
    "pm2_5": 10.9,
    "sea_level": 103.1
  },
  {
    "date": "2023-05-30",
    "temp": 1.35,
    "co2": 426.2,
    "pm2_5": 8.9,
    "sea_level": 103.3
  },
  {
    "date": "2023-06-29",
    "temp": 0.82,
    "co2": 427.7,
    "pm2_5": 9.2,
    "sea_level": 103.4
  },
  {
    "date": "2023-07-29",
    "temp": 1.41,
    "co2": 428.0,
    "pm2_5": 9.4,
    "sea_level": 104.1
  },
  {
    "date": "2023-08-28",
    "temp": 1.53,
    "co2": 427.0,
    "pm2_5": 11.4,
    "sea_level": 104.0
  },
  {
    "date": "2023-09-27",
    "temp": 1.06,
    "co2": 427.9,
    "pm2_5": 9.8,
    "sea_level": 104.0
  },
  {
    "date": "2023-10-27",
    "temp": 1.13,
    "co2": 427.3,
    "pm2_5": 10.1,
    "sea_level": 103.2
  },
  {
    "date": "2023-11-26",
    "temp": 1.68,
    "co2": 428.7,
    "pm2_5": 11.8,
    "sea_level": 103.3
  },
  {
    "date": "2023-12-26",
    "temp": 0.92,
    "co2": 429.3,
    "pm2_5": 12.3,
    "sea_level": 104.0
  },
  {
    "date": "2024-01-25",
    "temp": 0.66,
    "co2": 428.5,
    "pm2_5": 10.5,
    "sea_level": 103.5
  },
  {
    "date": "2024-02-24",
    "temp": 1.05,
    "co2": 428.0,
    "pm2_5": 12.7,
    "sea_level": 103.9
  },
  {
    "date": "2024-03-25",
    "temp": 1.37,
    "co2": 429.4,
    "pm2_5": 12.7,
    "sea_level": 104.3
  },
  {
    "date": "2024-04-24",
    "temp": 1.65,
    "co2": 429.9,
    "pm2_5": 8.5,
    "sea_level": 103.6
  },
  {
    "date": "2024-05-24",
    "temp": 1.28,
    "co2": 429.2,
    "pm2_5": 11.6,
    "sea_level": 104.1
  },
  {
    "date": "2024-06-23",
    "temp": 0.89,
    "co2": 428.9,
    "pm2_5": 8.1,
    "sea_level": 103.5
  },
  {
    "date": "2024-07-23",
    "temp": 1.0,
    "co2": 429.0,
    "pm2_5": 11.3,
    "sea_level": 103.7
  },
  { date: '2024-01-01', temp: 1.05, co2: 420.5, pm2_5: 18.2, sea_level: 98.0 },
  { date: '2024-02-01', temp: 1.10, co2: 420.8, pm2_5: 17.5, sea_level: 98.2 },
  { date: '2024-03-01', temp: 1.15, co2: 421.1, pm2_5: 19.1, sea_level: 98.4 },
  { date: '2024-04-01', temp: 1.20, co2: 421.4, pm2_5: 20.3, sea_level: 98.6 },
  { date: '2024-05-01', temp: 1.25, co2: 421.7, pm2_5: 19.8, sea_level: 98.8 },
  { date: '2024-06-01', temp: 1.30, co2: 422.0, pm2_5: 18.5, sea_level: 99.0 },
  { date: '2024-07-01', temp: 1.28, co2: 422.3, pm2_5: 16.7, sea_level: 99.2 },
  { date: '2024-08-01', temp: 1.32, co2: 422.6, pm2_5: 15.9, sea_level: 99.4 },
  { date: '2024-09-01', temp: 1.37, co2: 422.9, pm2_5: 17.0, sea_level: 99.6 },
  { date: '2024-10-01', temp: 1.42, co2: 423.2, pm2_5: 18.8, sea_level: 99.8 },
  { date: '2024-11-01', temp: 5.47, co2: 423.5, pm2_5: 21.0, sea_level: 100.0 },
  { date: '2024-12-01', temp: 1.52, co2: 423.8, pm2_5: 22.5, sea_level: 100.2 },
  { date: '2025-01-01', temp: 1.55, co2: 424.1, pm2_5: 20.1, sea_level: 100.4 },
  { date: '2025-02-01', temp: 1.58, co2: 424.4, pm2_5: 19.0, sea_level: 100.6 },
  { date: '2025-03-01', temp: 1.61, co2: 424.7, pm2_5: 21.5, sea_level: 100.8 },
  { date: '2025-04-01', temp: 1.64, co2: 425.0, pm2_5: 22.8, sea_level: 101.0 },
  { date: '2025-05-01', temp: 1.67, co2: 425.3, pm2_5: 21.2, sea_level: 101.2 },
  { date: '2025-06-01', temp: 1.70, co2: 425.6, pm2_5: 20.0, sea_level: 101.4 },
  { date: '2025-07-01', temp: 1.73, co2: 425.9, pm2_5: 19.5, sea_level: 101.6 },
  { date: '2025-08-01', temp: 1.76, co2: 426.2, pm2_5: 18.9, sea_level: 101.8 },
  { date: '2025-09-01', temp: 1.79, co2: 426.5, pm2_5: 20.3, sea_level: 102.0 },
  { date: '2025-10-01', temp: 1.82, co2: 426.8, pm2_5: 21.7, sea_level: 102.2 },
]

const chartConfig = {
  temp: {
    label: 'Temperature ℃',
    color: '#f97316', // orange
  },
  co2: {
    label: 'CO2 (ppm)',
    color: '#22c55e', // green
  },
  pm2_5: {
    label: 'PM2.5 (µg/m3)',
    color: '#3b82f6', // blue
  },
  sea_level: {
    label: 'Sea Level (mm)',
    color: '#8b5cf6', // violet
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2025-10-01')
    let daysToSubtract = 90
    if (timeRange === '30d') daysToSubtract = 30
    else if (timeRange === '7d') daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Climate Metrics (Interactive)</CardTitle>
          <CardDescription>
            Global climate indicators from 2024 to present.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {Object.entries(chartConfig).map(([key, config]) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={config.color}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}