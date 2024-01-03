import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack, { StackProps } from "@mui/material/Stack";

import Iconify from "@/components/iconify";

import {
  IAdminUserTableFilters,
  IAdminUserTableFilterValue,
} from "@/types/admin-user";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IAdminUserTableFilters;
  onFilters: (name: string, value: IAdminUserTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function AdminUserTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveAdminRole = (inputValue: string) => {
    const newValue = filters.admin_role.filter((item) => item !== inputValue);
    onFilters("admin_role", newValue);
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
        {!!filters.admin_role.length && (
          <Block label="権限:">
            {filters.admin_role.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveAdminRole(item)}
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
