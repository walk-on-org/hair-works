import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { RHFTextField, RHFSelect } from "@/components/hook-form";

import { IOfficeItem } from "@/types/office";
import { ICorporationItem } from "@/types/corporation";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { PASSIVE_SMOKING } from "@/config-global";
import axios from "axios";

// ----------------------------------------------------------------------

type Props = {
  currentOffice?: IOfficeItem;
  corporations: ICorporationItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
};

export default function OfficeNewEditDetails({
  currentOffice,
  corporations,
  prefectures,
  cities,
}: Props) {
  const { watch, setValue } = useFormContext();
  const values = watch();
  const [searchCities, setSearchCitis] = useState<ICityItem[]>([]);

  // 都道府県が設定済の場合、該当の市区町村を選択肢に設定
  useEffect(() => {
    if (currentOffice) {
      const filterCities = cities.filter(
        (city) => city.prefecture_id == currentOffice.prefecture_id
      );
      setSearchCitis(filterCities);
    }
  }, [currentOffice]);

  // 郵便番号変更時に住所を自動設定
  const handlePostcodeChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const postcode = event.target.value;
    setValue("postcode", postcode);
    if (postcode.length < 7) return;
    // 郵便番号から住所検索API
    const res = await axios.get("https://zipcloud.ibsnet.co.jp/api/search", {
      params: { zipcode: postcode },
    });
    if (res.status === 200) {
      const selectPrefecture = prefectures.find(
        (prefecture) => prefecture.name == res.data.results[0].address1
      );
      if (selectPrefecture == undefined) return;
      // 都道府県内の市区町村のみ設定可にする
      const filterCities = cities.filter(
        (city) => city.prefecture_id == selectPrefecture.id
      );
      setSearchCitis(filterCities);
      // 該当の市区町村を検索
      const selectCity = filterCities.find(
        (city) => city.name == res.data.results[0].address2
      );
      setValue("prefecture_id", selectPrefecture.id);
      setValue("city_id", selectCity?.id);
      setValue("address", res.data.results[0].address3);
    } else {
      setValue("prefecture_id", "");
      setValue("city_id", "");
      setValue("address", "");
    }
  };

  // 都道府県変更時に該当の都道府県の市区町村をセット
  const handlePrefectureChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("prefecture_id", event.target.value);
    const filterCities = cities.filter(
      (city) => city.prefecture_id == event.target.value
    );
    setSearchCitis(filterCities);
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFTextField name="name" label="事業所名" />

      <RHFSelect
        fullWidth
        name="corporation_id"
        label="法人"
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
        {corporations.map((corporation) => (
          <MenuItem key={corporation.name} value={corporation.id}>
            {corporation.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField
        name="postcode"
        label="郵便番号"
        onChange={(event) => handlePostcodeChange(event)}
      />

      <RHFSelect
        fullWidth
        name="prefecture_id"
        label="都道府県"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
        onChange={(event) => handlePrefectureChange(event)}
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
        {searchCities.map((city) => (
          <MenuItem key={city.name} value={city.id}>
            {city.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField name="address" label="住所" />

      <RHFTextField name="tel" label="電話番号" />

      <RHFTextField name="fax" label="FAX番号" />

      <RHFTextField name="open_date" label="開店・リニューアル日" type="date" />

      <RHFTextField name="business_time" label="営業時間" />

      <RHFTextField name="regular_holiday" label="定休日" />

      <RHFTextField
        name="floor_space"
        label="坪数（坪）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="seat_num"
        label="セット面（面）"
        type="number"
        placeholder="0"
      />

      <RHFTextField name="shampoo_stand" label="シャンプー台" />

      <RHFTextField
        name="staff"
        label="スタッフ（人）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="new_customer_ratio"
        label="新規客割合（%）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="cut_unit_price"
        label="標準カット単価（円）"
        type="number"
        placeholder="0"
      />

      <RHFTextField
        name="customer_unit_price"
        label="顧客単価（円）"
        type="number"
        placeholder="0"
      />

      <RHFSelect
        fullWidth
        name="passive_smoking"
        label="受動喫煙対策"
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
        {PASSIVE_SMOKING.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField name="external_url" label="サロンURL" />

      <RHFTextField name="sns_url" label="SNSリンク" />
    </Stack>
  );
}
