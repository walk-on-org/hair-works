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

import { ICorporationItem } from "@/types/corporation";
import { fDate } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  row: ICorporationItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CorporationTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    name,
    prefecture_name,
    city_name,
    address,
    tel,
    office_count,
    job_count,
    higher_display,
    higher_display_name,
    plan_name,
    start_date,
    end_plan_date,
    end_date,
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
          <Link noWrap onClick={onViewRow} sx={{ cursor: "pointer" }}>
            {name}
          </Link>
        </TableCell>

        <TableCell>{prefecture_name + city_name + address}</TableCell>

        <TableCell>{tel}</TableCell>

        <TableCell>{office_count}</TableCell>

        <TableCell>{job_count}</TableCell>

        <TableCell>TODO</TableCell>

        <TableCell>{plan_name}</TableCell>

        <TableCell>{start_date && fDate(start_date, "yyyy/MM/dd")}</TableCell>

        <TableCell>
          {end_plan_date && fDate(end_plan_date, "yyyy/MM/dd")}
        </TableCell>

        <TableCell>{end_date && fDate(end_date, "yyyy/MM/dd")}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(higher_display == "1" && "info") || "default"}
          >
            {higher_display_name}
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
