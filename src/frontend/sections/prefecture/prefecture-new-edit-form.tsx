import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFSelect, RHFTextField } from "@/components/hook-form";

import { IPrefectureItem } from "@/types/prefecture";
import axios, { endpoints } from "@/utils/axios";
import { REGION_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentPrefecture?: IPrefectureItem;
};

export default function PrefectureNewEditForm({ currentPrefecture }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewPrefectureSchema = Yup.object().shape({
    name: Yup.string().required("都道府県名を入力してください。"),
    name_kana: Yup.string().required("都道府県カナ名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    minimum_wage: Yup.number()
      .required("最低賃金を入力してください。")
      .moreThan(0, "最低賃金は0円より大きい値で入力してください。"),
    region: Yup.string().required("地方を入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentPrefecture?.name || "",
      name_kana: currentPrefecture?.name_kana || "",
      permalink: currentPrefecture?.permalink || "",
      minimum_wage: currentPrefecture?.minimum_wage || 0,
      region: currentPrefecture?.region || "",
    }),
    [currentPrefecture]
  );

  const methods = useForm({
    resolver: yupResolver(NewPrefectureSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentPrefecture) {
      reset(defaultValues);
    }
  }, [currentPrefecture, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentPrefecture) {
        await axios.patch(endpoints.prefecture.update(currentPrefecture.id), {
          name: data.name,
          name_kana: data.name_kana,
          permalink: data.permalink,
          minimum_wage: data.minimum_wage,
          region: Number(data.region),
        });
      } else {
        await axios.post(endpoints.prefecture.create, {
          name: data.name,
          name_kana: data.name_kana,
          permalink: data.permalink,
          minimum_wage: data.minimum_wage,
          region: Number(data.region),
        });
      }
      reset();
      enqueueSnackbar(currentPrefecture ? "更新しました！" : "作成しました！");
      router.push(paths.admin.prefecture.root);
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
            <RHFTextField name="name" label="都道府県名" />

            <RHFTextField name="name_kana" label="都道府県カナ名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFTextField
              name="minimum_wage"
              label="最低賃金"
              placeholder="0"
              type="number"
            />

            <RHFSelect native name="region" label="地方">
              <option value=""></option>
              {REGION_OPTIONS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </RHFSelect>
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
          {!currentPrefecture ? "都道府県を作成" : "都道府県を変更"}
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
