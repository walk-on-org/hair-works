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
import { useGetHistories } from "@/api/history";
import { useGetJobCategories } from "@/api/job-category";
import { useGetPositions } from "@/api/position";
import { useGetEmployments } from "@/api/employment";

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
  IHistoryItem,
  IHistoryTableFilters,
  IHistoryTableFilterValue,
} from "@/types/history";

import HistoryTableRow from "../history-table-row";
import HistoryTableToolbar from "../history-table-toolbar";
import HistoryTableFiltersResult from "../history-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "閲覧履歴ID", width: 120 },
  { id: "member", label: "会員", width: 140 },
  { id: "corporation", label: "法人", width: 160 },
  { id: "office", label: "事業所", width: 160 },
  { id: "job", label: "求人", width: 160 },
  { id: "job_category", label: "職種", width: 120 },
  { id: "position", label: "役職/役割", width: 120 },
  { id: "employment", label: "雇用形態", width: 120 },
  { id: "viewed_at", label: "閲覧日時", width: 140 },
];

const defaultFilters: IHistoryTableFilters = {
  corporation_name: "",
  office_name: "",
  job_name: "",
  job_category: [],
  position: [],
  employment: [],
};

// ----------------------------------------------------------------------

export default function HistoryListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IHistoryItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // 閲覧履歴データ取得
  const { histories, historiesLoading, historiesEmpty } = useGetHistories();
  const { jobCategories } = useGetJobCategories();
  const { positions } = useGetPositions();
  const { employments } = useGetEmployments();

  useEffect(() => {
    if (histories.length) {
      setTableData(histories);
    }
  }, [histories]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || historiesEmpty;

  const handleFilters = useCallback(
    (title: string, value: IHistoryTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [title]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleCorporationViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.corporation.detail(id));
    },
    [router]
  );

  const handleOfficeViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.office.detail(id));
    },
    [router]
  );

  const handleJobViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
    },
    [router]
  );

  const handleMemberViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.member.detail(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="閲覧履歴"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "閲覧履歴",
              href: paths.admin.history.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <HistoryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            jobCategories={jobCategories}
            positions={positions}
            employments={employments}
          />

          {canReset && (
            <HistoryTableFiltersResult
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
                  {historiesLoading ? (
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
                          <HistoryTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onCorporationViewRow={() =>
                              handleCorporationViewRow(row.corporation_id)
                            }
                            onOfficeViewRow={() =>
                              handleOfficeViewRow(row.office_id)
                            }
                            onJobViewRow={() => handleJobViewRow(row.job_id)}
                            onMemberViewRow={() =>
                              handleMemberViewRow(row.member_id)
                            }
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
  inputData: IHistoryItem[];
  comparator: (a: any, b: any) => number;
  filters: IHistoryTableFilters;
}) {
  const {
    corporation_name,
    office_name,
    job_name,
    job_category,
    position,
    employment,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (corporation_name) {
    inputData = inputData.filter(
      (history) =>
        history.corporation_name
          .toLowerCase()
          .indexOf(corporation_name.toLowerCase()) !== -1
    );
  }

  if (office_name) {
    inputData = inputData.filter(
      (history) =>
        history.office_name.toLowerCase().indexOf(office_name.toLowerCase()) !==
        -1
    );
  }

  if (job_name) {
    inputData = inputData.filter(
      (history) =>
        history.job_name.toLowerCase().indexOf(job_name.toLowerCase()) !== -1
    );
  }

  if (job_category.length) {
    inputData = inputData.filter((history) =>
      job_category.includes(history.job_category_name)
    );
  }

  if (position.length) {
    inputData = inputData.filter((history) =>
      position.includes(history.position_name)
    );
  }

  if (employment.length) {
    inputData = inputData.filter((history) =>
      employment.includes(history.employment_name)
    );
  }

  return inputData;
}
