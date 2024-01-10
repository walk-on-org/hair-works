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

import { IMemberTableFilters, IMemberTableFilterValue } from "@/types/member";
import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

type Props = {
  filters: IMemberTableFilters;
  onFilters: (name: string, value: IMemberTableFilterValue) => void;
  //
  prefectures: IPrefectureItem[];
  registerSiteOptions: {
    value: string;
    label: string;
  }[];
  registerFormOptions: {
    value: string;
    label: string;
  }[];
  // TODO 登録経路
  introductionGiftStatusOptions: {
    value: string;
    label: string;
  }[];
};

export default function MemberTableToolbar({
  filters,
  onFilters,
  //
  prefectures,
  registerSiteOptions,
  registerFormOptions,
  introductionGiftStatusOptions,
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("name", event.target.value);
    },
    [onFilters]
  );

  const handleFilterEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("email", event.target.value);
    },
    [onFilters]
  );

  const handleFilterPhone = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("phone", event.target.value);
    },
    [onFilters]
  );

  const handleFilterEmpPrefecture = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "emp_prefecture",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterRegisterSite = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "register_site",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterRegisterForm = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "register_form",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterIntroductionGiftStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "introduction_gift_status",
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
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
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

          <TextField
            fullWidth
            value={filters.email}
            onChange={handleFilterEmail}
            placeholder="メールアドレスより探す"
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
            value={filters.phone}
            onChange={handleFilterPhone}
            placeholder="電話番号より探す"
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
            <InputLabel>希望勤務地</InputLabel>

            <Select
              multiple
              value={filters.emp_prefecture}
              onChange={handleFilterEmpPrefecture}
              input={<OutlinedInput label="希望勤務地" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {prefectures.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.emp_prefecture.includes(option.name)}
                  />
                  {option.name}
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
            <InputLabel>登録サイト</InputLabel>

            <Select
              multiple
              value={filters.register_site}
              onChange={handleFilterRegisterSite}
              input={<OutlinedInput label="登録サイト" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {registerSiteOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.register_site.includes(option.label)}
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
            <InputLabel>登録フォーム</InputLabel>

            <Select
              multiple
              value={filters.register_form}
              onChange={handleFilterRegisterForm}
              input={<OutlinedInput label="登録フォーム" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {registerFormOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.register_form.includes(option.label)}
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
            <InputLabel>紹介プレゼントステータス</InputLabel>

            <Select
              multiple
              value={filters.introduction_gift_status}
              onChange={handleFilterIntroductionGiftStatus}
              input={<OutlinedInput label="紹介プレゼントステータス" />}
              renderValue={(selected) =>
                selected.map((value) => value).join(", ")
              }
              sx={{ textTransform: "capitalize" }}
            >
              {introductionGiftStatusOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.introduction_gift_status.includes(
                      option.label
                    )}
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
