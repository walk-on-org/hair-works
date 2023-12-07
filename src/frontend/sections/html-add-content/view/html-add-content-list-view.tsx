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

import { useGetHtmlAddContents } from "@/api/html-add-content";
import { useGetPrefectures } from "@/api/prefecture";

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
  IHtmlAddContentItem,
  IHtmlAddContentTableFilters,
  IHtmlAddContentTableFilterValue,
} from "@/types/html-add-content";

import HtmlAddContentTableRow from "../html-add-content-table-row";
import HtmlAddContentTableToolbar from "../html-add-content-table-toolbar";
import HtmlAddContentTableFiltersResult from "../html-add-content-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "コンテンツID", width: 160 },
  { id: "prefecture", label: "都道府県", width: 120 },
  { id: "government_city", label: "政令指定都市", width: 120 },
  { id: "city", label: "市区町村", width: 120 },
  { id: "station", label: "駅", width: 120 },
  { id: "display_average_salary", label: "平均給与表示フラグ", width: 110 },
  { id: "display_feature", label: "特徴表示フラグ", width: 110 },
  { id: "", width: 88 },
];

const defaultFilters: IHtmlAddContentTableFilters = {
  prefecture: [],
};

// ----------------------------------------------------------------------

export default function HtmlAddContentListView() {
  const router = useRouter();
  const table = useTable();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IHtmlAddContentItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);

  // HTML追加コンテンツデータ取得
  const { htmlAddContents, htmlAddContentsLoading, htmlAddContentsEmpty } =
    useGetHtmlAddContents();
  const { prefectures } = useGetPrefectures();

  useEffect(() => {
    if (htmlAddContents.length) {
      setTableData(htmlAddContents);
    }
  }, [htmlAddContents]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || htmlAddContentsEmpty;

  const handleFilters = useCallback(
    (name: string, value: IHtmlAddContentTableFilterValue) => {
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
      router.push(paths.admin.htmlAddContent.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.htmlAddContent.detail(id));
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
          heading="HTML追加コンテンツ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "HTML追加コンテンツ",
              href: paths.admin.htmlAddContent.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.htmlAddContent.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              HTML追加コンテンツを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <HtmlAddContentTableToolbar
            filters={filters}
            onFilters={handleFilters}
            prefectures={prefectures}
          />

          {canReset && (
            <HtmlAddContentTableFiltersResult
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
                  {htmlAddContentsLoading ? (
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
                          <HtmlAddContentTableRow
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
  inputData: IHtmlAddContentItem[];
  comparator: (a: any, b: any) => number;
  filters: IHtmlAddContentTableFilters;
}) {
  const { prefecture } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (prefecture.length) {
    inputData = inputData.filter((htmlAddContent) =>
      prefecture.includes(htmlAddContent.prefecture_name)
    );
  }

  return inputData;
}
