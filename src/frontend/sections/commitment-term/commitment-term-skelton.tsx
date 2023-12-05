import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Grid, { Grid2Props } from "@mui/material/Unstable_Grid2";

// ----------------------------------------------------------------------

export function CommitmentTermDetailSkeleton({ ...other }: Grid2Props) {
  return (
    <Grid container spacing={8} {...other}>
      <Grid xs={12}>
        <Stack spacing={3}>
          <Skeleton sx={{ height: 16 }} />
          <Skeleton sx={{ height: 16 }} />
          <Skeleton sx={{ height: 16 }} />
        </Stack>
      </Grid>
    </Grid>
  );
}
