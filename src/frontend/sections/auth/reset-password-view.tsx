"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { useBoolean } from "@/hooks/use-boolean";
import { RouterLink } from "@/routes/components";

import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFTextField } from "@/components/hook-form";

// ----------------------------------------------------------------------

export default function AdminResetPasswordView() {
  const router = useRouter();
  const password = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "パスワードは8文字以上で入力してください。")
      .required("パスワードを入力してください。"),
    password_confirmation: Yup.string()
      .required("パスワード（確認用）を入力してください。")
      .oneOf([Yup.ref("password")], "パスワードが異なります。"),
  });

  const defaultValues = {
    password: "",
    password_confirmation: "",
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // TODO
      enqueueSnackbar("パスワードを更新しました！");
      router.push(paths.admin.auth.login);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">パスワードを変更できます。</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          新しいパスワードと確認用のパスワードを入力してください。
        </Typography>
      </Stack>

      <Stack spacing={3} alignItems="center">
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

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          パスワードを更新
        </LoadingButton>

        <Link
          component={RouterLink}
          href={paths.admin.auth.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          ログイン画面へ戻る
        </Link>
      </Stack>
    </FormProvider>
  );
}
