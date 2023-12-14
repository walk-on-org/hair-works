import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField, RHFSelect } from "@/components/hook-form";
import { CLIENTELE } from "@/config-global";

// ----------------------------------------------------------------------

export default function OfficeNewEditClienteles() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "office_clienteles",
  });

  const handleAdd = () => {
    append({
      id: "",
      clientele: "",
      othertext: "",
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        客層:
      </Typography>
      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={3}
      >
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ width: 1 }}
            >
              <RHFSelect
                name={`office_clienteles.${index}.clientele`}
                size="small"
                label="客層"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 160 },
                }}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {CLIENTELE.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                name={`office_clienteles.${index}.othertext`}
                label="その他"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              削除
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          客層を追加
        </Button>
      </Stack>
    </Box>
  );
}
