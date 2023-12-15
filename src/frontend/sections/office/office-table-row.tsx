import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import { useBoolean } from "@/hooks/use-boolean";

import Iconify from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IOfficeItem } from "@/types/office";

// ----------------------------------------------------------------------

type Props = {
  row: IOfficeItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onCorporationViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OfficeTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onCorporationViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    name,
    corporation_name,
    prefecture_name,
    city_name,
    address,
    tel,
    job_count,
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
            onClick={onCorporationViewRow}
            sx={{ cursor: "pointer" }}
          >
            {corporation_name}
          </Link>
        </TableCell>

        <TableCell>
          <Link noWrap onClick={onViewRow} sx={{ cursor: "pointer" }}>
            {name}
          </Link>
        </TableCell>

        <TableCell>{prefecture_name}</TableCell>

        <TableCell>{city_name}</TableCell>

        <TableCell>{address}</TableCell>

        <TableCell>{tel}</TableCell>

        <TableCell>{job_count}</TableCell>

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
