import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IStationItem } from "@/types/station";

// ----------------------------------------------------------------------

type Props = {
  row: IStationItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
};

export default function StationTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
    id,
    name,
    permalink,
    station_group_id,
    line_name,
    prefecture_name,
    city_name,
    status,
    status_name,
    sort,
  } = row;
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

        <TableCell>{permalink}</TableCell>

        <TableCell>{station_group_id}</TableCell>

        <TableCell>{line_name}</TableCell>

        <TableCell>{prefecture_name}</TableCell>

        <TableCell>{city_name}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status == "0" && "info") ||
              (status == "1" && "default") ||
              "warning"
            }
          >
            {status_name}
          </Label>
        </TableCell>

        <TableCell>{sort}</TableCell>

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
