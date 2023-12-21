"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { useGetApplicants } from "@/api/applicant";

import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";

import {
  IApplicantItem,
  IApplicantTableFilters,
  IApplicantTableFilterValue,
} from "@/types/applicant";

import ApplicantTableRow from "../applicant-table-row";
import ApplicantTableToolbar from "../applicant-table-toolbar";
import ApplicantTableFiltersResult from "../applicant-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "応募者ID", width: 160 },
  { id: "corporation", label: "法人", width: 160 },
  { id: "office", label: "事業所", width: 160 },
  { id: "office_prefecture", label: "事業所都道府県", width: 160 },
  { id: "job", label: "求人", width: 160 },
  { id: "job_recommend", label: "求人種類", width: 80 },
  { id: "name", label: "氏名" },
  { id: "applicant_date", label: "応募日時", width: 120 },
  { id: "proposal_type", label: "申込種別", width: 120 },
  { id: "status", label: "状態", width: 120 },
  { id: "register_route", label: "登録経路", width: 120 },
  { id: "", width: 88 },
];

const defaultFilters: IApplicantTableFilters = {
  corporation_name: "",
  office_name: "",
  name: "",
  // TODO 登録経路
};

// ----------------------------------------------------------------------

export default function ApplicantListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IApplicantItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // 応募者データ取得
  const { applicants, applicantsLoading, applicantsEmpty } = useGetApplicants();

  useEffect(() => {
    if (applicants.length) {
      setTableData(applicants);
    }
  }, [applicants]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || applicantsEmpty;

  const handleFilters = useCallback(
    (name: string, value: IApplicantTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.applicant.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.applicant.detail(id));
    },
    [router]
  );

  const handleJobViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="応募者"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "応募者",
              href: paths.admin.applicant.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ApplicantTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <ApplicantTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {applicantsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <ApplicantTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onJobViewRow={() => handleJobViewRow(row.job_id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IApplicantItem[];
  comparator: (a: any, b: any) => number;
  filters: IApplicantTableFilters;
}) {
  const { corporation_name, office_name, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (corporation_name) {
    inputData = inputData.filter(
      (applicant) =>
        applicant.corporation_name
          .toLowerCase()
          .indexOf(corporation_name.toLowerCase()) !== -1
    );
  }

  if (office_name) {
    inputData = inputData.filter(
      (applicant) =>
        applicant.office_name
          .toLowerCase()
          .indexOf(office_name.toLowerCase()) !== -1
    );
  }

  if (name) {
    inputData = inputData.filter(
      (applicant) =>
        applicant.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
