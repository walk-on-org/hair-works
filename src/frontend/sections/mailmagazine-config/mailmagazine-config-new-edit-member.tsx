import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import {
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
} from "@/components/hook-form";

import { IMailmagazineConfigItem } from "@/types/mailmagazine-config";
import { ILpJobCategoryItem } from "@/types/lp-job-category";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { IQualificationItem } from "@/types/qualification";
import { IEmploymentItem } from "@/types/employment";
import { CHANGE_TIME_OPTIONS, MEMBER_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentMailmagazineConfig?: IMailmagazineConfigItem;
  lpJobCategories: ILpJobCategoryItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
  employments: IEmploymentItem[];
  qualifications: IQualificationItem[];
};
export default function MailmagazineConfigNewEditMember({
  currentMailmagazineConfig,
  lpJobCategories,
  prefectures,
  cities,
  employments,
  qualifications,
}: Props) {
  const { control, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mailmagazine_m_areas",
  });
  const [searchCities, setSearchCitis] = useState<Map<number, ICityItem[]>>(
    new Map()
  );

  // 都道府県が設定済の場合、該当の市区町村を選択肢に設定
  useEffect(() => {
    if (currentMailmagazineConfig) {
      let tmpSearchCities = new Map<number, ICityItem[]>();
      currentMailmagazineConfig.mailmagazine_m_areas.map((row, index) => {
        const filterCities = cities.filter(
          (city) => city.prefecture_id == row.prefecture_id
        );
        tmpSearchCities.set(index, filterCities);
      });
      console.log(tmpSearchCities);
      setSearchCitis(tmpSearchCities);
    }
  }, [currentMailmagazineConfig]);

  const handleAdd = () => {
    append({
      id: "",
      prefecture_id: "",
      city_id: "",
    });
  };
  const handleRemove = (index: number) => {
    remove(index);
  };

  const handlePrefectureChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    setValue(`mailmagazine_m_areas.${index}.prefecture_id`, event.target.value);
    const filterCities = cities.filter(
      (city) => city.prefecture_id == event.target.value
    );
    let tmpSearchCities = searchCities;
    tmpSearchCities.set(index, filterCities);
    setSearchCitis(tmpSearchCities);
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
          会員住所:
        </Typography>
        <Stack
          divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
          spacing={3}
        >
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFSelect
                  size="small"
                  name={`mailmagazine_m_areas.${index}.prefecture_id`}
                  label="都道府県"
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => handlePrefectureChange(event, index)}
                >
                  <MenuItem
                    value=""
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  {prefectures.map((prefecture) => (
                    <MenuItem key={prefecture.name} value={prefecture.id}>
                      {prefecture.name}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect
                  size="small"
                  name={`mailmagazine_m_areas.${index}.city_id`}
                  label="市区町村"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  {searchCities.get(index) &&
                    searchCities.get(index)?.map((city) => (
                      <MenuItem key={city.name} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Stack>

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                削除
              </Button>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />

        <Stack
          spacing={3}
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-end", md: "center" }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
            sx={{ flexShrink: 0 }}
          >
            会員住所を追加
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">希望職種</Typography>
        <RHFAutocomplete
          name="m_lp_job_category_names"
          placeholder="+ 希望職種"
          multiple
          disableCloseOnSelect
          options={lpJobCategories.map((option) => option.name)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">希望勤務地</Typography>
        <RHFAutocomplete
          name="m_emp_prefecture_names"
          placeholder="+ 希望勤務地"
          multiple
          disableCloseOnSelect
          options={prefectures.map((option) => option.name)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">希望勤務体系</Typography>
        <RHFAutocomplete
          name="m_employment_names"
          placeholder="+ 希望勤務体系"
          multiple
          disableCloseOnSelect
          options={employments.map((option) => option.name)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">保有資格</Typography>
        <RHFAutocomplete
          name="m_qualification_names"
          placeholder="+ 保有資格"
          multiple
          disableCloseOnSelect
          options={qualifications.map((option) => option.name)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">ステータス</Typography>
        <RHFAutocomplete
          name="m_status_names"
          placeholder="+ ステータス"
          multiple
          disableCloseOnSelect
          options={MEMBER_STATUS_OPTIONS.map((option) => option.label)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">希望転職時期</Typography>
        <RHFAutocomplete
          name="m_change_time_names"
          placeholder="+ 希望転職時期"
          multiple
          disableCloseOnSelect
          options={CHANGE_TIME_OPTIONS.map((option) => option.label)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>

      <RHFTextField
        name="member_birthyear_from"
        label="会員生まれ年（開始）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="member_birthyear_to"
        label="会員生まれ年（終了）"
        type="number"
        placeholder="0"
      />
    </Stack>
  );
}
