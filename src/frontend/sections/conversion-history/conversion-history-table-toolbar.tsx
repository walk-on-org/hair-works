import { useCallback, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Iconify from "@/components/iconify";

import { IConversionHistoryTableFilters } from "@/types/conversion-history";

// ----------------------------------------------------------------------

type Props = {
  filters: IConversionHistoryTableFilters;
  searchLoading: boolean;
  onFilters: (newFilters: IConversionHistoryTableFilters) => void;
  onClearFilters: () => void;
};

export default function ConversionHistoryTableToolbar({
  filters,
  searchLoading,
  onFilters,
  onClearFilters,
}: Props) {
  const [utmSource, setUtmSource] = useState(filters.utm_source);
  const [utmMedium, setUtmMedium] = useState(filters.utm_medium);
  const [utmCampaign, setUtmCampaign] = useState(filters.utm_campaign);
  const [utmTerm, setUtmTerm] = useState(filters.utm_term);
  const [lpUrl, setLpUrl] = useState(filters.lp_url);
  const [lpStartDate, setLpStartDate] = useState(filters.lp_start_date);
  const [lpEndDate, setLpEndDate] = useState(filters.lp_end_date);
  const [cvUrl, setCvUrl] = useState(filters.cv_url);
  const [cvStartDate, setCvStartDate] = useState(filters.cv_start_date);
  const [cvEndDate, setCvEndDate] = useState(filters.cv_end_date);

  const handleFilterUtmSource = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUtmSource(event.target.value);
  };

  const handleFilterUtmMedium = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUtmMedium(event.target.value);
  };
  const handleFilterUtmCampaign = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUtmCampaign(event.target.value);
  };
  const handleFilterUtmTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUtmTerm(event.target.value);
  };
  const handleFilterLpUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLpUrl(event.target.value);
  };
  const handleFilterLpStartDate = (newValue: Date | null) => {
    setLpStartDate(newValue);
  };
  const handleFilterLpEndDate = (newValue: Date | null) => {
    setLpEndDate(newValue);
  };
  const handleFilterCvUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCvUrl(event.target.value);
  };
  const handleFilterCvStartDate = (newValue: Date | null) => {
    setCvStartDate(newValue);
  };
  const handleFilterCvEndDate = (newValue: Date | null) => {
    setCvEndDate(newValue);
  };

  const handleFilter = useCallback(() => {
    const newFilters: IConversionHistoryTableFilters = {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      lp_url: lpUrl,
      lp_start_date: lpStartDate,
      lp_end_date: lpEndDate,
      cv_url: cvUrl,
      cv_start_date: cvStartDate,
      cv_end_date: cvEndDate,
    };
    onFilters(newFilters);
  }, [
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    lpUrl,
    lpStartDate,
    lpEndDate,
    cvUrl,
    cvStartDate,
    cvEndDate,
    onFilters,
  ]);

  const handleClear = useCallback(() => {
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
    setUtmTerm("");
    setLpUrl("");
    setLpStartDate(null);
    setLpEndDate(null);
    setCvUrl("");
    setCvStartDate(null);
    setCvEndDate(null);
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
              direction={{
                xs: "column",
                md: "row",
              }}
              alignItems="center"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <TextField
                fullWidth
                label="参照元"
                value={utmSource}
                onChange={handleFilterUtmSource}
                placeholder="参照元より探す"
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
                label="メディア"
                value={utmMedium}
                onChange={handleFilterUtmMedium}
                placeholder="メディアより探す"
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
                label="キャンペーン"
                value={utmCampaign}
                onChange={handleFilterUtmCampaign}
                placeholder="キャンペーンより探す"
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
                label="キーワードID"
                value={utmTerm}
                onChange={handleFilterUtmTerm}
                placeholder="キーワードIDより探す"
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
              direction={{
                xs: "column",
                md: "row",
              }}
              alignItems="center"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <TextField
                fullWidth
                label="LP URL"
                value={lpUrl}
                onChange={handleFilterLpUrl}
                placeholder="LP URLより探す"
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

              <DatePicker
                label="LP日付（開始）"
                value={lpStartDate}
                onChange={handleFilterLpStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />

              <DatePicker
                label="LP日付（終了）"
                value={lpEndDate}
                onChange={handleFilterLpEndDate}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />
            </Stack>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              alignItems="center"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <TextField
                fullWidth
                label="CV URL"
                value={cvUrl}
                onChange={handleFilterCvUrl}
                placeholder="CV URLより探す"
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

              <DatePicker
                label="CV日付（開始）"
                value={cvStartDate}
                onChange={handleFilterCvStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />

              <DatePicker
                label="CV日付（終了）"
                value={cvEndDate}
                onChange={handleFilterCvEndDate}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{
                  maxWidth: { md: 200 },
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
