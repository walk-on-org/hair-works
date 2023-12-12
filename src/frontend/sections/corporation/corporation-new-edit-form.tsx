import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

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
} from "@/components/hook-form";

import { ICorporationItem } from "@/types/corporation";
import { IPrefectureItem } from "@/types/prefecture";
import { ICityItem } from "@/types/city";
import { IPlanItem } from "@/types/plan";
import axios, { endpoints } from "@/utils/axios";

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
    }),
    [currentCorporation]
  );

  const methods = useForm({
    resolver: yupResolver(NewCorporationSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCorporation) {
      reset(defaultValues);
    }
  }, [currentCorporation, defaultValues, reset]);

  // 契約情報
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contracts",
  });
  const handleContractAdd = () => {
    append({
      id: "",
      plan_id: "",
      start_date: null,
      end_plan_date: null,
    });
  };
  const handleContractRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCorporation) {
        await axios.patch(endpoints.corporation.update(currentCorporation.id), {
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
        });
      } else {
        await axios.post(endpoints.corporation.create, {
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
        });
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

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
              契約プラン:
            </Typography>
            <Stack
              divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
              spacing={3}
            >
              {fields.map((item, index) => (
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ width: 1 }}
                  >
                    <RHFSelect
                      name={`contracts[${index}].plan_id`}
                      size="small"
                      label="プラン"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        maxWidth: { md: 160 },
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        None
                      </MenuItem>
                      <Divider sx={{ borderStyle: "dashed" }} />
                      {plans.map((plan) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>

                    <RHFTextField
                      size="small"
                      name={`contracts[${index}].start_date`}
                      label="掲載開始日"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      disabled={item.start_date == null ? true : false}
                    />

                    <RHFTextField
                      size="small"
                      name={`contracts[${index}].end_plan_date`}
                      label="掲載終了日"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      disabled={item.end_plan_date == null ? true : false}
                    />
                  </Stack>

                  {item.id == "" && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleContractRemove(index)}
                    >
                      削除
                    </Button>
                  )}
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            <Stack
              spacing={3}
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-end", md: "center" }}
            >
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleContractAdd}
                sx={{ flexShrink: 0 }}
              >
                契約プランを追加
              </Button>
            </Stack>
          </Box>
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
