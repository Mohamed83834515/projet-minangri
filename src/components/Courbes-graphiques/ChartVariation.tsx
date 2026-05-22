import { Bar, BarChart, XAxis } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { CHART_COLORS, useColor } from "@/stores/others/color-store"

const chartData = [
  { month: "January",  desktop: 186, mobile: 80  },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March",    desktop: 237, mobile: 120 },
  { month: "April",    desktop: 73,  mobile: 190 },
  { month: "May",      desktop: 209, mobile: 130 },
  { month: "June",     desktop: 214, mobile: 140 },
]

const ChartVariation = () => {
  const color  = useColor((s) => s.color)
  const color2 = useColor((s) => s.color2)

  const colorDesktop = CHART_COLORS[color].stroke
  const colorMobile  = CHART_COLORS[color2].stroke

  const chartConfig = {
    desktop: { label: "Desktop", color: colorDesktop },
    mobile:  { label: "Mobile",  color: colorMobile  },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile"  fill="var(--color-mobile)"  radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export default ChartVariation