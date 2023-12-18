import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider from "@/components/hook-form";

import { IOfficeItem } from "@/types/office";
import { ICorporationItem } from "@/types/corporation";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { IStationItem } from "@/types/station";
import axios, { endpoints } from "@/utils/axios";
import OfficeNewEditDetails from "./office-new-edit-details";
import OfficeNewEditAccesses from "./office-new-edit-accesses";
import OfficeNewEditClienteles from "./office-new-edit-clienteles";
import OfficeNewEditImages from "./office-new-edit-images";
import OfficeNewEditFeatures from "./office-new-edit-features";

// ----------------------------------------------------------------------

type Props = {
  currentOffice?: IOfficeItem;
  corporations: ICorporationItem[];
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
  stations: IStationItem[];
};

export default function OfficeNewEditForm({
  currentOffice,
  corporations,
  prefectures,
  cities,
  stations,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewOfficeSchema = Yup.object().shape({
    name: Yup.string().required("事業所名を入力してください。"),
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
    office_accesses: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        line_id: Yup.string(),
        station_id: Yup.string().required("駅を入力してください"),
        move_type: Yup.string().required("移動手段を入力してください。"),
        time: Yup.number().required("時間を入力してください。"),
        note: Yup.string(),
      })
    ),
    office_clienteles: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        clientele: Yup.string().required("客層を入力してください。"),
        othertext: Yup.string(),
      })
    ),
    office_images: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        image: Yup.mixed<any>().required("画像を設定してください。"),
        alttext: Yup.string(),
        sort: Yup.number().required("ソート順を入力してください。"),
      })
    ),
    office_features: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        image: Yup.mixed<any>().required("画像を設定してください。"),
        feature: Yup.string().required("特徴を入力してください。"),
      })
    ),
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
      office_accesses: currentOffice?.office_accesses || [],
      office_clienteles: currentOffice?.office_clienteles || [],
      office_images: currentOffice?.office_images || [],
      office_features: currentOffice?.office_features || [],
    }),
    [currentOffice]
  );

  const methods = useForm({
    resolver: yupResolver(NewOfficeSchema),
    defaultValues,
  });

  const {
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
            office_accesses: data.office_accesses,
            office_clienteles: data.office_clienteles,
            office_images: data.office_images,
            office_features: data.office_features,
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
            office_accesses: data.office_accesses,
            office_clienteles: data.office_clienteles,
            office_images: data.office_images,
            office_features: data.office_features,
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
          <OfficeNewEditDetails
            currentOffice={currentOffice}
            corporations={corporations}
            prefectures={prefectures}
            cities={cities}
          />

          <OfficeNewEditAccesses stations={stations} />

          <OfficeNewEditClienteles />

          <OfficeNewEditImages />

          <OfficeNewEditFeatures />
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
