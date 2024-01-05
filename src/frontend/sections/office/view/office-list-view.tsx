"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetOffices } from "@/api/office";

import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
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
import { useSnackbar } from "@/components/snackbar";

import {
  IOfficeItem,
  IOfficeTableFilters,
  IOfficeTableFilterValue,
} from "@/types/office";

import OfficeTableRow from "../office-table-row";
import OfficeTableToolbar from "../office-table-toolbar";
import OfficeTableFiltersResult from "../office-table-filters-result";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "事業所ID", width: 160 },
  { id: "corporation", label: "法人", width: 160 },
  { id: "name", label: "事業所名" },
  { id: "prefecture", label: "都道府県", width: 120 },
  { id: "city", label: "市区町村", width: 120 },
  { id: "address", label: "住所", width: 160 },
  { id: "tel", label: "電話番号", width: 120 },
  { id: "job_count", label: "求人数", width: 80 },
  { id: "", width: 88 },
];

const defaultFilters: IOfficeTableFilters = {
  corporation_name: "",
  name: "",
};

// ----------------------------------------------------------------------

export default function OfficeListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id", defaultOrder: "desc" });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IOfficeItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();

  // 事業所データ取得
  const { offices, officesLoading, officesEmpty } = useGetOffices();

  useEffect(() => {
    if (offices.length) {
      setTableData(offices);
    }
  }, [offices]);

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

  const notFound = (!dataFiltered.length && canReset) || officesEmpty;

  const handleFilters = useCallback(
    (name: string, value: IOfficeTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axios.post(endpoints.office.destroy(id));

        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
        enqueueSnackbar("削除しました！");
      } catch (error) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        console.error(error);
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await axios.post(endpoints.office.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: tableData.length,
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.office.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.office.detail(id));
    },
    [router]
  );

  const handleCorporationViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.corporation.detail(id));
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
          heading="事業所"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "事業所",
              href: paths.admin.office.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.office.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              事業所を作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <OfficeTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <OfficeTableFiltersResult
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
              action={
                <Stack direction="row">
                  <Tooltip title="削除">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
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
                  {officesLoading ? (
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
                          <OfficeTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onCorporationViewRow={() =>
                              handleCorporationViewRow(row.corporation_id)
                            }
                            onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="削除"
        content={
          <>
            <strong> {table.selected.length} </strong>
            件の事業所データを削除しますが、よろしいでしょうか?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            削除
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IOfficeItem[];
  comparator: (a: any, b: any) => number;
  filters: IOfficeTableFilters;
}) {
  const { corporation_name, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (corporation_name) {
    inputData = inputData.filter(
      (office) =>
        office.corporation_name
          .toLowerCase()
          .indexOf(corporation_name.toLowerCase()) !== -1
    );
  }

  if (name) {
    inputData = inputData.filter(
      (office) => office.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
