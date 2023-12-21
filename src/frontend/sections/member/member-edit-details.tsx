import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IMemberItem } from "@/types/member";
import { IPrefectureItem } from "@/types/prefecture";
import { IEmploymentItem } from "@/types/employment";
import { IQualificationItem } from "@/types/qualification";
import { ILpJobCategoryItem } from "@/types/lp-job-category";

import {
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
} from "@/components/hook-form";

import {
  CHANGE_TIME_OPTIONS,
  INTRODUCTION_GIFT_STATUS_OPTIONS,
  MEMBER_STATUS_OPTIONS,
  RETIREMENT_TIME_OPTIONS,
} from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  prefectures: IPrefectureItem[];
  employments: IEmploymentItem[];
  qualifications: IQualificationItem[];
  lpJobCategories: ILpJobCategoryItem[];
  members: IMemberItem[];
};

export default function MemberEditDetails({
  prefectures,
  employments,
  qualifications,
  lpJobCategories,
  members,
}: Props) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFTextField name="name" label="氏名" />

      <RHFTextField name="name_kana" label="カナ名" />

      <RHFTextField
        name="birthyear"
        label="生まれ年"
        type="number"
        placeholder="0"
      />

      <RHFTextField name="postcode" label="郵便番号" />

      <RHFSelect
        fullWidth
        name="prefecture_id"
        label="都道府県"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
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

      <RHFTextField name="address" label="住所" />

      <RHFTextField name="phone" label="電話番号" />

      <RHFTextField name="email" label="メールアドレス" />

      <RHFSelect
        fullWidth
        name="change_time"
        label="希望転職時期"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {CHANGE_TIME_OPTIONS.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="retirement_time"
        label="退職意向"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {RETIREMENT_TIME_OPTIONS.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="employment_id"
        label="希望勤務体系"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {employments.map((row) => (
          <MenuItem key={row.id} value={row.id}>
            {row.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="emp_prefecture_id"
        label="希望勤務地"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {prefectures.map((row) => (
          <MenuItem key={row.id} value={row.id}>
            {row.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">保有資格</Typography>
        <RHFAutocomplete
          name="qualification_names"
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
        <Typography variant="subtitle2">希望職種</Typography>
        <RHFAutocomplete
          name="lp_job_category_names"
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

      <RHFSelect
        fullWidth
        name="status"
        label="状態"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {MEMBER_STATUS_OPTIONS.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField
        name="introduction_name"
        label="紹介者氏名（フォームでの入力値）"
      />

      <RHFSelect
        fullWidth
        name="introduction_member_id"
        label="紹介者会員情報"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {members.map((member) => (
          <MenuItem key={member.name} value={member.id}>
            {member.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="introduction_gift_status"
        label="紹介プレゼントステータス"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {INTRODUCTION_GIFT_STATUS_OPTIONS.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );
}
