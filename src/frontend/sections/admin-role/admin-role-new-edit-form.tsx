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
import FormProvider, { RHFTextField } from "@/components/hook-form";

import { IAdminRoleItem } from "@/types/admin-role";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentAdminRole?: IAdminRoleItem;
};

export default function AdminRoleNewEditForm({ currentAdminRole }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const NewAdminRoleSchema = Yup.object().shape({
    name: Yup.string().required("ロール名を入力してください。"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentAdminRole?.name || "",
    }),
    [currentAdminRole]
  );

  const methods = useForm({
    resolver: yupResolver(NewAdminRoleSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAdminRole) {
      reset(defaultValues);
    }
  }, [currentAdminRole, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAdminRole) {
        await axios.patch(endpoints.adminRole.update(currentAdminRole.id), {
          name: data.name,
        });
      } else {
        await axios.post(endpoints.adminRole.create, {
          name: data.name,
        });
      }
      reset();
      enqueueSnackbar(currentAdminRole ? "更新しました！" : "作成しました！");
      router.push(paths.admin.adminRole.root);
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
            <RHFTextField name="name" label="ロール名" />
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
          {!currentAdminRole ? "管理者ロールを作成" : "管理者ロールを変更"}
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
