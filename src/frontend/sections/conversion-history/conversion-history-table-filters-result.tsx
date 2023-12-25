import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack, { StackProps } from "@mui/material/Stack";

import Iconify from "@/components/iconify";

import {
  IConversionHistoryTableFilters,
  IConversionHistoryTableFilterValue,
} from "@/types/conversion-history";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IConversionHistoryTableFilters;
  onFilters: (name: string, value: IConversionHistoryTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function ConversionHistoryTableFiltersResult({
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

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          クリア
        </Button>
      </Stack>
    </Stack>
  );
}
