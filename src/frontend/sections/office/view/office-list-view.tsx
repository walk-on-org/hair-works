"use client";

import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";
import { useBoolean } from "@/hooks/use-boolean";
import { useSearchOffices } from "@/api/office";

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

import { IOfficeItem, IOfficeTableFilters } from "@/types/office";

import OfficeTableRow from "../office-table-row";
import OfficeTableToolbar from "../office-table-toolbar";
import axios, { endpoints } from "@/utils/axios";
import { EXPORT_CHAR_CODE_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "事業所ID", width: 160 },
  { id: "corporation_name", label: "法人", width: 160 },
  { id: "name", label: "事業所名" },
  { id: "prefecture_name", label: "都道府県", width: 120 },
  { id: "city_name", label: "市区町村", width: 120 },
  { id: "address", label: "住所", width: 160 },
  { id: "tel", label: "電話番号", width: 120 },
  { id: "job_count", label: "求人数", width: 80 },
  { id: "", width: 88 },
];

const defaultFilters: IOfficeTableFilters = {
  corporation_name: "",
  name: "",
};

type Props = {
  corporationName: string;
  officeName: string;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function OfficeListView({
  corporationName,
  officeName,
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
    defaultSelected: [],
  });
  const confirm = useBoolean();
  const exportCsv = useBoolean();
  const copyConfirm = useBoolean();
  const reload = useBoolean();
  const [exportCharCode, setExportCharCode] = useState(
    EXPORT_CHAR_CODE_OPTIONS[0].value
  );
  const [originOfficeId, setOriginOfficeId] = useState("");
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IOfficeItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.corporation_name = corporationName || "";
  initFilters.name = officeName || "";
  const [filters, setFilters] = useState(initFilters);

  // 事業所データ取得
  const { offices, officesCount, officesLoading, officesEmpty } =
    useSearchOffices(
      filters.corporation_name,
      filters.name,
      limit,
      page,
      orderBy,
      order,
      reload.value
    );

  useEffect(() => {
    setTableData(offices);
  }, [offices]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !officesLoading && officesEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IOfficeTableFilters) => {
      setFilters(newFilters);
      corporationName = newFilters.corporation_name;
      officeName = newFilters.name;
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
    router.push(paths.admin.office.root);
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
    let url = paths.admin.office.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (officeName) params.office_name = officeName;
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
        await axios.post(endpoints.office.destroy(id));

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
      await axios.post(endpoints.office.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: officesCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [officesCount, table, tableData]);

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

  // CSVエクスポート文字コード変更
  const handleChangeExportCharCode = (event: SelectChangeEvent<string[]>) => {
    setExportCharCode(
      typeof event.target.value === "string"
        ? event.target.value
        : event.target.value.join(",")
    );
  };
  // CSV出力
  const handleExportCsv = useCallback(() => {
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (officeName) params.office_name = officeName;
    if (table.selected) params.office_ids = table.selected;
    params.char_code = exportCharCode;
    const urlSearchParam = new URLSearchParams(params).toString();
    let url = endpoints.office.downloadCsv;
    if (urlSearchParam) url += "?" + urlSearchParam;

    try {
      axios
        .get(url, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: res.data.type });
          const filename = decodeURI(
            res.headers["content-disposition"]
          ).substring(
            res.headers["content-disposition"].indexOf("=") + 1,
            res.headers["content-disposition"].length
          );
          saveAs(blob, filename);
          enqueueSnackbar("エクスポートしました！");
        });
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  }, [exportCharCode, table, corporationName, officeName]);

  // コピー元求人ID変更
  const handleChangeOriginOfficeId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOriginOfficeId(event.target.value);
  };
  // 求人コピー
  const handleCopyRows = useCallback(async () => {
    try {
      const res = await axios.post(
        endpoints.office.copyMultiple(originOfficeId),
        {
          ids: table.selected,
        }
      );

      if (res.data.message) {
        enqueueSnackbar(res.data.message, {
          variant: "error",
          persist: true,
        });
      } else {
        enqueueSnackbar("事業所情報をコピーしました。");
      }
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [originOfficeId, table, reload]);

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
          <OfficeTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={officesLoading}
            onClearFilters={handleResetFilters}
          />

          <Stack alignItems="flex-end" sx={{ p: 2 }}>
            <Button
              onClick={exportCsv.onTrue}
              variant="outlined"
              startIcon={<Iconify icon="ph:export-bold" />}
            >
              エクスポート
            </Button>
          </Stack>

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={officesCount}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="事業所コピー">
                    <Button color="primary" onClick={copyConfirm.onTrue}>
                      事業所コピー
                    </Button>
                  </Tooltip>
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
                  rowCount={officesCount}
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
                  {officesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
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
                    emptyRows={emptyRows(0, table.rowsPerPage, officesCount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={officesCount}
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

      <ConfirmDialog
        open={exportCsv.value}
        onClose={exportCsv.onFalse}
        title="エクスポート"
        content={
          <>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <Typography>
                <strong> {table.selected.length || officesCount} </strong>
                件の事業所データを出力します。
              </Typography>

              <Select
                value={exportCharCode.split(",")}
                onChange={handleChangeExportCharCode}
                //input={<OutlinedInput label="文字コード" />}
                sx={{ textTransform: "capitalize" }}
              >
                {EXPORT_CHAR_CODE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleExportCsv();
              exportCsv.onFalse();
            }}
          >
            エクスポート
          </Button>
        }
      />

      <ConfirmDialog
        open={copyConfirm.value}
        onClose={copyConfirm.onFalse}
        title="事業所コピー"
        content={
          <>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <Typography>
                <strong> {table.selected.length} </strong>
                件の事業所に以下で入力した事業所の情報をコピーします。
              </Typography>

              <TextField
                fullWidth
                label="コピー元事業所ID"
                value={originOfficeId}
                onChange={handleChangeOriginOfficeId}
                placeholder="事業所IDを入力"
              />
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleCopyRows();
              copyConfirm.onFalse();
            }}
          >
            コピー
          </Button>
        }
      />
    </>
  );
}
