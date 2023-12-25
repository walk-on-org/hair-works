import Link from "@mui/material/Link";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";

import Label from "@/components/label";

import { IKeepItem } from "@/types/keep";
import { fDateTime } from "@/utils/format-time";

// ----------------------------------------------------------------------

type Props = {
  row: IKeepItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onCorporationViewRow: VoidFunction;
  onOfficeViewRow: VoidFunction;
  onJobViewRow: VoidFunction;
  onMemberViewRow: VoidFunction;
};

export default function KeepTableRow({
  row,
  selected,
  onSelectRow,
  onCorporationViewRow,
  onOfficeViewRow,
  onJobViewRow,
  onMemberViewRow,
}: Props) {
  const {
    id,
    member_id,
    member_name,
    corporation_id,
    corporation_name,
    office_id,
    office_name,
    job_id,
    job_name,
    job_category_name,
    position_name,
    employment_name,
    status,
    status_name,
    keeped_at,
    released_at,
  } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>
          {member_id ? (
            <Link noWrap onClick={onMemberViewRow} sx={{ cursor: "pointer" }}>
              {member_name}
            </Link>
          ) : (
            `(不明)`
          )}
        </TableCell>

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
          <Link noWrap onClick={onOfficeViewRow} sx={{ cursor: "pointer" }}>
            {office_name}
          </Link>
        </TableCell>

        <TableCell>
          <Link noWrap onClick={onJobViewRow} sx={{ cursor: "pointer" }}>
            {job_name}
          </Link>
        </TableCell>

        <TableCell>{job_category_name}</TableCell>

        <TableCell>{position_name}</TableCell>

        <TableCell>{employment_name}</TableCell>

        <TableCell>
          <Label variant="soft" color={(status == "1" && "info") || "default"}>
            {status_name}
          </Label>
        </TableCell>

        <TableCell>{fDateTime(keeped_at)}</TableCell>

        <TableCell>{fDateTime(released_at)}</TableCell>
      </TableRow>
    </>
  );
}
