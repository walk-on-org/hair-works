import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "@/components/iconify";

import {
  IInquiryTableFilters,
  IInquiryTableFilterValue,
} from "@/types/inquiry";

// ----------------------------------------------------------------------

type Props = {
  filters: IInquiryTableFilters;
  onFilters: (name: string, value: IInquiryTableFilterValue) => void;
};

export default function InquiryTableToolbar({ filters, onFilters }: Props) {
  const handleFilterSalonName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("salon_name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("name", event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: "flex-end", md: "center" }}
        direction="column"
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.salon_name}
            onChange={handleFilterSalonName}
            placeholder="サロン名/法人名より探す"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="お名前より探す"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}
