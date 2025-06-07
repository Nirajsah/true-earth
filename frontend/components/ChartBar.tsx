'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartData = [
  { month: 'January', co2: 186, methane: 40, pm25: 10 },
  { month: 'February', co2: 305, methane: 50, pm25: 12 },
  { month: 'March', co2: 237, methane: 60, pm25: 15 },
  { month: 'April', co2: 73, methane: 30, pm25: 8 },
  { month: 'May', co2: 209, methane: 70, pm25: 18 },
  { month: 'June', co2: 214, methane: 45, pm25: 11 },
]

const chartConfig = {
  co2: {
    label: 'CO2',
    color: 'hsl(var(--chart-1))',
  },
  methane: {
    label: 'Methane',
    color: 'hsl(var(--chart-2))',
  },
  pm25: {
    label: 'PM2.5',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function ChartBarDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full" height={200}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="co2" fill="var(--color-co2)" radius={8} />
            <Bar dataKey="methane" fill="var(--color-methane)" radius={8} />
            <Bar dataKey="pm25" fill="var(--color-pm25)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total emissions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
