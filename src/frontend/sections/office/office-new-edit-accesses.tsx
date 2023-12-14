import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField, RHFSelect } from "@/components/hook-form";

import { IStationItem } from "@/types/station";
import { MOVE_TYPE } from "@/config-global";

// ----------------------------------------------------------------------

type Props = {
  stations: IStationItem[];
};

export default function OfficeNewEditAccesses({ stations }: Props) {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "office_accesses",
  });

  const values = watch();

  const handleAdd = () => {
    append({
      id: "",
      line_id: "",
      station_id: "",
      move_type: "",
      time: 0,
      note: "",
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleSelectStation = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      const stationId = event.target.value;
      const lineId = stationId && String(stationId).substring(0, 5);
      setValue(`office_accesses.${index}.line_id`, lineId);
    },
    [setValue, values.office_accesses]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        事業所アクセス:
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
                name={`office_accesses.${index}.station_id`}
                size="small"
                label="駅"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 160 },
                }}
                onChange={(event) => handleSelectStation(event, index)}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {stations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.line_name} {station.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                name={`office_accesses.${index}.move_type`}
                size="small"
                label="移動手段"
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
                {MOVE_TYPE.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                name={`office_accesses.${index}.time`}
                label="移動時間（分）"
                InputLabelProps={{ shrink: true }}
                type="number"
                placeholder="0"
              />

              <RHFTextField
                size="small"
                name={`office_accesses.${index}.note`}
                label="備考"
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
          事業所アクセスを追加
        </Button>
      </Stack>
    </Box>
  );
}
