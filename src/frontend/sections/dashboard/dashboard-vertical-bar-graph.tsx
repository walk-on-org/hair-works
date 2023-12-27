import { ApexOptions } from "apexcharts";

import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";

import Chart, { useChart } from "@/components/chart";
import { fNumber } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
}

export default function DashboardVerticalBarGraph({
  title,
  subheader,
  chart,
  ...other
}: Props) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
      },
    },
    ...options,
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart
            dir="ltr"
            type="bar"
            series={series}
            options={chartOptions}
            width="100%"
            height={364}
          />
        </Box>
      </Card>
    </>
  );
}
