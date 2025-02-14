"use client";

import * as Yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "@/components/iconify";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useBoolean } from "@/hooks/use-boolean";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks";

// ----------------------------------------------------------------------

export default function AdminLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const displayPassword = useBoolean();
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("メールアドレスを入力してください")
      .email("メールアドレス形式ではありません"),
    password: Yup.string().required("パスワードを入力してください"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);
      router.push(returnTo || paths.admin.dashboard);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        typeof error.error === "string" ? error.error : error.error.message
      );
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h4">ヘアワークス事業所様ログイン</Typography>
      </Stack>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField name="email" label="メールアドレス" />

        <RHFTextField
          name="password"
          label="パスワード"
          type={displayPassword.value ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={displayPassword.onToggle} edge="end">
                  <Iconify
                    icon={
                      displayPassword.value
                        ? "solar:eye-bold"
                        : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link
          component={RouterLink}
          href={paths.admin.auth.forgotPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ alignSelf: "flex-end" }}
        >
          パスワードを忘れた方はこちら
        </Link>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          ログイン
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
