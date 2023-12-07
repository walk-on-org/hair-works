import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "@/components/iconify";

import {
  ICustomLpTableFilters,
  ICustomLpTableFilterValue,
} from "@/types/custom-lp";

// ----------------------------------------------------------------------

type Props = {
  filters: ICustomLpTableFilters;
  onFilters: (name: string, value: ICustomLpTableFilterValue) => void;
};

export default function CustomLpTableToolbar({ filters, onFilters }: Props) {
  const handleFilterTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("title", event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: "flex-end", md: "center" }}
        direction={{
          xs: "column",
          md: "row",
        }}
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
            value={filters.title}
            onChange={handleFilterTitle}
            placeholder="タイトルより探す"
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
