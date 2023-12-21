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
  IApplicantTableFilters,
  IApplicantTableFilterValue,
} from "@/types/applicant";

// ----------------------------------------------------------------------

type Props = {
  filters: IApplicantTableFilters;
  onFilters: (name: string, value: IApplicantTableFilterValue) => void;
  //
  // TODO 登録経路
};

export default function ApplicantTableToolbar({ filters, onFilters }: Props) {
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
            value={filters.name}
            onChange={handleFilterName}
            placeholder="氏名より探す"
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
