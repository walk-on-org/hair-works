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

import { IMemberTableFilters } from "@/types/member";
import { IPrefectureItem } from "@/types/prefecture";

// ----------------------------------------------------------------------

type Props = {
  filters: IMemberTableFilters;
  searchLoading: boolean;
  onFilters: (newFilters: IMemberTableFilters) => void;
  onClearFilters: () => void;
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
  searchLoading,
  onFilters,
  onClearFilters,
  //
  prefectures,
  registerSiteOptions,
  registerFormOptions,
  introductionGiftStatusOptions,
}: Props) {
  const [name, setName] = useState(filters.name);
  const [email, setEmail] = useState(filters.email);
  const [phone, setPhone] = useState(filters.phone);
  const [empPrefecture, setEmpPrefecture] = useState(filters.emp_prefecture);
  const [registerSite, setRegisterSite] = useState(filters.register_site);
  const [registerForm, setRegisterForm] = useState(filters.register_form);
  const [introductionGiftStatus, setIntroductionGiftStatus] = useState(
    filters.introduction_gift_status
  );

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleFilterEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleFilterPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const handleFilterEmpPrefecture = (event: SelectChangeEvent<string[]>) => {
    setEmpPrefecture(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  const handleFilterRegisterSite = (event: SelectChangeEvent<string[]>) => {
    setRegisterSite(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  const handleFilterRegisterForm = (event: SelectChangeEvent<string[]>) => {
    setRegisterForm(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };
  const handleFilterIntroductionGiftStatus = (
    event: SelectChangeEvent<string[]>
  ) => {
    setIntroductionGiftStatus(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleFilter = useCallback(() => {
    const newFilters: IMemberTableFilters = {
      name: name,
      email: email,
      phone: phone,
      emp_prefecture: empPrefecture,
      register_site: registerSite,
      register_form: registerForm,
      introduction_gift_status: introductionGiftStatus,
    };
    onFilters(newFilters);
  }, [
    name,
    email,
    phone,
    empPrefecture,
    registerSite,
    registerForm,
    introductionGiftStatus,
    onFilters,
  ]);

  const handleClear = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setEmpPrefecture([]);
    setRegisterSite([]);
    setRegisterForm([]);
    setIntroductionGiftStatus([]);
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

              <TextField
                fullWidth
                label="メールアドレス"
                value={email}
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
                label="電話番号"
                value={phone}
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
                  value={empPrefecture}
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
                        checked={empPrefecture.includes(option.name)}
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
                  value={registerSite}
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
                        checked={registerSite.includes(option.label)}
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
                  value={registerForm}
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
                        checked={registerForm.includes(option.label)}
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
                  value={introductionGiftStatus}
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
                        checked={introductionGiftStatus.includes(option.label)}
                      />
                      {option.label}
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
