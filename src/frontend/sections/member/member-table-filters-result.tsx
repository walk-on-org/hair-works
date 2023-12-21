import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack, { StackProps } from "@mui/material/Stack";

import Iconify from "@/components/iconify";

import { IMemberTableFilters, IMemberTableFilterValue } from "@/types/member";

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IMemberTableFilters;
  onFilters: (name: string, value: IMemberTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function MemberTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveEmpPrefecture = (inputValue: string) => {
    const newValue = filters.emp_prefecture.filter(
      (item) => item !== inputValue
    );
    onFilters("emp_prefecture", newValue);
  };

  const handleRemoveRegisterSite = (inputValue: string) => {
    const newValue = filters.register_site.filter(
      (item) => item !== inputValue
    );
    onFilters("register_site", newValue);
  };

  const handleRemoveRegisterForm = (inputValue: string) => {
    const newValue = filters.register_form.filter(
      (item) => item !== inputValue
    );
    onFilters("register_form", newValue);
  };

  const handleRemoveIntroductionGiftStatus = (inputValue: string) => {
    const newValue = filters.introduction_gift_status.filter(
      (item) => item !== inputValue
    );
    onFilters("introduction_gift_status", newValue);
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
        {!!filters.emp_prefecture.length && (
          <Block label="希望勤務地:">
            {filters.emp_prefecture.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveEmpPrefecture(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.register_site.length && (
          <Block label="登録サイト:">
            {filters.register_site.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveRegisterSite(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.register_form.length && (
          <Block label="登録フォーム:">
            {filters.register_form.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveRegisterForm(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.introduction_gift_status.length && (
          <Block label="紹介プレゼントステータス:">
            {filters.introduction_gift_status.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveIntroductionGiftStatus(item)}
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
