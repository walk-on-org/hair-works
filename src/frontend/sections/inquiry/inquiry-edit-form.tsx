import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";

import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFSelect } from "@/components/hook-form";

import { IInquiryItem } from "@/types/inquiry";
import axios, { endpoints } from "@/utils/axios";
import { INQUIRY_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  currentInquiry: IInquiryItem;
};

export default function InquiryEditForm({ currentInquiry }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewApplicantSchema = Yup.object().shape({
    status: Yup.string().required("状態を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      status: currentInquiry?.status || "",
    }),
    [currentInquiry]
  );

  const methods = useForm({
    resolver: yupResolver(NewApplicantSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentInquiry) {
      reset(defaultValues);
    }
  }, [currentInquiry, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 更新のみ
      await axios.post(endpoints.inquiry.update(currentInquiry.id), {
        status: Number(data.status),
      });
      reset();
      enqueueSnackbar("更新しました！");
      router.push(paths.admin.inquiry.root);
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
              {INQUIRY_STATUS_OPTIONS.map((row) => (
                <MenuItem key={row.value} value={row.value}>
                  {row.label}
                </MenuItem>
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
          onClick={() => console.log(errors)}
        >
          {"問い合わせを変更"}
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
