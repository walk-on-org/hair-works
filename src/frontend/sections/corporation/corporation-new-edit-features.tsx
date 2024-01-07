import { useFieldArray, useFormContext } from "react-hook-form";
import { useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Iconify from "@/components/iconify";
import { RHFTextField, RHFUpload } from "@/components/hook-form";

// ----------------------------------------------------------------------

export default function CorporationNewEditFeatures() {
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "corporation_features",
  });

  const handleAdd = () => {
    append({
      id: "",
      feature: "",
      image: null,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleDrop = useCallback(
    (index: number, acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(`corporation_features.${index}.image`, newFile, {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setValue(`corporation_features.${index}.image`, null);
    },
    [setValue]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        特徴:
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
              <Stack spacing={1.5} width={{ xs: "auto", md: 400 }}>
                <Typography variant="subtitle2">画像</Typography>
                <RHFUpload
                  thumbnail
                  name={`corporation_features.${index}.image`}
                  maxSize={3145728}
                  onDrop={(inputFile) => handleDrop(index, inputFile)}
                  onDelete={() => handleRemoveFile(index)}
                />
              </Stack>

              <Stack
                direction="column"
                mt={{ xs: 0, md: 4 }}
                spacing={1.5}
                flexShrink={0}
              >
                <RHFTextField
                  size="small"
                  name={`corporation_features.${index}.feature`}
                  label="特徴"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
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
          特徴を追加
        </Button>
      </Stack>
    </Box>
  );
}
