"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import Iconify from "@/components/iconify";
import { useSnackbar } from "@/components/snackbar";
import FormProvider, { RHFTextField } from "@/components/hook-form";

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("メールアドレスを入力してください。")
      .email("メールアドレス形式ではありません"),
  });

  const defaultValues = {
    email: "",
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

      enqueueSnackbar("パスワードリセットのメールを送信しました！");
      router.push(paths.admin.auth.resetPassword);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">パスワードをお忘れですか？</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          アカウントに関連付けられた電子メール アドレスを入力してください。
          パスワードをリセットするためのリンクを電子メールでお送りします。
        </Typography>
      </Stack>

      <Stack spacing={3} alignItems="center">
        <RHFTextField name="email" label="メールアドレス" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          パスワードリセットを要求
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
