import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "@/components/iconify";

import {
  IAdKeywordTableFilters,
  IAdKeywordTableFilterValue,
} from "@/types/ad-keyword";

// ----------------------------------------------------------------------

type Props = {
  filters: IAdKeywordTableFilters;
  onFilters: (name: string, value: IAdKeywordTableFilterValue) => void;
};

export default function AdKeywordTableToolbar({ filters, onFilters }: Props) {
  const handleFilterUtmSource = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utmSource", event.target.value);
    },
    [onFilters]
  );
  const handleFilterUtmMedium = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utmMeidum", event.target.value);
    },
    [onFilters]
  );
  const handleFilterUtmCampaign = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("utmCampaign", event.target.value);
    },
    [onFilters]
  );
  const handleFilterKeywordId = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("keywordId", event.target.value);
    },
    [onFilters]
  );
  const handleFilterAdGroup = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("adGroup", event.target.value);
    },
    [onFilters]
  );
  const handleFilterKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("keyword", event.target.value);
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.utmSource}
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
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.utmMedium}
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
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.utmCampaign}
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
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.keywordId}
            onChange={handleFilterKeywordId}
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
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.adGroup}
            onChange={handleFilterAdGroup}
            placeholder="広告グループより探す"
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
          <TextField
            fullWidth
            value={filters.keyword}
            onChange={handleFilterKeyword}
            placeholder="キーワードより探す"
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
