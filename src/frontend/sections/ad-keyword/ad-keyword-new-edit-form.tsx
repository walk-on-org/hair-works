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

import { IAdKeywordItem } from "@/types/ad-keyword";
import axios, { endpoints } from "@/utils/axios";
import { AD_KEYWORD_MATCH_TYPE } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentAdKeyword?: IAdKeywordItem;
};

export default function AdKeywordNewEditForm({ currentAdKeyword }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewAdKeywordSchema = Yup.object().shape({
    utm_source: Yup.string().required("参照元を入力してください。"),
    utm_medium: Yup.string().required("メディアを入力してください。"),
    utm_campaign: Yup.string().required("キャンペーンを入力してください。"),
    keyword_id: Yup.string().required("キーワードIDを入力してください。"),
    ad_group: Yup.string().required("広告グループを入力してください。"),
    keyword: Yup.string().required("キーワードを入力してください。"),
    match_type: Yup.string().required("マッチ種別を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      utm_source: currentAdKeyword?.utm_source || "",
      utm_medium: currentAdKeyword?.utm_medium || "",
      utm_campaign: currentAdKeyword?.utm_campaign || "",
      keyword_id: currentAdKeyword?.keyword_id || "",
      ad_group: currentAdKeyword?.ad_group || "",
      keyword: currentAdKeyword?.keyword || "",
      match_type: currentAdKeyword?.match_type || "",
    }),
    [currentAdKeyword]
  );

  const methods = useForm({
    resolver: yupResolver(NewAdKeywordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAdKeyword) {
      reset(defaultValues);
    }
  }, [currentAdKeyword, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentAdKeyword) {
        res = await axios.patch(
          endpoints.adKeyword.update(currentAdKeyword.id),
          {
            utm_source: data.utm_source,
            utm_medium: data.utm_medium,
            utm_campaign: data.utm_campaign,
            keyword_id: data.keyword_id,
            ad_group: data.ad_group,
            keyword: data.keyword,
            match_type: Number(data.match_type),
          }
        );
      } else {
        res = await axios.post(endpoints.adKeyword.create, {
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
          keyword_id: data.keyword_id,
          ad_group: data.ad_group,
          keyword: data.keyword,
          match_type: Number(data.match_type),
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(currentAdKeyword ? "更新しました！" : "作成しました！");
      router.push(paths.admin.adKeyword.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="utm_source" label="参照元" />

            <RHFTextField name="utm_medium" label="メディア" />

            <RHFTextField name="utm_campaign" label="キャンペーン" />

            <RHFTextField
              name="keyword_id"
              label="キーワードID"
              placeholder="0"
              type="number"
            />

            <RHFTextField name="ad_group" label="広告グループ" />

            <RHFTextField name="keyword" label="キーワード" />

            <RHFSelect native name="match_type" label="マッチ種別">
              <option value=""></option>
              {AD_KEYWORD_MATCH_TYPE.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
          {!currentAdKeyword ? "広告キーワードを作成" : "広告キーワードを変更"}
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
