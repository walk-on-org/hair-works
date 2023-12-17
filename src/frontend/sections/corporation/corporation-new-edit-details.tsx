import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { RHFTextField, RHFSelect, RHFSwitch } from "@/components/hook-form";

import { IPrefectureItem } from "@/types/prefecture";
import { ICorporationItem } from "@/types/corporation";
import { ICityItem } from "@/types/city";
import axios from "axios";

// ----------------------------------------------------------------------

type Props = {
  currentCorporation?: ICorporationItem;
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
};

export default function CorporationNewEditDetails({
  currentCorporation,
  prefectures,
  cities,
}: Props) {
  const { watch, setValue } = useFormContext();
  const values = watch();
  const [searchCities, setSearchCitis] = useState<ICityItem[]>([]);

  // 都道府県が設定済の場合、該当の市区町村を選択肢に設定
  useEffect(() => {
    if (currentCorporation) {
      const filterCities = cities.filter(
        (city) => city.prefecture_id == currentCorporation.prefecture_id
      );
      setSearchCitis(filterCities);
    }
  }, [currentCorporation]);

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
      <RHFTextField name="name" label="法人名" />

      <RHFSwitch name="name_private" label="法人名非公開" sx={{ m: 0 }} />

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
          <MenuItem key={prefecture.id} value={prefecture.id}>
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
          <MenuItem key={city.id} value={city.id}>
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
