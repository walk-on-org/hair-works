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

import {
  IHtmlAddContentTableFilters,
  IHtmlAddContentTableFilterValue,
} from "@/types/html-add-content";
import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

type Props = {
  filters: IHtmlAddContentTableFilters;
  onFilters: (name: string, value: IHtmlAddContentTableFilterValue) => void;
  //
  prefectures: IPrefectureItem[];
};

export default function HtmlAddContentTableToolbar({
  filters,
  onFilters,
  //
  prefectures,
}: Props) {
  const handleFilterPrefecture = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "prefecture",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
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
            multiple
            value={filters.prefecture}
            onChange={handleFilterPrefecture}
            input={<OutlinedInput label="都道府県" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {prefectures.map((p) => (
              <MenuItem key={p.name} value={p.name}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.prefecture.includes(p.name)}
                />
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
