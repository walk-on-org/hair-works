import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField } from "@/components/hook-form";

// ----------------------------------------------------------------------

export default function ApplicantEditContactHistories() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "applicant_contact_histories",
  });

  const handleAdd = () => {
    append({
      id: "",
      contact_date: "",
      contact_memo: "",
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        コンタクト履歴:
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
              <RHFTextField
                size="small"
                name={`applicant_contact_histories.${index}.contact_date`}
                label="コンタクト日"
                type="date"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                size="small"
                name={`applicant_contact_histories.${index}.contact_memo`}
                label="メモ"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                placeholder="求職者へ連絡した内容や、設定した面接日時などご自由にご記入ください。"
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
          コンタクト履歴を追加
        </Button>
      </Stack>
    </Box>
  );
}
