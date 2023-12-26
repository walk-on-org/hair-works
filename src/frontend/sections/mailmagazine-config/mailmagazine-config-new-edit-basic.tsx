import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { RHFTextField, RHFSelect } from "@/components/hook-form";
import { DELIVER_JOB_TYPE_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

export default function MailmagazineConfigNewEditBasic({}) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFTextField name="title" label="タイトル" />

      <Stack spacing={1}>
        <RHFSelect
          fullWidth
          name="deliver_job_type"
          label="送信求人種別"
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
          {DELIVER_JOB_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          【新着求人】求職者からの住所から指定した距離以内の求人にて、掲載開始日から14日以内（新着）の求人を最新順にメルマガへ貼り付け
          <br />
          【半径〇〇km以内の求人】求職者の住所から指定した距離以内で、近い求人順にメルマガへ貼り付け
          <br />
          【同じ都道府県の求人】都道府県が同じ求人で、距離が近い求人順にメルマガに貼り付け
          <br />
          【同じ市区町村の求人】市区町村が同じ求人で、距離が近い求人順にメルマガに貼り付け
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <RHFTextField
          name="job_match_distance"
          label="距離（km）"
          type="number"
          placeholder="0"
        />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          求職者とサロンとの距離
          <br />
          送信求人種別を「新着求人」「半径〇〇km以内の求人」の場合は指定してください
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <RHFTextField
          name="job_count_limit"
          label="メール内求人件数上限"
          type="number"
          placeholder="0"
        />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          メルマガに貼り付ける求人数の上限
          <br />
          ※NEXLINKで登録できるファイルのカラム数に上限があるため、求人数は最大3まで
        </Typography>
      </Stack>
    </Stack>
  );
}
