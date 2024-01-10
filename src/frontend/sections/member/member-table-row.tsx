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

import { IMemberItem } from "@/types/member";

// ----------------------------------------------------------------------

type Props = {
  row: IMemberItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onJobViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function MemberTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onJobViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    name,
    email,
    phone,
    change_time_name,
    employment_name,
    emp_prefecture_name,
    status_name,
    applicant_count,
    register_site_name,
    register_form_name,
    register_root,
    job_id,
    job_name,
    member_proposal_datetimes_text,
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
            onClick={onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {name}
          </Link>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>{change_time_name}</TableCell>

        <TableCell>{employment_name}</TableCell>

        <TableCell>{emp_prefecture_name}</TableCell>

        <TableCell>
          <Label variant="soft" color="default">
            {status_name}
          </Label>
        </TableCell>

        <TableCell>{applicant_count}</TableCell>

        <TableCell>{register_site_name}</TableCell>

        <TableCell>{register_form_name}</TableCell>

        <TableCell>{register_root}</TableCell>

        <TableCell>
          {job_id && (
            <Link noWrap onClick={onJobViewRow} sx={{ cursor: "pointer" }}>
              {job_name}
            </Link>
          )}
        </TableCell>

        <TableCell>{member_proposal_datetimes_text}</TableCell>

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
