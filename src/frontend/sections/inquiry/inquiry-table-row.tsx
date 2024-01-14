import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import { useBoolean } from "@/hooks/use-boolean";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IInquiryItem } from "@/types/inquiry";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  row: IInquiryItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function InquiryTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    salon_name,
    name,
    tel,
    mail,
    prefecture_name,
    inquiry_type_name,
    status,
    status_name,
    created_at,
    register_root,
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{salon_name}</TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{tel}</TableCell>

        <TableCell>{mail}</TableCell>

        <TableCell>{prefecture_name}</TableCell>

        <TableCell>{inquiry_type_name}</TableCell>

        <TableCell>
          <Label variant="soft" color={(status == "0" && "info") || "default"}>
            {status_name}
          </Label>
        </TableCell>

        <TableCell>{fDateTime(created_at)}</TableCell>

        <TableCell>{register_root}</TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          詳細
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          編集
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          削除
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="削除"
        content="削除してよろしいでしょうか?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            削除
          </Button>
        }
      />
    </>
  );
}
