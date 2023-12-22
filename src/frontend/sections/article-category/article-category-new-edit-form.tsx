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
import FormProvider, { RHFSwitch, RHFTextField } from "@/components/hook-form";

import { IArticleCategoryItem } from "@/types/article-category";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentArticleCategory?: IArticleCategoryItem;
};

export default function ArticleCategoryNewEditForm({
  currentArticleCategory,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewArticleCategorySchema = Yup.object().shape({
    name: Yup.string().required("特集記事カテゴリ名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentArticleCategory?.name || "",
      permalink: currentArticleCategory?.permalink || "",
      status: currentArticleCategory?.status == "1" ? true : false || false,
    }),
    [currentArticleCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewArticleCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentArticleCategory) {
      reset(defaultValues);
    }
  }, [currentArticleCategory, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentArticleCategory) {
        await axios.patch(
          endpoints.articleCategory.update(currentArticleCategory.id),
          {
            name: data.name,
            permalink: data.permalink,
            status: data.status ? 1 : 0,
          }
        );
      } else {
        await axios.post(endpoints.articleCategory.create, {
          name: data.name,
          permalink: data.permalink,
          status: data.status ? 1 : 0,
        });
      }
      reset();
      enqueueSnackbar(
        currentArticleCategory ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.articleCategory.root);
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
            <RHFTextField name="name" label="特集記事カテゴリ名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSwitch name="status" label="状態" sx={{ m: 0 }} />
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
          {!currentArticleCategory
            ? "特集記事カテゴリを作成"
            : "特集記事カテゴリを変更"}
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
