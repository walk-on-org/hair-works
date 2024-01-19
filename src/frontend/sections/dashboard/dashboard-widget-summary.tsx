import { ApexOptions } from "apexcharts";

import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import Chart, { useChart } from "@/components/chart";

import { fNumber } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function DashboardWidgetSummary({
  title,
  total,
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => "",
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });

  return (
    <Card
      sx={{ display: "flex", alignItems: "center", p: 3, ...sx }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Typography variant="h3" gutterBottom>
          {fNumber(total)}
        </Typography>
      </Box>

      <Chart
        dir="ltr"
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width={96}
        height={64}
      />
    </Card>
  );
}
