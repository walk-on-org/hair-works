import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IAdKeywordItem } from "@/types/ad-keyword";

// ----------------------------------------------------------------------

type Props = {
  row: IAdKeywordItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
};

export default function AdKeywordTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
    id,
    utm_source,
    utm_medium,
    utm_campaign,
    keyword_id,
    ad_group,
    keyword,
    match_type_name,
  } = row;
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{utm_source}</TableCell>

        <TableCell>{utm_medium}</TableCell>

        <TableCell>{utm_campaign}</TableCell>

        <TableCell>{keyword_id}</TableCell>

        <TableCell>{ad_group}</TableCell>

        <TableCell>{keyword}</TableCell>

        <TableCell>
          <Label variant="soft" color={"default"}>
            {match_type_name}
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
