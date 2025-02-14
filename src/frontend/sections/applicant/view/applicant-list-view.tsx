"use client";

import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { useBoolean } from "@/hooks/use-boolean";
import { useSearchApplicants } from "@/api/applicant";

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

import { IApplicantItem, IApplicantTableFilters } from "@/types/applicant";

import ApplicantTableRow from "../applicant-table-row";
import ApplicantTableToolbar from "../applicant-table-toolbar";
import axios, { endpoints } from "@/utils/axios";
import { EXPORT_CHAR_CODE_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "応募者ID", width: 160 },
  { id: "corporation_name", label: "法人", width: 160, minWidth: 120 },
  { id: "office_name", label: "事業所", width: 160, minWidth: 120 },
  {
    id: "office_prefecture_name",
    label: "事業所都道府県",
    width: 160,
    minWidth: 80,
  },
  { id: "job_name", label: "求人", width: 160, minWidth: 120 },
  { id: "job_recommend", label: "求人種類", width: 80, minWidth: 80 },
  { id: "name", label: "氏名", minWidth: 80 },
  { id: "created_at", label: "応募日時", width: 120, minWidth: 80 },
  { id: "proposal_type", label: "申込種別", width: 120, minWidth: 80 },
  { id: "status", label: "状態", width: 120, minWidth: 80 },
  { id: "utm_source", label: "登録経路", width: 120, minWidth: 80 },
  { id: "", width: 88 },
];

const defaultFilters: IApplicantTableFilters = {
  corporation_name: "",
  office_name: "",
  name: "",
  // TODO 登録経路
};

type Props = {
  corporationName: string;
  officeName: string;
  name: string;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function ApplicantListView({
  corporationName,
  officeName,
  name,
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
  const exportCsv = useBoolean();
  const [exportCharCode, setExportCharCode] = useState(
    EXPORT_CHAR_CODE_OPTIONS[0].value
  );
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IApplicantItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // パラメータより検索条件を指定
  let initFilters = defaultFilters;
  initFilters.corporation_name = corporationName || "";
  initFilters.office_name = officeName || "";
  initFilters.name = name || "";
  const [filters, setFilters] = useState(initFilters);

  // 応募者データ取得
  const { applicants, applicantsCount, applicantsLoading, applicantsEmpty } =
    useSearchApplicants(
      filters.corporation_name,
      filters.office_name,
      filters.name,
      limit,
      page,
      orderBy,
      order
    );

  useEffect(() => {
    setTableData(applicants);
  }, [applicants]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !applicantsLoading && applicantsEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IApplicantTableFilters) => {
      setFilters(newFilters);
      corporationName = newFilters.corporation_name;
      officeName = newFilters.office_name;
      name = newFilters.name;
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
    router.push(paths.admin.applicant.root);
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
    let url = paths.admin.applicant.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (officeName) params.office_name = officeName;
    if (name) params.name = name;
    if (page > 1) params.page = page;
    params.limit = limit;
    params.order = order == "asc" ? "asc" : "desc";
    params.orderBy = orderBy;
    const urlSearchParam = new URLSearchParams(params).toString();
    if (urlSearchParam) url += "?" + urlSearchParam;
    return url;
  };

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.applicant.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.applicant.detail(id));
    },
    [router]
  );

  const handleJobViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
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
    if (name) params.name = name;
    if (table.selected) params.member_ids = table.selected;
    params.char_code = exportCharCode;
    const urlSearchParam = new URLSearchParams(params).toString();
    let url = endpoints.applicant.downloadCsv;
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
  }, [exportCharCode, table, corporationName, officeName, name]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="応募者"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "応募者",
              href: paths.admin.applicant.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ApplicantTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={applicantsLoading}
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
              rowCount={applicantsCount}
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
                  rowCount={applicantsCount}
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
                  {applicantsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <ApplicantTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onJobViewRow={() => handleJobViewRow(row.job_id)}
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, applicantsCount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={applicantsCount}
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
                <strong> {table.selected.length || applicantsCount} </strong>
                件の応募者データを出力します。
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
    </>
  );
}
