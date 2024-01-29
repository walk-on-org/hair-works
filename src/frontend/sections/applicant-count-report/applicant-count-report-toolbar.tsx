import { useCallback, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Iconify from "@/components/iconify";

import { IApplicantCountReportFilters } from "@/types/applicant-count-report";
import { IGovernmentCityItem } from "@/types/government-city";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { CardHeader } from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  filters: IApplicantCountReportFilters;
  searchLoading: boolean;
  onFilters: (newFilters: IApplicantCountReportFilters) => void;
  onClearFilters: () => void;
  //
  prefectures: IPrefectureItem[];
  governmentCities: IGovernmentCityItem[];
  cities: ICityItem[];
};

export default function ApplicantCountReportToolbar({
  filters,
  searchLoading,
  onFilters,
  onClearFilters,
  //
  prefectures,
  governmentCities,
  cities,
}: Props) {
  const [prefectureId, setPrefectureId] = useState(filters.prefecture_id);
  const [governmentCityId, setGovernmentCityId] = useState(
    filters.government_city_id
  );
  const [cityId, setCityId] = useState(filters.city_id);
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);

  // 都道府県が設定済の場合、該当の市区町村を選択肢に設定
  const [searchCities, setSearchCitis] = useState<ICityItem[]>([]);
  useEffect(() => {
    if (prefectureId) {
      const filterCities = cities.filter(
        (city) => city.prefecture_id == prefectureId
      );
      setSearchCitis(filterCities);
    } else {
      setSearchCitis([]);
    }
  }, [prefectureId]);

  const handleFilterPrefectureId = (event: SelectChangeEvent<string>) => {
    setPrefectureId(event.target.value);
  };
  const handleFilterGovernmentCityId = (event: SelectChangeEvent<string>) => {
    setGovernmentCityId(event.target.value);
  };
  const handleFilterCityId = (event: SelectChangeEvent<string>) => {
    setCityId(event.target.value);
  };
  const handleFilterFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value);
  };
  const handleFilterTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const handleFilter = useCallback(() => {
    const newFilters: IApplicantCountReportFilters = {
      prefecture_id: prefectureId,
      government_city_id: governmentCityId,
      city_id: cityId,
      from: from,
      to: to,
    };
    onFilters(newFilters);
  }, [prefectureId, governmentCityId, cityId, from, to, onFilters]);

  const handleClear = useCallback(() => {
    setPrefectureId("");
    setGovernmentCityId("");
    setCityId("");
    setFrom("");
    setTo("");
    onClearFilters();
  }, [onClearFilters]);

  return (
    <>
      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <CardHeader title="検索条件" />
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
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 200 },
              }}
            >
              <InputLabel>都道府県</InputLabel>

              <Select
                value={prefectureId}
                onChange={handleFilterPrefectureId}
                input={<OutlinedInput label="都道府県" />}
                renderValue={(selected) =>
                  prefectures.find((row) => {
                    return row.id == selected;
                  })?.name
                }
                sx={{ textTransform: "capitalize" }}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {prefectures.map((p) => (
                  <MenuItem key={p.name} value={p.id}>
                    {p.name}
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
              <InputLabel>政令指定都市</InputLabel>

              <Select
                value={governmentCityId}
                onChange={handleFilterGovernmentCityId}
                input={<OutlinedInput label="政令指定都市" />}
                renderValue={(selected) => selected}
                sx={{ textTransform: "capitalize" }}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {governmentCities.map((gc) => (
                  <MenuItem key={gc.name} value={gc.id}>
                    {gc.name}
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
              <InputLabel>市区町村</InputLabel>

              <Select
                value={cityId}
                onChange={handleFilterCityId}
                input={<OutlinedInput label="市区町村" />}
                renderValue={(selected) =>
                  searchCities.find((row) => {
                    return row.id == selected;
                  })?.name
                }
                sx={{ textTransform: "capitalize" }}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {searchCities.map((c) => (
                  <MenuItem key={c.name} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="集計期間開始"
              type="month"
              value={from}
              onChange={handleFilterFrom}
            />

            <TextField
              fullWidth
              label="集計期間終了"
              type="month"
              value={to}
              onChange={handleFilterTo}
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
      </Card>
    </>
  );
}
