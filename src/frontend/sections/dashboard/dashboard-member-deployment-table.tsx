import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { TableHeadCustom } from "@/components/table";

import { IDashboardMemberDeploymentItem } from "@/types/dashboard";
import { fPercent } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: IDashboardMemberDeploymentItem[];
  expanded?: boolean;
  onlyMemberCount?: boolean;
}
export default function DashboardMemberDeploymentTable({
  title,
  subheader,
  tableLabels,
  tableData,
  expanded,
  onlyMemberCount,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <Accordion defaultExpanded={expanded}>
        <AccordionSummary
          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        >
          <Typography variant="subtitle1">{title}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <TableContainer sx={{ overflow: "unset" }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={tableLabels} />

                <TableBody>
                  <TableRow>
                    <TableCell>登録数</TableCell>
                    {tableData.map((row) => (
                      <TableCell key={row.created_ym}>
                        {row.member_count == 0 || row.member_count}
                      </TableCell>
                    ))}
                  </TableRow>
                  {!onlyMemberCount && (
                    <>
                      <TableRow>
                        <TableCell>応募促進数</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.member_count == 0 || row.entry_count}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>応募促進率</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.entry_ratio == null ||
                              `${row.entry_ratio * 100}%`}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>面接設定数</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.member_count == 0 || row.interview_count}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>面接設定率</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.interview_ratio == null ||
                              `${row.interview_ratio * 100}%`}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>内定数</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.member_count == 0 || row.offer_count}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>内定率</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.offer_ratio == null ||
                              `${row.offer_ratio * 100}%`}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>成約数</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.member_count == 0 || row.contract_count}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>成約率</TableCell>
                        {tableData.map((row) => (
                          <TableCell key={row.created_ym}>
                            {row.contract_ratio == null ||
                              `${row.contract_ratio * 100}%`}
                          </TableCell>
                        ))}
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
