import { useCallback, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Iconify from "@/components/iconify";

import { IApplicantTableFilters } from "@/types/applicant";

// ----------------------------------------------------------------------

type Props = {
  filters: IApplicantTableFilters;
  searchLoading: boolean;
  onFilters: (newFilters: IApplicantTableFilters) => void;
  onClearFilters: () => void;
  //
  // TODO 登録経路
};

export default function ApplicantTableToolbar({
  filters,
  searchLoading,
  onFilters,
  onClearFilters,
}: Props) {
  const [corporationName, setCorporationName] = useState(
    filters.corporation_name
  );
  const [officeName, setOfficeName] = useState(filters.office_name);
  const [name, setName] = useState(filters.name);

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

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleFilter = useCallback(() => {
    const newFilters: IApplicantTableFilters = {
      corporation_name: corporationName,
      office_name: officeName,
      name: name,
    };
    onFilters(newFilters);
  }, [corporationName, officeName, name, onFilters]);

  const handleClear = useCallback(() => {
    setCorporationName("");
    setOfficeName("");
    setName("");
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
              direction="row"
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
                label="氏名"
                value={name}
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
