import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IApplicantItem } from "@/types/applicant";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  row: IApplicantItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onJobViewRow: VoidFunction;
  onSelectRow: VoidFunction;
};

export default function ApplicantTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onJobViewRow,
}: Props) {
  const {
    id,
    name,
    corporation_name,
    office_name,
    office_prefecture_name,
    job_name,
    job_recommend_name,
    created_at,
    proposal_type_name,
    status_name,
    register_root,
  } = row;
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{corporation_name}</TableCell>

        <TableCell>{office_name}</TableCell>

        <TableCell>{office_prefecture_name}</TableCell>

        <TableCell>
          <Link
            noWrap
            variant="subtitle2"
            onClick={onJobViewRow}
            sx={{ cursor: "pointer" }}
          >
            {job_name}
          </Link>
        </TableCell>

        <TableCell>{job_recommend_name}</TableCell>

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

        <TableCell>{fDateTime(created_at)}</TableCell>

        <TableCell>{proposal_type_name}</TableCell>

        <TableCell>
          <Label variant="soft" color="default">
            {status_name}
          </Label>
        </TableCell>

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
      </CustomPopover>
    </>
  );
}
