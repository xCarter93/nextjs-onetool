"use client";

import { TrendingDown } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "A bar chart";

const chartData = [
  { month: "January", desktop: 342, mobile: 245, tablet: 123 },
  { month: "February", desktop: 876, mobile: 654, tablet: 234 },
  { month: "April", desktop: 629, mobile: 521, tablet: 267 },
  { month: "June", desktop: 781, mobile: 598, tablet: 321 },
  { month: "July", desktop: 394, mobile: 312, tablet: 145 },
  { month: "September", desktop: 647, mobile: 489, tablet: 212 },
  { month: "October", desktop: 532, mobile: 476, tablet: 187 },
  { month: "December", desktop: 271, mobile: 198, tablet: 123 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type ActiveProperty = keyof typeof chartConfig | "all";
type AnyActiveProperty = string | "all";

export function GlowingBarVerticalChart() {
  const [activeProperty, setActiveProperty] =
    React.useState<ActiveProperty>("all");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>
            Vertical Bar Chart
            <Badge
              variant="outline"
              className="text-red-500 bg-red-500/10 border-none ml-2"
            >
              <TrendingDown className="h-4 w-4" />
              <span>-5.2%</span>
            </Badge>
          </CardTitle>
          <Select
            value={activeProperty}
            onValueChange={(value: ActiveProperty) => {
              setActiveProperty(value);
            }}
          >
            <SelectTrigger className="text-xs !h-6 !px-1.5">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Properties</SelectLabel>
                <SelectItem className="text-xs" value="all">
                  All
                </SelectItem>
                <SelectItem className="text-xs" value="desktop">
                  Desktop
                </SelectItem>
                <SelectItem className="text-xs" value="mobile">
                  Mobile
                </SelectItem>
                <SelectItem className="text-xs" value="tablet">
                  Tablet
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -15,
            }}
          >
            <YAxis
              type="category"
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis
              type="number"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              stackId="a"
              barSize={8}
              className="dark:text-[#1A1A1C] text-[#E4E4E7]"
              dataKey="mobile"
              fill="var(--color-mobile)"
              radius={4}
              shape={<CustomGradientBar activeProperty={activeProperty} />}
              background={{ fill: "currentColor", radius: 4 }} // Only Top Bar will have background else it will give render errors
              overflow="visible"
            />
            <Bar
              stackId="a"
              barSize={8}
              shape={<CustomGradientBar activeProperty={activeProperty} />}
              dataKey="tablet"
              fill="var(--color-tablet)"
              radius={4}
              overflow="visible"
            />
            <Bar
              stackId="a"
              barSize={8}
              shape={<CustomGradientBar activeProperty={activeProperty} />}
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={4}
              overflow="visible"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomGradientBar = (
  props: React.SVGProps<SVGRectElement> & {
    dataKey?: string;
    activeProperty?: AnyActiveProperty | null;
    glowOpacity?: number;
  }
) => {
  const { fill, x, y, width, height, dataKey, activeProperty, radius } = props;

  const isActive = activeProperty === "all" ? true : activeProperty === dataKey;

  return (
    <>
      <rect
        x={x}
        y={y}
        rx={radius}
        width={width}
        height={height}
        stroke="none"
        fill={fill}
        opacity={isActive ? 1 : 0.1}
        filter={
          isActive && activeProperty !== "all"
            ? `url(#glow-chart-${dataKey})`
            : undefined
        }
      />
      <defs>
        <filter
          id={`glow-chart-${dataKey}`}
          x="-200%"
          y="-200%"
          width="600%"
          height="600%"
        >
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </>
);

// Close arrow function properly
};

// Flexible variant for reuse in modals and dashboards
export interface GlowingBarVerticalProps {
  data: Array<Record<string, string | number>>;
  config: ChartConfig; // keys map to data keys for series
  xAxisKey: string; // category field, e.g., "weekday"
  series: string[]; // series keys to render
  showCard?: boolean;
  title?: string;
  description?: string;
  id?: string; // optional stable id for gradients
}

export function GlowingBarVerticalChartCore({
  data,
  config,
  xAxisKey,
  series,
  showCard = false,
  title = "",
  description = "",
  id,
}: GlowingBarVerticalProps) {
  const [activeProperty, setActiveProperty] = React.useState<AnyActiveProperty>("all");

  const content = (
    <ChartContainer id={id} config={config} className="h-[220px]">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: -15 }}>
        <YAxis
          type="category"
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: unknown) =>
            typeof value === "string"
              ? value.slice(0, 3)
              : String(value).slice(0, 3)
          }
        />
        <XAxis type="number" tickLine={false} tickMargin={10} axisLine={false} hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        {series.map((key) => (
          <Bar
            key={key}
            stackId="a"
            barSize={8}
            dataKey={key}
            fill={`var(--color-${key})`}
            className="dark:text-[#1A1A1C] text-[#E4E4E7]"
            radius={4}
            shape={<CustomGradientBar activeProperty={activeProperty} />}
            overflow="visible"
          />
        ))}
      </BarChart>
    </ChartContainer>
  );

  if (!showCard) return content;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>{title}</CardTitle>
          {series.length > 1 && (
            <select
              className="text-xs h-6 px-1.5 rounded-md bg-transparent border border-border/50"
              value={activeProperty}
              onChange={(e) => setActiveProperty(e.target.value as AnyActiveProperty)}
            >
              <option value="all">All</option>
              {series.map((s) => (
                <option key={s} value={s}>
                  {config[s]?.label?.toString?.() || s}
                </option>
              ))}
            </select>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
