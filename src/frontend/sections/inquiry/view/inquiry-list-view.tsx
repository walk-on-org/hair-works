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
import { useBoolean } from "@/hooks/use-boolean";
import { useGetInquiries } from "@/api/inquiry";

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
  IInquiryItem,
  IInquiryTableFilters,
  IInquiryTableFilterValue,
} from "@/types/inquiry";

import InquiryTableRow from "../inquiry-table-row";
import InquiryTableToolbar from "../inquiry-table-toolbar";
import InquiryTableFiltersResult from "../inquiry-table-filters-result";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "問い合わせID", width: 160 },
  { id: "salon_name", label: "サロン名/法人名" },
  { id: "name", label: "お名前", width: 160 },
  { id: "tel", label: "電話番号", width: 120 },
  { id: "mail", label: "メールアドレス", width: 120 },
  { id: "prefecture", label: "サロン所在地（都道府県）", width: 120 },
  { id: "inquiry_type", label: "問い合わせ内容", width: 120 },
  { id: "status", label: "状態", width: 120 },
  { id: "inquiry_date", label: "登録日時", width: 120 },
  { id: "register_route", label: "登録経路", width: 120 },
  { id: "", width: 88 },
];

const defaultFilters: IInquiryTableFilters = {
  salon_name: "",
  name: "",
};

// ----------------------------------------------------------------------

export default function InquiryListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IInquiryItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();

  // 問い合わせデータ取得
  const { inquiries, inquiriesLoading, inquiriesEmpty } = useGetInquiries();

  useEffect(() => {
    if (inquiries.length) {
      setTableData(inquiries);
    }
  }, [inquiries]);

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

  const notFound = (!dataFiltered.length && canReset) || inquiriesEmpty;

  const handleFilters = useCallback(
    (name: string, value: IInquiryTableFilterValue) => {
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
        await axios.post(endpoints.inquiry.destroy(id));

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
      await axios.post(endpoints.inquiry.destroyMultiple, {
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
      router.push(paths.admin.inquiry.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.inquiry.detail(id));
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
          heading="問い合わせ"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "問い合わせ",
              href: paths.admin.inquiry.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <InquiryTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <InquiryTableFiltersResult
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
                  {inquiriesLoading ? (
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
                          <InquiryTableRow
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
            件の問い合わせデータを削除しますが、よろしいでしょうか?
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
  inputData: IInquiryItem[];
  comparator: (a: any, b: any) => number;
  filters: IInquiryTableFilters;
}) {
  const { salon_name, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (salon_name) {
    inputData = inputData.filter(
      (inquiry) =>
        inquiry.salon_name.toLowerCase().indexOf(salon_name.toLowerCase()) !==
        -1
    );
  }

  if (name) {
    inputData = inputData.filter(
      (inquiry) => inquiry.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
