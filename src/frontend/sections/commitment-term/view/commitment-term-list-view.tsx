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

import { useGetCommitmentTerms } from "@/api/commitment-term";

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
  ICommitmentTermItem,
  ICommitmentTermTableFilters,
  ICommitmentTermTableFilterValue,
} from "@/types/commitment-term";

import CommitmentTermTableRow from "../commitment-term-table-row";
import CommitmentTermTableToolbar from "../commitment-term-table-toolbar";
import CommitmentTermTableFiltersResult from "../commitment-term-table-filters-result";
import { STATUS_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "こだわり条件ID", width: 160 },
  { id: "name", label: "こだわり条件名" },
  { id: "permalink", label: "パーマリンク", width: 160 },
  { id: "category", label: "カテゴリ", width: 110 },
  { id: "recommend", label: "おすすめ", width: 110 },
  { id: "status", label: "状態", width: 110 },
  { id: "", width: 88 },
];

const defaultFilters: ICommitmentTermTableFilters = {
  name: "",
  status: [],
};

// ----------------------------------------------------------------------

export default function CommitmentTermListView() {
  const router = useRouter();
  const table = useTable();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<ICommitmentTermItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // こだわり条件データ取得
  const { commitmentTerms, commitmentTermsLoading, commitmentTermsEmpty } =
    useGetCommitmentTerms();

  useEffect(() => {
    if (commitmentTerms.length) {
      setTableData(commitmentTerms);
    }
  }, [commitmentTerms]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || commitmentTermsEmpty;

  const handleFilters = useCallback(
    (name: string, value: ICommitmentTermTableFilterValue) => {
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
      router.push(paths.admin.commitmentTerm.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.commitmentTerm.detail(id));
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
          heading="こだわり条件マスタ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "こだわり条件マスタ",
              href: paths.admin.commitmentTerm.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.commitmentTerm.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              こだわり条件マスタを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CommitmentTermTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            statusOptions={STATUS_OPTIONS}
          />

          {canReset && (
            <CommitmentTermTableFiltersResult
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
                  {commitmentTermsLoading ? (
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
                          <CommitmentTermTableRow
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
  inputData: ICommitmentTermItem[];
  comparator: (a: any, b: any) => number;
  filters: ICommitmentTermTableFilters;
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
      (commitmentTerm) =>
        commitmentTerm.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    inputData = inputData.filter((commitmentTerm) =>
      status.includes(commitmentTerm.status_name)
    );
  }

  return inputData;
}
