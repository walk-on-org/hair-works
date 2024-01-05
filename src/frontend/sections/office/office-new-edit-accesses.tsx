import { useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField, RHFSelect } from "@/components/hook-form";
import { useBoolean } from "@/hooks/use-boolean";

import { IStationItem } from "@/types/station";
import { MOVE_TYPE } from "@/config-global";
import { StationListDialog } from "../dialog";

// ----------------------------------------------------------------------

export default function OfficeNewEditAccesses() {
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
      line_name: "",
      station_id: "",
      station_name: "",
      move_type: "",
      time: 0,
      note: "",
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const [searchIndex, setSearchIndex] = useState(0);
  const search = useBoolean();
  const handleSelectStation = useCallback(
    (station: IStationItem | null, index: number) => {
      if (station) {
        setValue(`office_accesses.${index}.line_id`, station.line_id);
        setValue(`office_accesses.${index}.line_name`, station.line_name);
        setValue(`office_accesses.${index}.station_id`, station.id);
        setValue(`office_accesses.${index}.station_name`, station.name);
      } else {
        setValue(`office_accesses.${index}.line_id`, "");
        setValue(`office_accesses.${index}.line_name`, "");
        setValue(`office_accesses.${index}.station_id`, "");
        setValue(`office_accesses.${index}.station_name`, "");
      }
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
              <Stack
                direction="column"
                sx={{ marginLeft: 1, width: { xs: "100%", md: 320 } }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, color: "text.disabled" }}
                  >
                    駅：
                  </Typography>
                  <IconButton
                    onClick={() => {
                      search.onTrue();
                      setSearchIndex(index);
                    }}
                  >
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Stack>
                {values.office_accesses[index].station_id && (
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {values.office_accesses[index].line_name}&nbsp;
                    {values.office_accesses[index].station_name}駅
                  </Typography>
                )}
              </Stack>

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
                sx={{
                  maxWidth: { md: 160 },
                }}
              />

              <RHFTextField
                size="small"
                name={`office_accesses.${index}.note`}
                label="備考"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 160 },
                }}
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

      <StationListDialog
        open={search.value}
        onClose={search.onFalse}
        onSelect={(station) => handleSelectStation(station, searchIndex)}
      />
    </Box>
  );
}
