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

import { ILineTableFilters, ILineTableFilterValue } from "@/types/line";
import { ITrainCompanyItem } from "@/types/train-company";

// ----------------------------------------------------------------------

type Props = {
  filters: ILineTableFilters;
  onFilters: (name: string, value: ILineTableFilterValue) => void;
  //
  trainCompanies: ITrainCompanyItem[];
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function LineTableToolbar({
  filters,
  onFilters,
  //
  trainCompanies,
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

  const handleFilterTrainCompany = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "trainCompany",
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
          <InputLabel>鉄道事業者</InputLabel>

          <Select
            multiple
            value={filters.trainCompany}
            onChange={handleFilterTrainCompany}
            input={<OutlinedInput label="鉄道事業者" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {trainCompanies.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.trainCompany.includes(c.name)}
                />
                {c.name}
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
            placeholder="路線名より探す"
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
