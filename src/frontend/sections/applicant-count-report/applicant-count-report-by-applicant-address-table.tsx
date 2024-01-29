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
  TableHeadCustom,
  TablePaginationCustom,
} from "@/components/table";

import { IApplicantCountReportByApplicantAddress } from "@/types/applicant-count-report";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: IApplicantCountReportByApplicantAddress[];
}

export default function ApplicantCountReportByApplicantAddressTable({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  const table = useTable({ defaultOrderBy: "count", defaultOrder: "desc" });
  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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
              onSort={table.onSort}
            />
            <TableBody>
              {dataInPage.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.prefecture_name}</TableCell>

                  <TableCell>{row.government_city_name}</TableCell>

                  <TableCell>{row.city_name}</TableCell>

                  <TableCell>{row.count}</TableCell>
                </TableRow>
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
