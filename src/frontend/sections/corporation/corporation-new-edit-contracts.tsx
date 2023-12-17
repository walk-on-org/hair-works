import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField, RHFSelect } from "@/components/hook-form";

import { IPlanItem } from "@/types/plan";

// ----------------------------------------------------------------------

type Props = {
  plans: IPlanItem[];
};

export default function CorporationNewEditContracts({ plans }: Props) {
  const { control, watch } = useFormContext();
  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contracts",
  });

  const handleAdd = () => {
    append({
      id: "",
      plan_id: "",
      start_date: null,
      end_plan_date: null,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        契約プラン:
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
                name={`contracts.${index}.plan_id`}
                size="small"
                label="プラン"
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
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                name={`contracts.${index}.start_date`}
                label="掲載開始日"
                InputLabelProps={{ shrink: true }}
                type="date"
                disabled={
                  values.contracts[index].start_date == null ? true : false
                }
              />

              <RHFTextField
                size="small"
                name={`contracts.${index}.end_plan_date`}
                label="掲載終了日"
                InputLabelProps={{ shrink: true }}
                type="date"
                disabled={
                  values.contracts[index].end_plan_date == null ? true : false
                }
              />
            </Stack>

            {values.contracts[index].id == "" && (
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                削除
              </Button>
            )}
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
          契約プランを追加
        </Button>
      </Stack>
    </Box>
  );
}
