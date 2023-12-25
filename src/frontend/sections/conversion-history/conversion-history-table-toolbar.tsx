import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Iconify from "@/components/iconify";

import {
  IConversionHistoryTableFilters,
  IConversionHistoryTableFilterValue,
} from "@/types/conversion-history";

// ----------------------------------------------------------------------

type Props = {
  filters: IConversionHistoryTableFilters;
  onFilters: (name: string, value: IConversionHistoryTableFilterValue) => void;
};

export default function COnversionHistoryTableToolbar({
  filters,
  onFilters,
}: Props) {
  const handleFilterUtmSource = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utm_source", event.target.value);
    },
    [onFilters]
  );

  const handleFilterUtmMedium = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utm_medium", event.target.value);
    },
    [onFilters]
  );

  const handleFilterUtmCampaign = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utm_campaign", event.target.value);
    },
    [onFilters]
  );

  const handleFilterUtmTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utm_term", event.target.value);
    },
    [onFilters]
  );

  const handleFilterLpUrl = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("lp_url", event.target.value);
    },
    [onFilters]
  );
  const handleFilterLpStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters("lp_start_date", newValue);
    },
    [onFilters]
  );

  const handleFilterLpEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters("lp_end_date", newValue);
    },
    [onFilters]
  );

  const handleFilterCvUrl = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("cv_url", event.target.value);
    },
    [onFilters]
  );

  const handleFilterCvStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters("cv_start_date", newValue);
    },
    [onFilters]
  );

  const handleFilterCvEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters("cv_end_date", newValue);
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
            value={filters.utm_source}
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
            value={filters.utm_medium}
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
            value={filters.utm_campaign}
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
            value={filters.utm_term}
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
            value={filters.lp_url}
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
            value={filters.lp_start_date}
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
            value={filters.lp_end_date}
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
            value={filters.lp_url}
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
            value={filters.cv_start_date}
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
            value={filters.cv_end_date}
            onChange={handleFilterCvEndDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 200 },
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}
