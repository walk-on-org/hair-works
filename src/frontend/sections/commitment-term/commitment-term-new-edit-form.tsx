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
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFSelect,
} from "@/components/hook-form";

import { ICommitmentTermItem } from "@/types/commitment-term";
import axios, { endpoints } from "@/utils/axios";
import { COMMITMENT_TERM_CATEGORY } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentCommitmentTerm?: ICommitmentTermItem;
};

export default function CommitmentTermNewEditForm({
  currentCommitmentTerm,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewCommitmentTermSchema = Yup.object().shape({
    name: Yup.string().required("こだわり条件名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    category: Yup.string().required("カテゴリを入力してください。"),
    recommend: Yup.boolean(),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCommitmentTerm?.name || "",
      permalink: currentCommitmentTerm?.permalink || "",
      category: currentCommitmentTerm?.category || "",
      recommend:
        currentCommitmentTerm?.recommend == "1" ? true : false || false,
      status: currentCommitmentTerm?.status == "1" ? true : false || false,
    }),
    [currentCommitmentTerm]
  );

  const methods = useForm({
    resolver: yupResolver(NewCommitmentTermSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCommitmentTerm) {
      reset(defaultValues);
    }
  }, [currentCommitmentTerm, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let res;
      if (currentCommitmentTerm) {
        res = await axios.patch(
          endpoints.commitmentTerm.update(currentCommitmentTerm.id),
          {
            name: data.name,
            permalink: data.permalink,
            category: Number(data.category),
            recommend: data.recommend ? 1 : 0,
            status: data.status ? 1 : 0,
          }
        );
      } else {
        res = await axios.post(endpoints.commitmentTerm.create, {
          name: data.name,
          permalink: data.permalink,
          category: Number(data.category),
          recommend: data.recommend ? 1 : 0,
          status: data.status ? 1 : 0,
        });
      }
      if (res.status !== 200) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        return;
      }
      reset();
      enqueueSnackbar(
        currentCommitmentTerm ? "更新しました！" : "作成しました！"
      );
      router.push(paths.admin.commitmentTerm.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="こだわり条件名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSelect native name="category" label="カテゴリ">
              <option value=""></option>
              {COMMITMENT_TERM_CATEGORY.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </RHFSelect>

            <RHFSwitch name="recommend" label="おすすめ" sx={{ m: 0 }} />

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
          {!currentCommitmentTerm ? "こだわり条件を作成" : "こだわり条件を変更"}
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
