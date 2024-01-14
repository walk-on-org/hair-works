import { useCallback, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Iconify from "@/components/iconify";

import { IHistoryTableFilters } from "@/types/history";
import { IJobCategoryItem } from "@/types/job-category";
import { IPositionItem } from "@/types/position";
import { IEmploymentItem } from "@/types/employment";

// ----------------------------------------------------------------------

type Props = {
  filters: IHistoryTableFilters;
  searchLoading: boolean;
  onFilters: (newFilters: IHistoryTableFilters) => void;
  onClearFilters: () => void;
  //
  jobCategories: IJobCategoryItem[];
  positions: IPositionItem[];
  employments: IEmploymentItem[];
};

export default function HistoryTableToolbar({
  filters,
  searchLoading,
  onFilters,
  onClearFilters,
  //
  jobCategories,
  positions,
  employments,
}: Props) {
  const [corporationName, setCorporationName] = useState(
    filters.corporation_name
  );
  const [officeName, setOfficeName] = useState(filters.office_name);
  const [jobName, setJobName] = useState(filters.job_name);
  const [jobCategory, setJobCategory] = useState(filters.job_category);
  const [position, setPosition] = useState(filters.position);
  const [employment, setEmployment] = useState(filters.employment);

  const handleFilterCorporationName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCorporationName(event.target.value);
  };
  const handleFilterOfficeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOfficeName(event.target.value);
  };
  const handleFilterJobName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobName(event.target.value);
  };
  const handleFilterJobCategory = (event: SelectChangeEvent<string[]>) => {
    setJobCategory(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  const handleFilterPosition = (event: SelectChangeEvent<string[]>) => {
    setPosition(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  const handleFilterEmployment = (event: SelectChangeEvent<string[]>) => {
    setEmployment(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleFilter = useCallback(() => {
    const newFilters: IHistoryTableFilters = {
      corporation_name: corporationName,
      office_name: officeName,
      job_name: jobName,
      job_category: jobCategory,
      position: position,
      employment: employment,
    };
    onFilters(newFilters);
  }, [
    corporationName,
    officeName,
    jobName,
    jobCategory,
    position,
    employment,
    onFilters,
  ]);

  const handleClear = useCallback(() => {
    setCorporationName("");
    setOfficeName("");
    setJobName("");
    setJobCategory([]);
    setPosition([]);
    setEmployment([]);
    onClearFilters();
  }, [onClearFilters]);

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        >
          <Typography variant="subtitle1">検索条件</Typography>
        </AccordionSummary>

        <AccordionDetails>
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
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <TextField
                fullWidth
                label="法人名"
                value={corporationName}
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
                label="事業所名"
                value={officeName}
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
                label="求人名"
                value={jobName}
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
              direction={{ xs: "column", md: "row" }}
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
                  value={jobCategory}
                  onChange={handleFilterJobCategory}
                  input={<OutlinedInput label="職種" />}
                  renderValue={(selected) =>
                    selected.map((value) => value).join(", ")
                  }
                  sx={{ textTransform: "capitalize" }}
                >
                  {jobCategories.map((row) => (
                    <MenuItem key={row.name} value={row.name}>
                      <Checkbox
                        disableRipple
                        size="small"
                        checked={jobCategory.includes(row.name)}
                      />
                      {row.name}
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
                  value={position}
                  onChange={handleFilterPosition}
                  input={<OutlinedInput label="役職/役割" />}
                  renderValue={(selected) =>
                    selected.map((value) => value).join(", ")
                  }
                  sx={{ textTransform: "capitalize" }}
                >
                  {positions.map((row) => (
                    <MenuItem key={row.name} value={row.name}>
                      <Checkbox
                        disableRipple
                        size="small"
                        checked={position.includes(row.name)}
                      />
                      {row.name}
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
                  value={employment}
                  onChange={handleFilterEmployment}
                  input={<OutlinedInput label="雇用形態" />}
                  renderValue={(selected) =>
                    selected.map((value) => value).join(", ")
                  }
                  sx={{ textTransform: "capitalize" }}
                >
                  {employments.map((row) => (
                    <MenuItem key={row.name} value={row.name}>
                      <Checkbox
                        disableRipple
                        size="small"
                        checked={employment.includes(row.name)}
                      />
                      {row.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <LoadingButton
                loading={searchLoading}
                variant="outlined"
                onClick={handleClear}
              >
                クリア
              </LoadingButton>

              <LoadingButton
                loading={searchLoading}
                variant="contained"
                onClick={handleFilter}
                sx={{ display: "flex", gap: 1 }}
              >
                <Iconify icon="eva:search-fill" />
                検索
              </LoadingButton>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
