import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack, { StackProps } from "@mui/material/Stack";

import Iconify from "@/components/iconify";

import { IKeepTableFilters, IKeepTableFilterValue } from "@/types/keep";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IKeepTableFilters;
  onFilters: (name: string, value: IKeepTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function KeepTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveStatus = (inputValue: string) => {
    const newValue = filters.status.filter((item) => item !== inputValue);
    onFilters("status", newValue);
  };

  const handleRemoveJobCategory = (inputValue: string) => {
    const newValue = filters.job_category.filter((item) => item !== inputValue);
    onFilters("job_category", newValue);
  };

  const handleRemovePosition = (inputValue: string) => {
    const newValue = filters.position.filter((item) => item !== inputValue);
    onFilters("position", newValue);
  };

  const handleRemoveEmployment = (inputValue: string) => {
    const newValue = filters.employment.filter((item) => item !== inputValue);
    onFilters("employment", newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: "body2" }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: "text.secondary", ml: 0.25 }}>
          件 見つかりました
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {!!filters.status.length && (
          <Block label="状態:">
            {filters.status.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveStatus(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.job_category.length && (
          <Block label="職種:">
            {filters.job_category.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveJobCategory(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.position.length && (
          <Block label="役職/役割:">
            {filters.position.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemovePosition(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.employment.length && (
          <Block label="雇用形態:">
            {filters.employment.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveEmployment(item)}
              />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          クリア
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: "hidden",
        borderStyle: "dashed",
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: "subtitle2" }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
