"use client";

import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";

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
import { useSearchMailmagazineConfigs } from "@/api/mailmagazine-config";

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
  IMailmagazineConfigItem,
  IMailmagazineConfigTableFilters,
} from "@/types/mailmagazine-config";

import MailmagazineConfigTableRow from "../mailmagazine-config-table-row";
import MailmagazineConfigTableToolbar from "../mailmagazine-config-table-toolbar";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "ID", width: 80 },
  { id: "title", label: "メルマガタイトル", width: 140, minWidth: 100 },
  { id: "deliver_job_type", label: "送信求人種別", width: 140, minWidth: 100 },
  { id: "job_match_distance", label: "距離（km）", width: 100, minWidth: 80 },
  {
    id: "job_count_limit",
    label: "メール内求人件数",
    width: 120,
    minWidth: 120,
  },
  {
    id: "member_condition",
    label: "会員抽出条件",
    minWidth: 360,
    noSort: true,
  },
  { id: "job_condition", label: "求人抽出条件", minWidth: 360, noSort: true },
  { id: "", width: 88 },
];

const defaultFilters: IMailmagazineConfigTableFilters = {
  title: "",
};

type Props = {
  title: string;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function MailmagazineConfigListView({
  title,
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
  const [tableData, setTableData] = useState<IMailmagazineConfigItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.title = title || "";
  const [filters, setFilters] = useState(initFilters);

  // メルマガ設定データ取得
  const {
    mailmagazineConfigs,
    mailmagazineConfigsCount,
    mailmagazineConfigsLoading,
    mailmagazineConfigsEmpty,
  } = useSearchMailmagazineConfigs(filters.title, limit, page, orderBy, order);

  useEffect(() => {
    setTableData(mailmagazineConfigs);
  }, [mailmagazineConfigs]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !mailmagazineConfigsLoading && mailmagazineConfigsEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IMailmagazineConfigTableFilters) => {
      setFilters(newFilters);
      title = newFilters.title;
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
    router.push(paths.admin.mailmagazineConfig.root);
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
    let url = paths.admin.mailmagazineConfig.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (title) params.title = title;
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
        await axios.post(endpoints.mailmagazineConfig.destroy(id));

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
      await axios.post(endpoints.mailmagazineConfig.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: mailmagazineConfigsCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [mailmagazineConfigsCount, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.mailmagazineConfig.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.mailmagazineConfig.detail(id));
    },
    [router]
  );

  // メルマガ送信リストCSV出力
  const handleDownloadSendList = useCallback(
    (id: string, exportCharCode: string) => {
      try {
        let url =
          endpoints.mailmagazineConfig.downloadSendList(id) +
          "?char_code=" +
          exportCharCode;
        axios
          .get(url, {
            responseType: "blob",
          })
          .then((res) => {
            const blob = new Blob([res.data], { type: res.data.type });
            const filename = decodeURI(
              res.headers["content-disposition"]
            ).substring(
              res.headers["content-disposition"].indexOf("''") + 2,
              res.headers["content-disposition"].length
            );
            saveAs(blob, filename);
            enqueueSnackbar("エクスポートしました！");
          });
      } catch (error) {
        enqueueSnackbar("エラーが発生しました。", { variant: "error" });
        console.error(error);
      }
    },
    []
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="メルマガ設定"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "メルマガ設定",
              href: paths.admin.mailmagazineConfig.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.mailmagazineConfig.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              メルマガ設定を作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <MailmagazineConfigTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={mailmagazineConfigsLoading}
            onClearFilters={handleResetFilters}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={mailmagazineConfigsCount}
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
                  rowCount={mailmagazineConfigsCount}
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
                  {mailmagazineConfigsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <MailmagazineConfigTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onSendList={(exportCharCode) =>
                            handleDownloadSendList(row.id, exportCharCode)
                          }
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      0,
                      table.rowsPerPage,
                      mailmagazineConfigsCount
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={mailmagazineConfigsCount}
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
            件のメルマガ設定データを削除しますが、よろしいでしょうか?
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
