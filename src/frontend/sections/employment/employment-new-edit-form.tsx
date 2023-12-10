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

import { IEmploymentItem } from "@/types/employment";
import { IPositionItem } from "@/types/position";
import { ICommitmentTermItem } from "@/types/commitment-term";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentEmployment?: IEmploymentItem;
  positions: IPositionItem[];
  commitmentTerms: ICommitmentTermItem[];
};

export default function EmploymentNewEditForm({
  currentEmployment,
  positions,
  commitmentTerms,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewEmploymentSchema = Yup.object().shape({
    name: Yup.string().required("雇用形態名を入力してください。"),
    permalink: Yup.string().required("パーマリンクを入力してください。"),
    status: Yup.boolean(),
    employment_concern_points: Yup.array().of(
      Yup.object().shape({
        position_id: Yup.string(),
        commitment_term_id: Yup.string(),
        title: Yup.string().required("タイトルを入力してください。"),
        description: Yup.string().required("詳細を入力してください。"),
        sort: Yup.number().required("ソート順を入力してください。"),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentEmployment?.name || "",
      permalink: currentEmployment?.permalink || "",
      status: currentEmployment?.status == "1" ? true : false || false,
      employment_concern_points:
        currentEmployment?.employment_concern_points || [],
    }),
    [currentEmployment]
  );

  const methods = useForm({
    resolver: yupResolver(NewEmploymentSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentEmployment) {
      reset(defaultValues);
    }
  }, [currentEmployment, defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employment_concern_points",
  });
  const handleEmploymentConcernPointAdd = () => {
    append({
      position_id: "",
      commitment_term_id: "",
      title: "",
      description: "",
      sort: 0,
    });
  };
  const handleEmploymentConcernPointRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentEmployment) {
        await axios.patch(endpoints.employment.update(currentEmployment.id), {
          name: data.name,
          permalink: data.permalink,
          status: data.status ? 1 : 0,
          employment_concern_points: data.employment_concern_points,
        });
      } else {
        await axios.post(endpoints.employment.create, {
          name: data.name,
          permalink: data.permalink,
          status: data.status ? 1 : 0,
          employment_concern_points: data.employment_concern_points,
        });
      }
      reset();
      enqueueSnackbar(currentEmployment ? "更新しました！" : "作成しました！");
      router.push(paths.admin.employment.root);
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
            <RHFTextField name="name" label="雇用形態名" />

            <RHFTextField name="permalink" label="パーマリンク" />

            <RHFSwitch name="status" label="状態" sx={{ m: 0 }} />
          </Stack>

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
              気になるポイント:
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
                      name={`employment_concern_points[${index}].position_id`}
                      size="small"
                      label="役職/役割"
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
                      {positions.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                          {position.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>

                    <RHFSelect
                      name={`employment_concern_points[${index}].commitment_term_id`}
                      size="small"
                      label="こだわり条件"
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
                      {commitmentTerms.map((commitmentTerm) => (
                        <MenuItem
                          key={commitmentTerm.id}
                          value={commitmentTerm.id}
                        >
                          {commitmentTerm.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>

                    <RHFTextField
                      size="small"
                      name={`employment_concern_points[${index}].title`}
                      label="タイトル"
                      InputLabelProps={{ shrink: true }}
                    />

                    <RHFTextField
                      size="small"
                      name={`employment_concern_points[${index}].sort`}
                      label="ソート順"
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      placeholder="0"
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ width: 1 }}
                  >
                    <RHFTextField
                      size="small"
                      name={`employment_concern_points[${index}].description`}
                      label="詳細"
                      InputLabelProps={{ shrink: true }}
                      multiline
                      rows={3}
                    />
                  </Stack>

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => handleEmploymentConcernPointRemove(index)}
                  >
                    削除
                  </Button>
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
                onClick={handleEmploymentConcernPointAdd}
                sx={{ flexShrink: 0 }}
              >
                気になるポイントを追加
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
          {!currentEmployment ? "雇用形態を作成" : "雇用形態を変更"}
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
