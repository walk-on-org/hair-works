import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Iconify from "@/components/iconify";

import { ICityTableFilters, ICityTableFilterValue } from "@/types/city";
import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

type Props = {
  filters: ICityTableFilters;
  onFilters: (name: string, value: ICityTableFilterValue) => void;
  //
  prefectures: IPrefectureItem[];
};

export default function CityTableToolbar({
  filters,
  onFilters,
  //
  prefectures,
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterPrefecture = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters("prfecture", event.target.value);
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
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>都道府県</InputLabel>

          <Select
            value={filters.prefecture}
            onChange={handleFilterPrefecture}
            input={<OutlinedInput label="状態" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {prefectures.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.prefecture.includes(p.id)}
                />
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="市区町村名より探す"
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
