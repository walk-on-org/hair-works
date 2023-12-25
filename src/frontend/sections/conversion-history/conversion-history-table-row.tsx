import Link from "@mui/material/Link";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";

import { IConversionHistoryItem } from "@/types/conversion-history";
import { fDateTime } from "@/utils/format-time";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

type Props = {
  row: IConversionHistoryItem;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function ConversionHistoryTableRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const {
    id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    keyword,
    lp_url,
    lp_date,
    cv_url,
    cv_date,
    member_id,
    member_name,
    applicant_id,
    applicant_name,
    inquiry_id,
    inquiry_name,
  } = row;

  let link;
  if (member_id != null) {
    link = (
      <Link
        noWrap
        href={paths.admin.member.detail(member_id)}
        color="inherit"
        variant="subtitle2"
        sx={{ cursor: "pointer" }}
      >
        {member_name}
      </Link>
    );
  } else if (applicant_id != null) {
    link = (
      <Link
        noWrap
        href={paths.admin.applicant.detail(applicant_id)}
        color="inherit"
        variant="subtitle2"
        sx={{ cursor: "pointer" }}
      >
        {applicant_name}
      </Link>
    );
  } else if (inquiry_id != null) {
    link = (
      <Link
        noWrap
        href={paths.admin.inquiry.detail(inquiry_id)}
        color="inherit"
        variant="subtitle2"
        sx={{ cursor: "pointer" }}
      >
        {inquiry_name}
      </Link>
    );
  }

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

        <TableCell>{utm_term}</TableCell>

        <TableCell>{keyword}</TableCell>

        <TableCell>{lp_url}</TableCell>

        <TableCell>{fDateTime(lp_date)}</TableCell>

        <TableCell>{cv_url}</TableCell>

        <TableCell>{fDateTime(cv_date)}</TableCell>

        <TableCell>{link}</TableCell>
      </TableRow>
    </>
  );
}
