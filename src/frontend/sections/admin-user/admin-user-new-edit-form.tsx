import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { useResponsive } from "@/hooks/use-responsive";
import { useBoolean } from "@/hooks/use-boolean";
import { useSnackbar } from "@/components/snackbar";
import Iconify from "@/components/iconify";
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from "@/components/hook-form";

import { IAdminUserItem } from "@/types/admin-user";
import { IAdminRoleItem } from "@/types/admin-role";
import { ICorporationItem } from "@/types/corporation";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentAdminUser?: IAdminUserItem;
  adminRoles: IAdminRoleItem[];
  corporations: ICorporationItem[];
};

export default function AdminRoleNewEditForm({
  currentAdminUser,
  adminRoles,
  corporations,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const password = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewAdminUserSchema = Yup.object().shape({
    name: Yup.string().required("氏名を入力してください。"),
    tel: Yup.string(),
    email: Yup.string()
      .required("メールアドレスを入力してください。")
      .email("メールアドレス形式ではありません"),
    password: Yup.string()
      .min(8, "パスワードは8文字以上で入力してください。")
      .required("パスワードを入力してください。"),
    password_confirmation: Yup.string()
      .required("パスワード（確認用）を入力してください。")
      .oneOf([Yup.ref("password")], "パスワードが異なります。"),
    admin_role_id: Yup.string().required("権限を入力してください。"),
    corporation_names: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentAdminUser?.name || "",
      tel: currentAdminUser?.tel || "",
      email: currentAdminUser?.email || "",
      password: currentAdminUser?.password || "",
      password_confirmation: currentAdminUser?.password || "",
      admin_role_id: currentAdminUser?.admin_role_id || "",
      corporation_names: currentAdminUser?.corporation_names || [],
    }),
    [currentAdminUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewAdminUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAdminUser) {
      reset(defaultValues);
    }
  }, [currentAdminUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const selectCorporationIds = corporations
        .filter((row) => {
          return data.corporation_names?.includes(row.name);
        })
        .map((row) => row.id);
      if (currentAdminUser) {
        await axios.patch(endpoints.adminUser.update(currentAdminUser.id), {
          name: data.name,
          tel: data.tel,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          admin_role_id: Number(data.admin_role_id),
          corporation_ids: selectCorporationIds,
        });
      } else {
        await axios.post(endpoints.adminUser.create, {
          name: data.name,
          tel: data.tel,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
          admin_role_id: Number(data.admin_role_id),
          corporation_ids: selectCorporationIds,
        });
      }
      reset();
      enqueueSnackbar(currentAdminUser ? "更新しました！" : "作成しました！");
      router.push(paths.admin.adminUser.root);
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
            <RHFTextField name="name" label="氏名" />

            <RHFTextField name="tel" label="電話番号" />

            <RHFTextField name="email" label="メールアドレス" />

            <RHFTextField
              name="password"
              label="パスワード"
              type={password.value ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify
                        icon={
                          password.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="password_confirmation"
              label="パスワード（確認）"
              type={password.value ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify
                        icon={
                          password.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFSelect
              fullWidth
              name="admin_role_id"
              label="権限"
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
              {adminRoles.map((adminRole) => (
                <MenuItem key={adminRole.name} value={adminRole.id}>
                  {adminRole.name}
                </MenuItem>
              ))}
            </RHFSelect>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ※法人の担当者を登録する場合は「owner」を選択してください
            </Typography>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">法人</Typography>
              <RHFAutocomplete
                name="corporation_names"
                placeholder="+ 法人"
                multiple
                disableCloseOnSelect
                options={corporations.map((option) => option.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
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
          {!currentAdminUser ? "管理者ユーザを作成" : "管理者ユーザを変更"}
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
