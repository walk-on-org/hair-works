import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Iconify from "@/components/iconify";

import {
  IAdminUserTableFilters,
  IAdminUserTableFilterValue,
} from "@/types/admin-user";
import { IAdminRoleItem } from "@/types/admin-role";

// ----------------------------------------------------------------------

type Props = {
  filters: IAdminUserTableFilters;
  onFilters: (name: string, value: IAdminUserTableFilterValue) => void;
  //
  adminRoles: IAdminRoleItem[];
};

export default function AdminUserTableToolbar({
  filters,
  onFilters,
  //
  adminRoles,
}: Props) {
  const handleFilterEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("email", event.target.value);
    },
    [onFilters]
  );

  const handleFilterAdminRole = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        "admin_role",
        typeof event.target.value === "string"
          ? event.target.value.split(",")
          : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: "flex-end", md: "center" }}
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>権限</InputLabel>

          <Select
            multiple
            value={filters.admin_role}
            onChange={handleFilterAdminRole}
            input={<OutlinedInput label="権限" />}
            renderValue={(selected) =>
              selected.map((value) => value).join(", ")
            }
            sx={{ textTransform: "capitalize" }}
          >
            {adminRoles.map((r) => (
              <MenuItem key={r.name} value={r.name}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.admin_role.includes(r.name)}
                />
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.email}
            onChange={handleFilterEmail}
            placeholder="メールアドレスより探す"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}
