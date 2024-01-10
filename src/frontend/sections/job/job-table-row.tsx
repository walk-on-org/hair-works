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

import { IJobItem } from "@/types/job";

// ----------------------------------------------------------------------

type Props = {
  row: IJobItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onCorporationViewRow: VoidFunction;
  onOfficeViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function JobTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onCorporationViewRow,
  onOfficeViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    name,
    corporation_id,
    corporation_name,
    office_id,
    office_name,
    job_category_name,
    position_name,
    employment_name,
    status,
    status_name,
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

        <TableCell>
          <Link
            noWrap
            variant="subtitle2"
            onClick={onCorporationViewRow}
            sx={{ cursor: "pointer" }}
          >
            {corporation_name}
          </Link>
        </TableCell>

        <TableCell>
          <Link
            noWrap
            variant="subtitle2"
            onClick={onOfficeViewRow}
            sx={{ cursor: "pointer" }}
          >
            {office_name}
          </Link>
        </TableCell>

        <TableCell>
          <Link
            noWrap
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {name}
          </Link>
        </TableCell>

        <TableCell>{job_category_name}</TableCell>

        <TableCell>{position_name}</TableCell>

        <TableCell>{employment_name}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status == "10" && "info") ||
              (status == "20" && "warning") ||
              "default"
            }
          >
            {status_name}
          </Label>
        </TableCell>

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
