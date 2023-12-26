import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack, { StackProps } from "@mui/material/Stack";

import { RouterLink } from "@/routes/components";

import Iconify from "@/components/iconify";

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  editLink: string;
  exportLink: string;
};

export default function JobDetailToolbar({
  backLink,
  editLink,
  exportLink,
  sx,
  ...other
}: Props) {
  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          一覧へ戻る
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="メルマガ送信リスト作成">
          <IconButton component={RouterLink} href={exportLink}>
            <Iconify icon="solar:export-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="編集">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
