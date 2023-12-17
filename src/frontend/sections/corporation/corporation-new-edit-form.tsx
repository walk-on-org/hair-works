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

import { ICorporationItem } from "@/types/corporation";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { IPlanItem } from "@/types/plan";
import axios, { endpoints } from "@/utils/axios";
import CorporationNewEditDetails from "./corporation-new-edit-details";
import CorporationNewEditContracts from "./corporation-new-edit-contracts";
import CorporationNewEditFeatures from "./corporation-new-edit-features";
import CorporationNewEditImages from "./corporation-new-edit-images";

// ----------------------------------------------------------------------

type Props = {
  currentCorporation?: ICorporationItem;
  prefectures: IPrefectureItem[];
  cities: ICityItem[];
  plans: IPlanItem[];
};

export default function CorporationNewEditForm({
  currentCorporation,
  prefectures,
  cities,
  plans,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewCorporationSchema = Yup.object().shape({
    name: Yup.string().required("法人名を入力してください。"),
    name_private: Yup.boolean(),
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
    salon_num: Yup.number(),
    employee_num: Yup.number(),
    yearly_turnover: Yup.string(),
    average_age: Yup.string(),
    drug_maker: Yup.string(),
    homepage: Yup.string().url("正しい形式でURLを入力してください。"),
    higher_display: Yup.boolean(),
    contracts: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        plan_id: Yup.string().required("プランを入力してください。"),
        start_date: Yup.mixed<any>().nullable(),
        end_plan_date: Yup.mixed<any>().nullable(),
      })
    ),
    corporation_images: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        image: Yup.mixed<any>().required("画像を設定してください。"),
        alttext: Yup.string(),
        sort: Yup.number().required("ソート順を入力してください。"),
      })
    ),
    corporation_features: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        image: Yup.mixed<any>().required("画像を設定してください。"),
        feature: Yup.string().required("特徴を入力してください。"),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCorporation?.name || "",
      name_private:
        currentCorporation?.name_private == "1" ? true : false || false,
      postcode: currentCorporation?.postcode || "",
      prefecture_id: currentCorporation?.prefecture_id || "",
      city_id: currentCorporation?.city_id || "",
      address: currentCorporation?.address || "",
      tel: currentCorporation?.tel || "",
      fax: currentCorporation?.fax || "",
      salon_num: currentCorporation?.salon_num || 0,
      employee_num: currentCorporation?.employee_num || 0,
      yearly_turnover: currentCorporation?.yearly_turnover || "",
      average_age: currentCorporation?.average_age || "",
      drug_maker: currentCorporation?.drug_maker || "",
      homepage: currentCorporation?.homepage || "",
      higher_display:
        currentCorporation?.higher_display == "1" ? true : false || false,
      contracts: currentCorporation?.contracts || [],
      corporation_images: currentCorporation?.corporation_images || [],
      corporation_features: currentCorporation?.corporation_features || [],
    }),
    [currentCorporation]
  );

  const methods = useForm({
    resolver: yupResolver(NewCorporationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentCorporation) {
      reset(defaultValues);
    }
  }, [currentCorporation, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCorporation) {
        await axios.post(
          endpoints.corporation.update(currentCorporation.id),
          {
            name: data.name,
            name_private: data.name_private ? 1 : 0,
            postcode: data.postcode,
            prefecture_id: Number(data.prefecture_id),
            city_id: Number(data.city_id),
            address: data.address,
            tel: data.tel,
            fax: data.fax,
            salon_num: data.salon_num != 0 ? data.salon_num : null,
            employee_num: data.employee_num != 0 ? data.employee_num : null,
            yearly_turnover: data.yearly_turnover,
            average_age: data.average_age,
            drug_maker: data.drug_maker,
            homepage: data.homepage,
            higher_display: data.higher_display ? 1 : 0,
            contracts: data.contracts,
            corporation_images: data.corporation_images,
            corporation_features: data.corporation_features,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          endpoints.corporation.create,
          {
            name: data.name,
            name_private: data.name_private ? 1 : 0,
            postcode: data.postcode,
            prefecture_id: Number(data.prefecture_id),
            city_id: Number(data.city_id),
            address: data.address,
            tel: data.tel,
            fax: data.fax,
            salon_num: data.salon_num != 0 ? data.salon_num : null,
            employee_num: data.employee_num != 0 ? data.employee_num : null,
            yearly_turnover: data.yearly_turnover,
            average_age: data.average_age,
            drug_maker: data.drug_maker,
            homepage: data.homepage,
            higher_display: data.higher_display ? 1 : 0,
            contracts: data.contracts,
            corporation_images: data.corporation_images,
            corporation_features: data.corporation_features,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      reset();
      enqueueSnackbar(currentCorporation ? "更新しました！" : "作成しました！");
      router.push(paths.admin.corporation.root);
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <CorporationNewEditDetails
            currentCorporation={currentCorporation}
            prefectures={prefectures}
            cities={cities}
          />

          <CorporationNewEditContracts plans={plans} />

          <CorporationNewEditImages />

          <CorporationNewEditFeatures />
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
          onClick={() => {
            console.log(errors);
            console.log(values);
          }}
        >
          {!currentCorporation ? "法人を作成" : "法人を変更"}
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
