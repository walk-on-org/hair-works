import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";

import {
  IGovernmentCityTableFilters,
  IGovernmentCityTableFilterValue,
} from "@/types/government-city";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IGovernmentCityTableFilters;
  onFilters: (name: string, value: IGovernmentCityTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function GovernmentCityTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: "body2" }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: "text.secondary", ml: 0.25 }}>
          件 見つかりました
        </Box>
      </Box>
    </Stack>
  );
}
