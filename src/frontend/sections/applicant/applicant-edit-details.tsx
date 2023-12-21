import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import { RHFSelect } from "@/components/hook-form";

import { APPLICANT_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

export default function ApplicantEditDetails() {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <RHFSelect
        fullWidth
        name="status"
        label="状態"
        InputLabelProps={{ shrink: true }}
        PaperPropsSx={{ textTransform: "capitalize" }}
      >
        <MenuItem
          value=""
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          None
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        {APPLICANT_STATUS_OPTIONS.map((row) => (
          <MenuItem key={row.value} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );
}
