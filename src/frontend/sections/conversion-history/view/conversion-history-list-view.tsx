"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { fTimestamp } from "@/utils/format-time";
import { useGetConversionHistories } from "@/api/conversion-history";

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
  IConversionHistoryItem,
  IConversionHistoryTableFilters,
  IConversionHistoryTableFilterValue,
} from "@/types/conversion-history";

import ConversionHistoryTableRow from "../conversion-history-table-row";
import ConversionHistoryTableToolbar from "../conversion-history-table-toolbar";
import ConversionHistoryTableFiltersResult from "../conversion-history-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "連番", width: 120 },
  { id: "utm_source", label: "utm_source", width: 140 },
  { id: "utm_medium", label: "utm_medium", width: 140 },
  { id: "utm_campaign", label: "utm_campaign", width: 140 },
  { id: "utm_term", label: "utm_term", width: 140 },
  { id: "keyword", label: "キーワード", width: 140 },
  { id: "lp_url", label: "LP", width: 140 },
  { id: "lp_date", label: "LP日時", width: 140 },
  { id: "cv_url", label: "CV", width: 140 },
  { id: "cv_date", label: "CV日時", width: 140 },
  { id: "cv_row", label: "会員・応募者・問合せ", width: 140 },
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

// ----------------------------------------------------------------------

export default function CustomLpListView() {
  const table = useTable({ defaultOrderBy: "id" });
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IConversionHistoryItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  const lpDateError =
    filters.lp_start_date && filters.lp_end_date
      ? filters.lp_start_date.getTime() > filters.lp_end_date.getTime()
      : false;

  const cvDateError =
    filters.cv_start_date && filters.cv_end_date
      ? filters.cv_start_date.getTime() > filters.cv_end_date.getTime()
      : false;

  // CV経路データ取得
  const {
    conversionHistories,
    conversionHistoriesLoading,
    conversionHistoriesEmpty,
  } = useGetConversionHistories();

  useEffect(() => {
    if (conversionHistories.length) {
      setTableData(conversionHistories);
    }
  }, [conversionHistories]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    lpDateError,
    cvDateError,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound =
    (!dataFiltered.length && canReset) || conversionHistoriesEmpty;

  const handleFilters = useCallback(
    (title: string, value: IConversionHistoryTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [title]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          />

          {canReset && (
            <ConversionHistoryTableFiltersResult
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
                  {conversionHistoriesLoading ? (
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
  lpDateError,
  cvDateError,
}: {
  inputData: IConversionHistoryItem[];
  comparator: (a: any, b: any) => number;
  filters: IConversionHistoryTableFilters;
  lpDateError: boolean;
  cvDateError: boolean;
}) {
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    lp_url,
    lp_start_date,
    lp_end_date,
    cv_url,
    cv_start_date,
    cv_end_date,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (utm_source) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.utm_source
          .toLowerCase()
          .indexOf(utm_source.toLowerCase()) !== -1
    );
  }

  if (utm_medium) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.utm_medium
          .toLowerCase()
          .indexOf(utm_medium.toLowerCase()) !== -1
    );
  }

  if (utm_campaign) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.utm_campaign
          .toLowerCase()
          .indexOf(utm_campaign.toLowerCase()) !== -1
    );
  }

  if (utm_term) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.utm_term
          .toLowerCase()
          .indexOf(utm_term.toLowerCase()) !== -1
    );
  }

  if (lp_url) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.lp_url.toLowerCase().indexOf(lp_url.toLowerCase()) !==
        -1
    );
  }

  if (!lpDateError) {
    if (lp_start_date) {
      inputData = inputData.filter(
        (conversionHistory) =>
          fTimestamp(conversionHistory.lp_date) >= fTimestamp(lp_start_date)
      );
    }
    if (lp_end_date) {
      inputData = inputData.filter(
        (conversionHistory) =>
          fTimestamp(conversionHistory.lp_date) <= fTimestamp(lp_end_date)
      );
    }
  }

  if (cv_url) {
    inputData = inputData.filter(
      (conversionHistory) =>
        conversionHistory.cv_url.toLowerCase().indexOf(cv_url.toLowerCase()) !==
        -1
    );
  }

  if (!cvDateError) {
    if (cv_start_date) {
      inputData = inputData.filter(
        (conversionHistory) =>
          fTimestamp(conversionHistory.cv_date) >= fTimestamp(cv_start_date)
      );
    }
    if (cv_end_date) {
      inputData = inputData.filter(
        (conversionHistory) =>
          fTimestamp(conversionHistory.cv_date) <= fTimestamp(cv_end_date)
      );
    }
  }

  return inputData;
}
