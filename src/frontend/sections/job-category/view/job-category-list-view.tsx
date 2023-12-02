"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import { useGetJobCategories } from "@/api/job-category";

import Iconify from "@/components/iconify";
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
  IJobCategoryItem,
  IJobCategoryTableFilters,
  IJobCategoryTableFilterValue,
} from "@/types/job-category";

import JobCategoryTableRow from "../job-category-table-row";
import JobCategoryTableToolbar from "../job-category-table-toolbar";
import JobCategoryTableFiltersResult from "../job-category-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "職種ID", width: 80 },
  { id: "name", label: "職種名" },
  { id: "permalink", label: "パーマリンク", width: 160 },
  { id: "status", label: "状態", width: 110 },
  { id: "", width: 88 },
];

const STATUS_OPTIONS = [
  { value: "1", label: "有効" },
  { value: "0", label: "無効" },
];

const defaultFilters: IJobCategoryTableFilters = {
  name: "",
  status: [],
};

// ----------------------------------------------------------------------

export default function JobCategoryListView() {
  const router = useRouter();
  const table = useTable();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IJobCategoryItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // 職種データ取得
  const { jobCategories, jobCategoriesLoading, jobCategoriesEmpty } =
    useGetJobCategories();

  useEffect(() => {
    if (jobCategories.length) {
      setTableData(jobCategories);
    }
  }, [jobCategories]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || jobCategoriesEmpty;

  const handleFilters = useCallback(
    (name: string, value: IJobCategoryTableFilterValue) => {
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
      router.push(paths.admin.jobCategory.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.jobCategory.detail(id));
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
          heading="職種マスタ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "職種マスタ",
              href: paths.admin.jobCategory.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.jobCategory.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              職種マスタを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <JobCategoryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            statusOptions={STATUS_OPTIONS}
          />

          {canReset && (
            <JobCategoryTableFiltersResult
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
                  {jobCategoriesLoading ? (
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
                          <JobCategoryTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
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
  inputData: IJobCategoryItem[];
  comparator: (a: any, b: any) => number;
  filters: IJobCategoryTableFilters;
}) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (jobCategory) =>
        jobCategory.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    inputData = inputData.filter((jobCategory) =>
      status.includes(jobCategory.status)
    );
  }

  return inputData;
}
