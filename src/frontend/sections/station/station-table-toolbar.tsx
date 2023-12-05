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
  IStationTableFilters,
  IStationTableFilterValue,
} from "@/types/station";
import { ILineItem } from "@/types/line";
import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

type Props = {
  filters: IStationTableFilters;
  onFilters: (name: string, value: IStationTableFilterValue) => void;
  //
  lines: ILineItem[];
  prefectures: IPrefectureItem[];
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function StationTableToolbar({
  filters,
  onFilters,
  //
  lines,
  prefectures,
  statusOptions,
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "status",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterLine = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "line",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

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
          <InputLabel>状態</InputLabel>

          <Select
            multiple
            value={filters.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="状態" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.label} value={option.label}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.status.includes(option.label)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>路線</InputLabel>

          <Select
            multiple
            value={filters.line}
            onChange={handleFilterLine}
            input={<OutlinedInput label="路線" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {lines.map((l) => (
              <MenuItem key={l.name} value={l.name}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.line.includes(l.name)}
                />
                {l.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            placeholder="駅名より探す"
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
