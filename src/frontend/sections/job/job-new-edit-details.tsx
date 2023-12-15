import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  RHFTextField,
  RHFSelect,
  RHFRadioGroup,
  RHFSwitch,
  RHFAutocomplete,
} from "@/components/hook-form";

import { ICommitmentTermItem } from "@/types/commitment-term";
import { IEmploymentItem } from "@/types/employment";
import { IHolidayItem } from "@/types/holiday";
import { IJobCategoryItem } from "@/types/job-category";
import { IOfficeItem } from "@/types/office";
import { IPositionItem } from "@/types/position";
import { IQualificationItem } from "@/types/qualification";
import { JOB_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  offices: IOfficeItem[];
  jobCatgegories: IJobCategoryItem[];
  positions: IPositionItem[];
  employments: IEmploymentItem[];
  commitmentTerms: ICommitmentTermItem[];
  holidays: IHolidayItem[];
  qualifications: IQualificationItem[];
};

export default function JobNewEditDetails({
  offices,
  jobCatgegories,
  positions,
  employments,
  commitmentTerms,
  holidays,
  qualifications,
}: Props) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFTextField name="name" label="求人名" />

      <RHFSelect
        fullWidth
        name="office_id"
        label="事業所"
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
        {offices.map((office) => (
          <MenuItem key={office.name} value={office.id}>
            {office.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <Stack spacing={1}>
        <Typography variant="subtitle2">状態</Typography>
        <RHFRadioGroup
          row
          spacing={4}
          name="status"
          options={JOB_STATUS_OPTIONS}
        />
      </Stack>

      <RHFSwitch name="pickup" label="PickUp求人" sx={{ m: 0 }} />

      <RHFSwitch
        name="private"
        label="非公開求人　※使用しないでください"
        sx={{ m: 0 }}
      />

      <RHFSwitch
        name="recommend"
        label="オススメ求人　※人材紹介の求人はチェックする。チャックすると求人詳細ページにて会員登録しないと全てを見ることができなくなります。"
        sx={{ m: 0 }}
      />

      <RHFSwitch name="indeed_private" label="Indeed非公開" sx={{ m: 0 }} />

      <RHFSwitch
        name="minimum_wage_ok"
        label="最低賃金を今後チェックしない"
        sx={{ m: 0 }}
      />

      <RHFSelect
        fullWidth
        name="job_category_id"
        label="職種"
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
        {jobCatgegories.map((jobCategory) => (
          <MenuItem key={jobCategory.name} value={jobCategory.id}>
            {jobCategory.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="position_id"
        label="役職/役割"
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
        {positions.map((position) => (
          <MenuItem key={position.name} value={position.id}>
            {position.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect
        fullWidth
        name="employment_id"
        label="雇用形態"
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
        {employments.map((employment) => (
          <MenuItem key={employment.name} value={employment.id}>
            {employment.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField
        name="m_salary_lower"
        label="月給下限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="m_salary_upper"
        label="月給上限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="t_salary_lower"
        label="時給下限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="t_salary_upper"
        label="時給上限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="d_salary_lower"
        label="日給下限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="d_salary_upper"
        label="日給上限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="commission_lower"
        label="歩合下限"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="commission_upper"
        label="歩合上限"
        type="number"
        placeholder="0"
      />

      <RHFTextField name="salary" label="給与" multiline rows={3} />

      <RHFTextField name="work_time" label="勤務時間" multiline rows={3} />

      <RHFTextField
        name="job_description"
        label="仕事内容"
        multiline
        rows={3}
      />

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">休日</Typography>
        <RHFAutocomplete
          name="holiday_names"
          placeholder="+ 休日"
          multiple
          disableCloseOnSelect
          options={holidays.map((option) => option.name)}
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

      <RHFTextField name="holiday" label="休日" multiline rows={3} />

      <RHFTextField
        name="welfare"
        label="福利厚生・手当て"
        multiline
        rows={3}
      />

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">必須免許</Typography>
        <RHFAutocomplete
          name="qualification_names"
          placeholder="+ 必須免許"
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

      <RHFTextField
        name="entry_requirement"
        label="必須免許・資格"
        multiline
        rows={3}
      />

      <RHFTextField
        name="catch_copy"
        label="キャッチコピー"
        multiline
        rows={3}
      />

      <RHFTextField
        name="recommend_point"
        label="おすすめポイント"
        multiline
        rows={3}
      />

      <RHFTextField
        name="salon_message"
        label="サロンからのメッセージ"
        multiline
        rows={3}
      />

      <Stack spacing={1.5}>
        <Typography variant="subtitle2">求人こだわり条件</Typography>
        <RHFAutocomplete
          name="commitment_term_names"
          placeholder="+ 求人こだわり条件"
          multiple
          disableCloseOnSelect
          options={commitmentTerms.map((option) => option.name)}
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
    </Stack>
  );
}
