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
import { useGetKeeps } from "@/api/keep";
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
  IKeepItem,
  IKeepTableFilters,
  IKeepTableFilterValue,
} from "@/types/keep";

import KeepTableRow from "../keep-table-row";
import KeepTableToolbar from "../keep-table-toolbar";
import KeepTableFiltersResult from "../keep-table-filters-result";
import { KEEP_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "お気に入りID", width: 120 },
  { id: "member", label: "会員", width: 140 },
  { id: "corporation", label: "法人", width: 160 },
  { id: "office", label: "事業所", width: 160 },
  { id: "job", label: "求人", width: 160 },
  { id: "job_category", label: "職種", width: 120 },
  { id: "position", label: "役職/役割", width: 120 },
  { id: "employment", label: "雇用形態", width: 120 },
  { id: "status", label: "状態", width: 120 },
  { id: "keeped_at", label: "お気に入り日時", width: 140 },
  { id: "released_at", label: "お気に入り解除日時", width: 140 },
];

const defaultFilters: IKeepTableFilters = {
  corporation_name: "",
  office_name: "",
  job_name: "",
  job_category: [],
  position: [],
  employment: [],
  status: [],
};

// ----------------------------------------------------------------------

export default function KeepListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IKeepItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // お気に入りデータ取得
  const { keeps, keepsLoading, keepsEmpty } = useGetKeeps();
  const { jobCategories } = useGetJobCategories();
  const { positions } = useGetPositions();
  const { employments } = useGetEmployments();

  useEffect(() => {
    if (keeps.length) {
      setTableData(keeps);
    }
  }, [keeps]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || keepsEmpty;

  const handleFilters = useCallback(
    (title: string, value: IKeepTableFilterValue) => {
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
          heading="お気に入り"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "お気に入り",
              href: paths.admin.keep.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <KeepTableToolbar
            filters={filters}
            onFilters={handleFilters}
            jobCategories={jobCategories}
            positions={positions}
            employments={employments}
            statusOptions={KEEP_STATUS_OPTIONS}
          />

          {canReset && (
            <KeepTableFiltersResult
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
                  {keepsLoading ? (
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
                          <KeepTableRow
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
  inputData: IKeepItem[];
  comparator: (a: any, b: any) => number;
  filters: IKeepTableFilters;
}) {
  const {
    corporation_name,
    office_name,
    job_name,
    job_category,
    position,
    employment,
    status,
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
      (keep) =>
        keep.corporation_name
          .toLowerCase()
          .indexOf(corporation_name.toLowerCase()) !== -1
    );
  }

  if (office_name) {
    inputData = inputData.filter(
      (keep) =>
        keep.office_name.toLowerCase().indexOf(office_name.toLowerCase()) !== -1
    );
  }

  if (job_name) {
    inputData = inputData.filter(
      (keep) =>
        keep.job_name.toLowerCase().indexOf(job_name.toLowerCase()) !== -1
    );
  }

  if (job_category.length) {
    inputData = inputData.filter((keep) =>
      job_category.includes(keep.job_category_name)
    );
  }

  if (position.length) {
    inputData = inputData.filter((keep) =>
      position.includes(keep.position_name)
    );
  }

  if (employment.length) {
    inputData = inputData.filter((keep) =>
      employment.includes(keep.employment_name)
    );
  }

  if (status.length) {
    inputData = inputData.filter((keep) => status.includes(keep.status_name));
  }

  return inputData;
}
