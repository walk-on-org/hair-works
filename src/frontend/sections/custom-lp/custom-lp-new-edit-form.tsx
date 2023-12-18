import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from "@/components/hook-form";

import { ICustomLpItem } from "@/types/custom-lp";
import axios, { endpoints } from "@/utils/axios";
import { ARTICLE_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentCustomLp?: ICustomLpItem;
};

export default function CustomLpNewEditForm({ currentCustomLp }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewCustomLpSchema = Yup.object().shape({
    title: Yup.string().required("タイトルを入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    logo: Yup.mixed<any>().nullable(),
    point1: Yup.string().required("ポイント1を入力してください。"),
    point2: Yup.string().required("ポイント2を入力してください。"),
    point3: Yup.string().required("ポイント3を入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentCustomLp?.title || "",
      permalink: currentCustomLp?.permalink || "",
      logo: currentCustomLp?.logo || null,
      point1: currentCustomLp?.point1 || "",
      point2: currentCustomLp?.point2 || "",
      point3: currentCustomLp?.point3 || "",
      status: String(currentCustomLp?.status) || "",
    }),
    [currentCustomLp]
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomLpSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCustomLp) {
      reset(defaultValues);
    }
  }, [currentCustomLp, defaultValues, reset]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("logo", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue("logo", null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCustomLp) {
        await axios.post(
          endpoints.customLp.update(currentCustomLp.id),
          {
            title: data.title,
            permalink: data.permalink,
            logo: data.logo,
            point1: data.point1,
            point2: data.point2,
            point3: data.point3,
            status: Number(data.status),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          endpoints.customLp.create,
          {
            title: data.title,
            permalink: data.permalink,
            logo: data.logo,
            point1: data.point1,
            point2: data.point2,
            point3: data.point3,
            status: Number(data.status),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      reset();
      enqueueSnackbar(currentCustomLp ? "更新しました！" : "作成しました！");
      router.push(paths.admin.customLp.root);
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
            <RHFTextField name="title" label="タイトル" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFTextField name="point1" label="ポイント1" />

            <RHFTextField name="point2" label="ポイント2" />

            <RHFTextField name="point3" label="ポイント3" />

            <RHFSelect native name="status" label="状態">
              <option value=""></option>
              {ARTICLE_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </RHFSelect>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">ロゴ</Typography>
              <RHFUpload
                thumbnail
                name="logo"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
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
          {!currentCustomLp ? "専用LP設定を作成" : "専用LP設定を変更"}
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
