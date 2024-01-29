import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { fNumber } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
}

export default function ApplicantCountWidgetSummary({
  title,
  total,
  sx,
  ...other
}: Props) {
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
    </Card>
  );
}
