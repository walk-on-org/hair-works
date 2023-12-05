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

import { useGetLines } from "@/api/line";
import { useGetTrainCompanies } from "@/api/train-company";

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
  ILineItem,
  ILineTableFilters,
  ILineTableFilterValue,
} from "@/types/line";

import LineTableRow from "../line-table-row";
import LineTableToolbar from "../line-table-toolbar";
import LineTableFiltersResult from "../line-table-filters-result";
import { TRAIN_STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "路線ID", width: 160 },
  { id: "name", label: "路線名" },
  { id: "permalink", label: "パーマリンク", width: 160 },
  { id: "train_company", label: "鉄道事業者", width: 120 },
  { id: "status", label: "状態", width: 110 },
  { id: "sort", label: "並び順", width: 110 },
  { id: "", width: 88 },
];

const defaultFilters: ILineTableFilters = {
  name: "",
  status: [],
  trainCompany: [],
};

// ----------------------------------------------------------------------

export default function LineListView() {
  const router = useRouter();
  const table = useTable();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<ILineItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // 路線データ取得
  const { lines, linesLoading, linesEmpty } = useGetLines();
  const { trainCompanies } = useGetTrainCompanies();

  useEffect(() => {
    if (lines.length) {
      setTableData(lines);
    }
  }, [lines]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || linesEmpty;

  const handleFilters = useCallback(
    (name: string, value: ILineTableFilterValue) => {
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
      router.push(paths.admin.line.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.line.detail(id));
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
          heading="路線マスタ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "路線マスタ",
              href: paths.admin.line.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.line.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              路線マスタを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <LineTableToolbar
            filters={filters}
            onFilters={handleFilters}
            trainCompanies={trainCompanies}
            statusOptions={TRAIN_STATUS_OPTIONS}
          />

          {canReset && (
            <LineTableFiltersResult
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
                  {linesLoading ? (
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
                          <LineTableRow
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
  inputData: ILineItem[];
  comparator: (a: any, b: any) => number;
  filters: ILineTableFilters;
}) {
  const { name, status, trainCompany } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (line) => line.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    inputData = inputData.filter((line) => status.includes(line.status_name));
  }

  if (trainCompany.length) {
    inputData = inputData.filter((line) =>
      trainCompany.includes(line.train_company_name)
    );
  }

  return inputData;
}
