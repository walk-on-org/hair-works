import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { RHFTextField, RHFSelect, RHFSwitch } from "@/components/hook-form";

import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";

// ----------------------------------------------------------------------

type Props = {
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
};

export default function CorporationNewEditDetails({
  prefectures,
  cities,
}: Props) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFTextField name="name" label="法人名" />

      <RHFSwitch name="name_private" label="法人名非公開" sx={{ m: 0 }} />

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

      <RHFSelect
        fullWidth
        name="city_id"
        label="市区町村"
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
        {cities.map((city) => (
          <MenuItem key={city.name} value={city.id}>
            {city.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField name="address" label="住所" />

      <RHFTextField name="tel" label="電話番号" />

      <RHFTextField name="fax" label="FAX番号" />

      <RHFTextField
        name="salon_num"
        label="サロン数（店舗）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="employee_num"
        label="社員数（人）"
        type="number"
        placeholder="0"
      />

      <RHFTextField name="yearly_turnover" label="年商" />

      <RHFTextField name="average_age" label="スタッフ平均年齢" />

      <RHFTextField name="drug_maker" label="主な薬剤メーカー" />

      <RHFTextField name="homepage" label="会社ホームページ" />

      <RHFSwitch
        name="higher_display"
        label="優先表示（PICKUPやおすすめなど）"
        sx={{ m: 0 }}
      />
    </Stack>
  );
}
