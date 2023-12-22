import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useCallback } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFEditor,
  RHFTextField,
  RHFUpload,
} from "@/components/hook-form";

import { IArticleItem } from "@/types/article";
import { IArticleCategoryItem } from "@/types/article-category";
import { ICommitmentTermItem } from "@/types/commitment-term";
import { IPositionItem } from "@/types/position";
import axios, { endpoints } from "@/utils/axios";
import { ARTICLE_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentArticle?: IArticleItem;
  articleCategories: IArticleCategoryItem[];
  commitmentTerms: ICommitmentTermItem[];
  positions: IPositionItem[];
};

export default function ArticleNewEditForm({
  currentArticle,
  articleCategories,
  commitmentTerms,
  positions,
}: Props) {
  const router = useRouter();
  const mdUp = useResponsive("up", "md");
  const { enqueueSnackbar } = useSnackbar();

  const NewArticleSchema = Yup.object().shape({
    title: Yup.string().required("タイトルを入力してください。"),
    description: Yup.string().required("説明を入力してください。"),
    article_category_id:
      Yup.string().required("特集記事カテゴリを入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.string().required("状態を入力してください。"),
    main_image: Yup.mixed<any>().nullable(),
    content: Yup.string(),
    add_cta: Yup.boolean(),
    commitment_term_id: Yup.string().nullable(),
    position_id: Yup.string().nullable(),
    m_salary_lower: Yup.number().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentArticle?.title || "",
      description: currentArticle?.description || "",
      article_category_id: currentArticle?.article_category_id || "",
      permalink: currentArticle?.permalink || "",
      status: String(currentArticle?.status) || "",
      main_image: currentArticle?.main_image || "",
      content: currentArticle?.content || "",
      add_cta: currentArticle?.add_cta == "1" ? true : false || false,
      commitment_term_id: currentArticle?.commitment_term_id || "",
      position_id: currentArticle?.position_id || "",
      m_salary_lower: currentArticle?.m_salary_lower || 0,
    }),
    [currentArticle]
  );

  const methods = useForm({
    resolver: yupResolver(NewArticleSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("main_image", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue("main_image", null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentArticle) {
        await axios.post(
          endpoints.article.update(currentArticle.id),
          {
            title: data.title,
            description: data.description,
            article_category_id: Number(data.article_category_id),
            permalink: data.permalink,
            status: Number(data.status),
            main_image: data.main_image,
            content: data.content,
            add_cta: data.add_cta ? 1 : 0,
            commitment_term_id: data.commitment_term_id
              ? Number(data.commitment_term_id)
              : "",
            position_id: data.position_id ? Number(data.position_id) : "",
            m_salary_lower: data.m_salary_lower ? data.m_salary_lower : null,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          endpoints.article.create,
          {
            title: data.title,
            description: data.description,
            article_category_id: Number(data.article_category_id),
            permalink: data.permalink,
            status: Number(data.status),
            main_image: data.main_image,
            content: data.content,
            add_cta: data.add_cta ? 1 : 0,
            commitment_term_id: data.commitment_term_id
              ? Number(data.commitment_term_id)
              : "",
            position_id: data.position_id ? Number(data.position_id) : "",
            m_salary_lower: data.m_salary_lower ? data.m_salary_lower : null,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      reset();
      enqueueSnackbar(currentArticle ? "更新しました！" : "作成しました！");
      router.push(paths.admin.article.root);
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

            <RHFTextField name="description" label="説明" />

            <RHFSelect
              fullWidth
              name="article_category_id"
              label="特集記事カテゴリ"
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
              {articleCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSelect
              fullWidth
              name="status"
              label="状態"
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
              {ARTICLE_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">メイン画像</Typography>
              <RHFUpload
                thumbnail
                name="main_image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <RHFSwitch name="add_cta" label="共通CTA追加" sx={{ m: 0 }} />

            <RHFSelect
              fullWidth
              name="commitment_term_id"
              label="関連こだわり条件"
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
              {commitmentTerms.map((commitmentTerm) => (
                <MenuItem key={commitmentTerm.id} value={commitmentTerm.id}>
                  {commitmentTerm.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              fullWidth
              name="position_id"
              label="関連役職/役割ID"
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
              {positions.map((position) => (
                <MenuItem key={position.id} value={position.id}>
                  {position.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="m_salary_lower"
              label="関連月給下限"
              type="number"
              placeholder="0"
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">本文</Typography>
              <RHFEditor simple name="content" />
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
          {!currentArticle ? "特集記事を作成" : "特集記事を変更"}
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
