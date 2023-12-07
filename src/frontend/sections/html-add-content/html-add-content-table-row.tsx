import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IHtmlAddContentItem } from "@/types/html-add-content";

// ----------------------------------------------------------------------

type Props = {
  row: IHtmlAddContentItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
};

export default function HtmlAddContentTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
    id,
    prefecture_name,
    government_city_name,
    city_name,
    station_name,
    display_average_salary,
    display_average_salary_name,
    display_feature,
    display_feature_name,
  } = row;
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{prefecture_name}</TableCell>

        <TableCell>{government_city_name}</TableCell>

        <TableCell>{city_name}</TableCell>

        <TableCell>{station_name}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(display_average_salary == "1" && "info") || "default"}
          >
            {display_average_salary_name}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(display_feature == "1" && "info") || "default"}
          >
            {display_feature_name}
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
