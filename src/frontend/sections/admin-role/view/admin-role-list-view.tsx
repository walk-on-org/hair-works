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
import { useGetAdminRoles } from "@/api/admin-role";

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

import { IAdminRoleItem, IAdminRoleTableFilters } from "@/types/admin-role";

import AdminRoleTableRow from "../admin-role-table-row";
import axios, { endpoints } from "@/utils/axios";

const defaultFilters: IAdminRoleTableFilters = {};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "ロールID", width: 160 },
  { id: "name", label: "ロール名" },
  { id: "", width: 88 },
];

// ----------------------------------------------------------------------

export default function AdminRoleListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IAdminRoleItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();

  // 管理者ロールデータ取得
  const { adminRoles, adminRolesLoading, adminRolesEmpty } = useGetAdminRoles();

  useEffect(() => {
    if (adminRoles.length) {
      setTableData(adminRoles);
    }
  }, [adminRoles]);

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

  const notFound = (!dataFiltered.length && canReset) || adminRolesEmpty;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axios.post(endpoints.adminRole.destroy(id));

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
      await axios.post(endpoints.adminRole.destroyMultiple, {
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
      router.push(paths.admin.adminRole.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.adminRole.detail(id));
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
          heading="管理者ロール"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "管理者ロール",
              href: paths.admin.adminRole.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.adminRole.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              管理者ロールを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
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
                  {adminRolesLoading ? (
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
                          <AdminRoleTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
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
            件の管理者ロールデータを削除しますが、よろしいでしょうか?
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
  inputData: IAdminRoleItem[];
  comparator: (a: any, b: any) => number;
  filters: IAdminRoleTableFilters;
}) {
  return inputData;
}
