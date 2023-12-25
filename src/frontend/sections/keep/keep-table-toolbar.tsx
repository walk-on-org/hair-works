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

import { IKeepTableFilters, IKeepTableFilterValue } from "@/types/keep";
import { IJobCategoryItem } from "@/types/job-category";
import { IPositionItem } from "@/types/position";
import { IEmploymentItem } from "@/types/employment";

// ----------------------------------------------------------------------

type Props = {
  filters: IKeepTableFilters;
  onFilters: (name: string, value: IKeepTableFilterValue) => void;
  //
  jobCategories: IJobCategoryItem[];
  positions: IPositionItem[];
  employments: IEmploymentItem[];
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function KeepTableToolbar({
  filters,
  onFilters,
  //
  jobCategories,
  positions,
  employments,
  statusOptions,
}: Props) {
  const handleFilterCorporationName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("corporation_name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterOfficeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("office_name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterJobName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("job_name", event.target.value);
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

  const handleFilterJobCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "job_category",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterPosition = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "position",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterEmployment = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "employment",
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
            value={filters.corporation_name}
            onChange={handleFilterCorporationName}
            placeholder="法人名より探す"
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
            value={filters.office_name}
            onChange={handleFilterOfficeName}
            placeholder="事業所名より探す"
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
            value={filters.job_name}
            onChange={handleFilterJobName}
            placeholder="求人名より探す"
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

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 200 },
            }}
          >
            <InputLabel>職種</InputLabel>

            <Select
              multiple
              value={filters.job_category}
              onChange={handleFilterJobCategory}
              input={<OutlinedInput label="職種" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {jobCategories.map((jobCategory) => (
                <MenuItem key={jobCategory.name} value={jobCategory.name}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.job_category.includes(jobCategory.name)}
                  />
                  {jobCategory.name}
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
            <InputLabel>役職/役割</InputLabel>

            <Select
              multiple
              value={filters.position}
              onChange={handleFilterPosition}
              input={<OutlinedInput label="役職/役割" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {positions.map((position) => (
                <MenuItem key={position.name} value={position.name}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.position.includes(position.name)}
                  />
                  {position.name}
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
            <InputLabel>雇用形態</InputLabel>

            <Select
              multiple
              value={filters.employment}
              onChange={handleFilterEmployment}
              input={<OutlinedInput label="雇用形態" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {employments.map((employment) => (
                <MenuItem key={employment.name} value={employment.name}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.employment.includes(employment.name)}
                  />
                  {employment.name}
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
        </Stack>
      </Stack>
    </>
  );
}
