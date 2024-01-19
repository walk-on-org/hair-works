import { format } from "date-fns";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";

import Scrollbar from "@/components/scrollbar";
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from "@/components/table";

import { IDashboardApplicantCountEveryCorporationItem } from "@/types/dashboard";
import { fDate } from "@/utils/format-time";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: IDashboardApplicantCountEveryCorporationItem[];
}

export default function DashboardApplicantCountTableEveryCorporation({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  const table = useTable({
    defaultOrderBy: "applicant_count",
    defaultOrder: "desc",
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={tableLabels}
              rowCount={tableData.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <DashboardTableRow key={row.corporation_id} row={row} />
                ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={tableData.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type DashboardTableApplicantCountEveryCorporationRowProps = {
  row: IDashboardApplicantCountEveryCorporationItem;
};
function DashboardTableRow({
  row,
}: DashboardTableApplicantCountEveryCorporationRowProps) {
  return (
    <>
      <TableRow>
        <TableCell>{row.corporation_name}</TableCell>

        <TableCell>{row.prefecture_name}</TableCell>

        <TableCell>{row.office_count}</TableCell>

        <TableCell>{row.applicant_count}</TableCell>

        <TableCell>{row.plan_name}</TableCell>

        <TableCell>{fDate(row.start_date)}</TableCell>

        <TableCell>{fDate(row.end_plan_date)}</TableCell>

        <TableCell>{fDate(row.end_date)}</TableCell>
      </TableRow>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: IDashboardApplicantCountEveryCorporationItem[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
