"use client";

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
import { useSearchCorporations } from "@/api/corporation";

import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useSettingsContext } from "@/components/settings";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";
import { useSnackbar } from "@/components/snackbar";

import {
  ICorporationItem,
  ICorporationTableFilters,
} from "@/types/corporation";

import CorporationTableRow from "../corporation-table-row";
import CorporationTableToolbar from "../corporation-table-toolbar";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "法人ID", width: 120 },
  { id: "name", label: "法人名" },
  { id: "address", label: "住所", width: 160, minWidth: 160 },
  { id: "tel", label: "電話番号", width: 120 },
  { id: "office_count", label: "事業所数", width: 80 },
  { id: "job_count", label: "求人数", width: 80 },
  { id: "applicant_count", label: "応募数", width: 80 },
  { id: "plan_name", label: "契約プラン", width: 120, minWidth: 120 },
  { id: "start_date", label: "掲載開始日", width: 120, minWidth: 80 },
  { id: "end_plan_date", label: "掲載終了日", width: 120, minWidth: 80 },
  { id: "end_date", label: "掲載停止日", width: 120, minWidth: 80 },
  { id: "higher_display", label: "優先表示", width: 80 },
  { id: "", width: 88 },
];

const defaultFilters: ICorporationTableFilters = {
  name: "",
};

type Props = {
  corporationName: string;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function CorporationListView({
  corporationName,
  page,
  limit,
  orderBy,
  order,
}: Props) {
  const router = useRouter();
  const table = useTable({
    defaultOrderBy: orderBy,
    defaultOrder: order,
    defaultCurrentPage: 0,
    defaultRowsPerPage: limit,
  });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<ICorporationItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.name = corporationName || "";
  const [filters, setFilters] = useState(initFilters);

  // 法人データ取得
  const {
    corporations,
    corporationsCount,
    corporationsLoading,
    corporationsEmpty,
  } = useSearchCorporations(filters.name, limit, page, orderBy, order);

  useEffect(() => {
    if (corporations.length) {
      setTableData(corporations);
    }
  }, [corporations]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !corporationsLoading && corporationsEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: ICorporationTableFilters) => {
      setFilters(newFilters);
      corporationName = filters.name;
      router.push(createListUrl());
    },
    [router]
  );

  // 検索条件クリア
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    table.setPage(0);
    table.setOrder("desc");
    table.setOrderBy("id");
    router.push(paths.admin.corporation.root);
  }, [router, table]);

  // ページ変更
  const handleChangePage = useCallback(
    (newPage: number) => {
      if (page > newPage + 1) {
        // 前へ
        page -= 1;
      } else {
        // 次へ
        page += 1;
      }
      router.push(createListUrl());
    },
    [router, page]
  );

  // １ページあたりの行数変更
  const handleCangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      limit = parseInt(event.target.value);
      page = 1;
      table.setRowsPerPage(limit);
      table.setPage(0);
      router.push(createListUrl());
    },
    [router, table]
  );

  // ソート順変更
  const handleChangeSort = useCallback(
    (id: string) => {
      const isAsc = table.orderBy === id && table.order === "asc";
      if (id !== "") {
        order = isAsc ? "desc" : "asc";
        orderBy = id;
      }
      table.setOrderBy(orderBy);
      table.setOrder(order);
      router.push(createListUrl());
    },
    [router, table]
  );

  // 検索後のURLを作成
  const createListUrl = () => {
    let url = paths.admin.corporation.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (page > 1) params.page = page;
    params.limit = limit;
    params.order = order == "asc" ? "asc" : "desc";
    params.orderBy = orderBy;
    const urlSearchParam = new URLSearchParams(params).toString();
    if (urlSearchParam) url += "?" + urlSearchParam;
    return url;
  };

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await axios.post(endpoints.corporation.destroy(id));

        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(tableData.length);
        enqueueSnackbar("削除しました！");
      } catch (error) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        console.error(error);
      }
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await axios.post(endpoints.corporation.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: corporationsCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [corporationsCount, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.corporation.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.corporation.detail(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="法人"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "法人",
              href: paths.admin.corporation.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.corporation.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              法人を作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <CorporationTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={corporationsLoading}
            onClearFilters={handleResetFilters}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={corporationsCount}
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
                  rowCount={corporationsCount}
                  numSelected={table.selected.length}
                  onSort={(id) => {
                    handleChangeSort(id);
                  }}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {corporationsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <CorporationTableRow
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
                      0,
                      table.rowsPerPage,
                      corporationsCount
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={corporationsCount}
            page={page - 1}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(event, newPage) => {
              handleChangePage(newPage);
            }}
            onRowsPerPageChange={(event) => {
              handleCangeRowsPerPage(event);
            }}
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
            件の法人データを削除しますが、よろしいでしょうか?
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
