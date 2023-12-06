import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IPlanItem } from "@/types/plan";
import { fCurrency } from "@/utils/format-number";

// ----------------------------------------------------------------------

type Props = {
  row: IPlanItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
};

export default function PlanTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
}: Props) {
  const { id, name, term, amount, status, status_name } = row;
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
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {name}
          </Link>
        </TableCell>

        <TableCell>{term}</TableCell>

        <TableCell>{fCurrency(amount)}</TableCell>

        <TableCell>
          <Label variant="soft" color={(status == "1" && "info") || "default"}>
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
      </CustomPopover>
    </>
  );
}
