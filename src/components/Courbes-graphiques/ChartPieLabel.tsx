import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS, useColor } from "@/stores/others/color-store"

// Génère une palette en interpolant entre deux couleurs hex
function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

function interpolatePalette(from: string, to: string, steps: number): string[] {
  const [r1, g1, b1] = hexToRgb(from)
  const [r2, g2, b2] = hexToRgb(to)
  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1)
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    return `rgb(${r}, ${g}, ${b})`
  })
}

export function ChartPieLabel() {
  const color  = useColor((s) => s.color)
  const color2 = useColor((s) => s.color2)

  const from = CHART_COLORS[color].stroke
  const to   = CHART_COLORS[color2].stroke

  const [c1, c2, c3, c4, c5] = interpolatePalette(from, to, 5)

  const chartData = [
    { browser: "chrome",  visitors: 275, fill: "var(--color-chrome)"  },
    { browser: "safari",  visitors: 200, fill: "var(--color-safari)"  },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge",    visitors: 173, fill: "var(--color-edge)"    },
    { browser: "other",   visitors: 90,  fill: "var(--color-other)"   },
  ]

  const chartConfig = {
    visitors: { label: "Visitors" },
    chrome:   { label: "Chrome",  color: c1 },
    safari:   { label: "Safari",  color: c2 },
    firefox:  { label: "Firefox", color: c3 },
    edge:     { label: "Edge",    color: c4 },
    other:    { label: "Other",   color: c5 },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}