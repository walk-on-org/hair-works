import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  RHFTextField,
  RHFSwitch,
  RHFAutocomplete,
} from "@/components/hook-form";

import { IJobCategoryItem } from "@/types/job-category";
import { ICorporationItem } from "@/types/corporation";

// ----------------------------------------------------------------------

type Props = {
  jobCategories: IJobCategoryItem[];
  corporations: ICorporationItem[];
};

export default function MailmagazineConfigNewEditJob({
  jobCategories,
  corporations,
}: Props) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle2">送信対象法人</Typography>
        <RHFAutocomplete
          name="j_corporation_labels"
          placeholder="+ 送信対象法人"
          multiple
          disableCloseOnSelect
          options={corporations.map((option) => `${option.id}：${option.name}`)}
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

      <RHFTextField name="job_keyword" label="求人検索キーワード" />

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">求人職種</Typography>
        <RHFAutocomplete
          name="j_job_category_names"
          placeholder="+ 求人職種"
          multiple
          disableCloseOnSelect
          options={jobCategories.map((option) => option.name)}
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

      <RHFSwitch
        name="job_match_lp_job_category"
        label="役職/役割が同じ求人のみ送信"
        sx={{ m: 0 }}
      />

      <RHFSwitch
        name="job_match_employment"
        label="雇用形態が同じ求人のみ送信"
        sx={{ m: 0 }}
      />

      <RHFSwitch
        name="search_other_corporation"
        label="１つ目の求人以外は他企業求人から検索"
        sx={{ m: 0 }}
      />
    </Stack>
  );
}
