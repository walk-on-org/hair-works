"use client";

import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { useSearchConversionHistories } from "@/api/conversion-history";

import Scrollbar from "@/components/scrollbar";
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

import {
  IConversionHistoryItem,
  IConversionHistoryTableFilters,
} from "@/types/conversion-history";

import ConversionHistoryTableRow from "../conversion-history-table-row";
import ConversionHistoryTableToolbar from "../conversion-history-table-toolbar";
import { fDate } from "@/utils/format-time";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "連番", width: 120 },
  { id: "utm_source", label: "utm_source", width: 140 },
  { id: "utm_medium", label: "utm_medium", width: 140 },
  { id: "utm_campaign", label: "utm_campaign", width: 140 },
  { id: "utm_term", label: "utm_term", width: 140 },
  { id: "keyword", label: "キーワード", width: 140, minWidth: 100 },
  { id: "lp_url", label: "LP", width: 140 },
  { id: "lp_date", label: "LP日時", width: 140 },
  { id: "cv_url", label: "CV", width: 140 },
  { id: "cv_date", label: "CV日時", width: 140 },
  { id: "cv_row", label: "会員・応募者・問合せ", width: 140, noSort: true },
];

const defaultFilters: IConversionHistoryTableFilters = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  lp_url: "",
  lp_start_date: null,
  lp_end_date: null,
  cv_url: "",
  cv_start_date: null,
  cv_end_date: null,
};

type Props = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  lpUrl: string;
  lpStartDate: Date | null;
  lpEndDate: Date | null;
  cvUrl: string;
  cvStartDate: Date | null;
  cvEndDate: Date | null;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function ConversionHistoryListView({
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  lpUrl,
  lpStartDate,
  lpEndDate,
  cvUrl,
  cvStartDate,
  cvEndDate,
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
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IConversionHistoryItem[]>([]);

  // パラメータより検索条件を指定
  let initFilters = defaultFilters;
  initFilters.utm_source = utmSource || "";
  initFilters.utm_medium = utmMedium || "";
  initFilters.utm_campaign = utmCampaign || "";
  initFilters.utm_term = utmTerm || "";
  initFilters.lp_url = lpUrl || "";
  initFilters.lp_start_date = lpStartDate || null;
  initFilters.lp_end_date = lpEndDate || null;
  initFilters.cv_url = cvUrl || "";
  initFilters.cv_start_date = cvStartDate || null;
  initFilters.cv_end_date = cvEndDate || null;
  const [filters, setFilters] = useState(initFilters);

  // CV経路データ取得
  const {
    conversionHistories,
    conversionHistoriesCount,
    conversionHistoriesLoading,
    conversionHistoriesEmpty,
  } = useSearchConversionHistories(
    filters.utm_source,
    filters.utm_medium,
    filters.utm_campaign,
    filters.utm_term,
    filters.lp_url,
    fDate(filters.lp_start_date, "yyyy-MM-dd"),
    fDate(filters.lp_end_date, "yyyy-MM-dd"),
    filters.cv_url,
    fDate(filters.cv_start_date, "yyyy-MM-dd"),
    fDate(filters.cv_end_date, "yyyy-MM-dd"),
    limit,
    page,
    orderBy,
    order
  );

  useEffect(() => {
    setTableData(conversionHistories);
  }, [conversionHistories]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !conversionHistoriesLoading && conversionHistoriesEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IConversionHistoryTableFilters) => {
      setFilters(newFilters);
      utmSource = newFilters.utm_source;
      utmMedium = newFilters.utm_medium;
      utmCampaign = newFilters.utm_campaign;
      utmTerm = newFilters.utm_term;
      lpUrl = newFilters.lp_url;
      lpStartDate = newFilters.lp_start_date;
      lpEndDate = newFilters.lp_end_date;
      cvUrl = newFilters.cv_url;
      cvStartDate = newFilters.cv_start_date;
      cvEndDate = newFilters.cv_end_date;
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
    router.push(paths.admin.conversionHistory.root);
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
    let url = paths.admin.conversionHistory.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (utmSource) params.utm_source = utmSource;
    if (utmMedium) params.utm_medium = utmMedium;
    if (utmCampaign) params.utm_campaign = utmCampaign;
    if (utmTerm) params.utm_term = utmTerm;
    if (lpUrl) params.lp_url = lpUrl;
    if (lpStartDate) params.lp_start_date = fDate(lpStartDate, "yyyy-MM-dd");
    if (lpEndDate) params.lp_end_date = fDate(lpEndDate, "yyyy-MM-dd");
    if (cvUrl) params.cv_url = cvUrl;
    if (cvStartDate) params.cv_start_date = fDate(cvStartDate, "yyyy-MM-dd");
    if (cvEndDate) params.cv_end_date = fDate(cvEndDate, "yyyy-MM-dd");
    if (page > 1) params.page = page;
    params.limit = limit;
    params.order = order == "asc" ? "asc" : "desc";
    params.orderBy = orderBy;
    const urlSearchParam = new URLSearchParams(params).toString();
    if (urlSearchParam) url += "?" + urlSearchParam;
    return url;
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="CV経路"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "CV経路",
              href: paths.admin.conversionHistory.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ConversionHistoryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={conversionHistoriesLoading}
            onClearFilters={handleResetFilters}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={conversionHistoriesCount}
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
                  rowCount={conversionHistoriesCount}
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
                  {conversionHistoriesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <ConversionHistoryTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      0,
                      table.rowsPerPage,
                      conversionHistoriesCount
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={conversionHistoriesCount}
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
    </>
  );
}
