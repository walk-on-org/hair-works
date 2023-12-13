import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import Iconify from "@/components/iconify";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  RHFUpload,
} from "@/components/hook-form";

import { IOfficeItem } from "@/types/office";
import { ICorporationItem } from "@/types/corporation";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import axios, { endpoints } from "@/utils/axios";
import { PASSIVE_SMOKING } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentOffice?: IOfficeItem;
  corporations: ICorporationItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
};

export default function OfficeNewEditForm({
  currentOffice,
  corporations,
  prefectures,
  cities,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewOfficeSchema = Yup.object().shape({
    name: Yup.string().required("法人名を入力してください。"),
    corporation_id: Yup.string().required("法人を入力してください。"),
    postcode: Yup.string()
      .required("郵便番号を入力してください。")
      .matches(/^[0-9]{7}$/, "郵便番号は数字7桁で入力してください。"),
    prefecture_id: Yup.string().required("都道府県を入力してください。"),
    city_id: Yup.string().required("市区町村を入力してください。"),
    address: Yup.string().required("住所を入力してください。"),
    tel: Yup.string()
      .nullable()
      .matches(/^0[0-9]{1,3}(-)?[0-9]{2,4}(-)?[0-9]{3,4}$/, {
        message: "電話番号形式ではありません。",
        excludeEmptyString: true,
      }),
    fax: Yup.string()
      .nullable()
      .matches(/^0[0-9]{1,3}(-)?[0-9]{2,4}(-)?[0-9]{3,4}$/, {
        message: "FAX番号形式ではありません。",
        excludeEmptyString: true,
      }),
    open_date: Yup.mixed<any>().nullable(),
    business_time: Yup.string(),
    regular_holiday: Yup.string(),
    floor_space: Yup.number(),
    seat_num: Yup.number(),
    shampoo_stand: Yup.string(),
    staff: Yup.number(),
    new_customer_ratio: Yup.number(),
    cut_unit_price: Yup.number(),
    customer_unit_price: Yup.number(),
    passive_smoking: Yup.string().required("受動喫煙対策を入力してください。"),
    external_url: Yup.string().url("正しい形式でURLを入力してください。"),
    sns_url: Yup.string().url("正しい形式でURLを入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentOffice?.name || "",
      corporation_id: currentOffice?.corporation_id || "",
      postcode: currentOffice?.postcode || "",
      prefecture_id: currentOffice?.prefecture_id || "",
      city_id: currentOffice?.city_id || "",
      address: currentOffice?.address || "",
      tel: currentOffice?.tel || "",
      fax: currentOffice?.fax || "",
      open_date: currentOffice?.open_date || null,
      business_time: currentOffice?.business_time || "",
      regular_holiday: currentOffice?.regular_holiday || "",
      floor_space: currentOffice?.floor_space || 0,
      seat_num: currentOffice?.seat_num || 0,
      shampoo_stand: currentOffice?.shampoo_stand || "",
      staff: currentOffice?.staff || 0,
      new_customer_ratio: currentOffice?.new_customer_ratio || 0,
      cut_unit_price: currentOffice?.cut_unit_price || 0,
      customer_unit_price: currentOffice?.customer_unit_price || 0,
      passive_smoking: currentOffice?.passive_smoking || "",
      external_url: currentOffice?.external_url || "",
      sns_url: currentOffice?.sns_url || "",
    }),
    [currentOffice]
  );

  const methods = useForm({
    resolver: yupResolver(NewOfficeSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentOffice) {
      reset(defaultValues);
    }
  }, [currentOffice, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      if (currentOffice) {
        await axios.post(
          endpoints.office.update(currentOffice.id),
          {
            name: data.name,
            corporation_id: Number(data.corporation_id),
            postcode: data.postcode,
            prefecture_id: Number(data.prefecture_id),
            city_id: Number(data.city_id),
            address: data.address,
            tel: data.tel,
            fax: data.fax,
            open_date: data.open_date,
            business_time: data.business_time,
            regular_holiday: data.regular_holiday,
            floor_space: data.floor_space != 0 ? data.floor_space : null,
            seat_num: data.seat_num != 0 ? data.seat_num : null,
            shampoo_stand: data.shampoo_stand,
            staff: data.staff != 0 ? data.staff : null,
            new_customer_ratio:
              data.new_customer_ratio != 0 ? data.new_customer_ratio : null,
            cut_unit_price:
              data.cut_unit_price != 0 ? data.cut_unit_price : null,
            customer_unit_price:
              data.customer_unit_price != 0 ? data.customer_unit_price : null,
            passive_smoking: Number(data.passive_smoking),
            external_url: data.external_url,
            sns_url: data.sns_url,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          endpoints.office.create,
          {
            name: data.name,
            corporation_id: Number(data.corporation_id),
            postcode: data.postcode,
            prefecture_id: Number(data.prefecture_id),
            city_id: Number(data.city_id),
            address: data.address,
            tel: data.tel,
            fax: data.fax,
            open_date: data.open_date,
            business_time: data.business_time,
            regular_holiday: data.regular_holiday,
            floor_space: data.floor_space != 0 ? data.floor_space : null,
            seat_num: data.seat_num != 0 ? data.seat_num : null,
            shampoo_stand: data.shampoo_stand,
            staff: data.staff != 0 ? data.staff : null,
            new_customer_ratio:
              data.new_customer_ratio != 0 ? data.new_customer_ratio : null,
            cut_unit_price:
              data.cut_unit_price != 0 ? data.cut_unit_price : null,
            customer_unit_price:
              data.customer_unit_price != 0 ? data.customer_unit_price : null,
            passive_smoking: Number(data.passive_smoking),
            external_url: data.external_url,
            sns_url: data.sns_url,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      reset();
      enqueueSnackbar(currentOffice ? "更新しました！" : "作成しました！");
      router.push(paths.admin.office.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
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
              name="open_date"
              label="開店・リニューアル日"
              type="date"
            />

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
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentOffice ? "事業所を作成" : "事業所を変更"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
