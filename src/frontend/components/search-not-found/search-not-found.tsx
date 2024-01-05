import Typography from "@mui/material/Typography";
import Paper, { PaperProps } from "@mui/material/Paper";

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        bgcolor: "unset",
        textAlign: "center",
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        見つかりません。
      </Typography>

      <Typography variant="body2">
        <strong>&quot;{query}&quot;</strong>に一致する結果はありませんでした。
        <br /> タイプミスがないか確認するか、完全な単語を使用してみてください。
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      キーワードを入力してください
    </Typography>
  );
}
