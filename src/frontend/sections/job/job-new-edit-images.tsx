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

export default function JobNewEditImages() {
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "job_images",
  });

  const handleAdd = () => {
    append({
      id: "",
      image: null,
      alttext: "",
      sort: 0,
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
        setValue(`job_images.${index}.image`, newFile, {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setValue(`job_images.${index}.image`, null);
    },
    [setValue]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        求人一括設定画像:
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
                <Typography variant="subtitle2">ロゴ</Typography>
                <RHFUpload
                  thumbnail
                  name={`job_images.${index}.image`}
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
                  name={`job_images.${index}.alttext`}
                  label="画像説明"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  size="small"
                  name={`job_images.${index}.sort`}
                  label="ソート順"
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  placeholder="0"
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
          求人一括設定画像を追加
        </Button>
      </Stack>
    </Box>
  );
}
