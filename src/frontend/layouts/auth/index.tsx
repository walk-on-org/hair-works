import Stack from "@mui/material/Stack";
import Logo from "@/components/logo";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Logo
        sx={{
          zIndex: 9,
          position: "absolute",
          m: { xs: 2, md: 5 },
        }}
      />
      <Stack
        sx={{
          width: 1,
          mx: "auto",
          maxWidth: 480,
          px: { xs: 2, md: 8 },
          pt: { xs: 15, md: 20 },
          pb: { xs: 15, md: 0 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
