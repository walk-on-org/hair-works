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
import { useGetAdKeywords } from "@/api/ad-keyword";

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
  IAdKeywordItem,
  IAdKeywordTableFilters,
  IAdKeywordTableFilterValue,
} from "@/types/ad-keyword";

import AdKeywordTableRow from "../ad-keyword-table-row";
import AdKeywordTableToolbar from "../ad-keyword-table-toolbar";
import AdKeywordTableFiltersResult from "../ad-keyword-table-filters-result";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "ID", width: 80 },
  { id: "utm_source", label: "参照元", width: 120 },
  { id: "utm_medium", label: "メディア", width: 120 },
  { id: "utm_campaign", label: "キャンペーン", width: 120 },
  { id: "keyword_id", label: "キーワードID", width: 160 },
  { id: "ad_group", label: "広告グループ", width: 120 },
  { id: "keyword", label: "キーワード" },
  { id: "match_type", label: "マッチ種別", width: 120 },
  { id: "", width: 88 },
];

const defaultFilters: IAdKeywordTableFilters = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  keywordId: "",
  adGroup: "",
  keyword: "",
};

// ----------------------------------------------------------------------

export default function AdKeywordListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IAdKeywordItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();

  // 広告キーワードデータ取得
  const { adKeywords, adKeywordsLoading, adKeywordsEmpty } = useGetAdKeywords();

  useEffect(() => {
    if (adKeywords.length) {
      setTableData(adKeywords);
    }
  }, [adKeywords]);

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

  const notFound = (!dataFiltered.length && canReset) || adKeywordsEmpty;

  const handleFilters = useCallback(
    (name: string, value: IAdKeywordTableFilterValue) => {
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
        await axios.post(endpoints.adKeyword.destroy(id));

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
      await axios.post(endpoints.adKeyword.destroyMultiple, {
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
      router.push(paths.admin.adKeyword.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.adKeyword.detail(id));
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
          heading="広告キーワードマスタ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "広告キーワードマスタ",
              href: paths.admin.adKeyword.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.adKeyword.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              広告キーワードマスタを作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <AdKeywordTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <AdKeywordTableFiltersResult
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
                  {adKeywordsLoading ? (
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
                          <AdKeywordTableRow
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
            件の広告キーワードデータを削除しますが、よろしいでしょうか?
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
  inputData: IAdKeywordItem[];
  comparator: (a: any, b: any) => number;
  filters: IAdKeywordTableFilters;
}) {
  const { utmSource, utmMedium, utmCampaign, keywordId, adGroup, keyword } =
    filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (utmSource) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.utm_source.toLowerCase().indexOf(utmSource.toLowerCase()) !==
        -1
    );
  }

  if (utmMedium) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.utm_medium.toLowerCase().indexOf(utmMedium.toLowerCase()) !==
        -1
    );
  }

  if (utmCampaign) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.utm_campaign
          .toLowerCase()
          .indexOf(utmCampaign.toLowerCase()) !== -1
    );
  }

  if (keywordId) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.keyword_id.toLowerCase().indexOf(keywordId.toLowerCase()) !==
        -1
    );
  }

  if (adGroup) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.ad_group.toLowerCase().indexOf(adGroup.toLowerCase()) !== -1
    );
  }

  if (keyword) {
    inputData = inputData.filter(
      (adKeyword) =>
        adKeyword.keyword.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    );
  }

  return inputData;
}
