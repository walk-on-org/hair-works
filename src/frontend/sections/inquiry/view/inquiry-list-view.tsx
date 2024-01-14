"use client";

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
import { useSearchInquiries } from "@/api/inquiry";

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

import { IInquiryItem, IInquiryTableFilters } from "@/types/inquiry";

import InquiryTableRow from "../inquiry-table-row";
import InquiryTableToolbar from "../inquiry-table-toolbar";
import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "問い合わせID", width: 160 },
  { id: "salon_name", label: "サロン名/法人名", minWidth: 120 },
  { id: "name", label: "お名前", width: 160, minWidth: 120 },
  { id: "tel", label: "電話番号", width: 120, minWidth: 80 },
  { id: "mail", label: "メールアドレス", width: 120, minWidth: 80 },
  {
    id: "prefecture_name",
    label: "サロン所在地（都道府県）",
    width: 120,
    minWidth: 80,
  },
  { id: "inquiry_type", label: "問い合わせ内容", width: 120, minWidth: 80 },
  { id: "status", label: "状態", width: 120, minWidth: 80 },
  { id: "created_at", label: "登録日時", width: 120, minWidth: 80 },
  { id: "utm_source", label: "登録経路", width: 120, minWidth: 80 },
  { id: "", width: 88 },
];

const defaultFilters: IInquiryTableFilters = {
  salon_name: "",
  name: "",
};

type Props = {
  salonName: string;
  name: string;
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function InquiryListView({
  salonName,
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
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IInquiryItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // パラメータより検索条件を指定
  let initFilters = defaultFilters;
  initFilters.salon_name = salonName || "";
  initFilters.name = name || "";
  const [filters, setFilters] = useState(initFilters);

  // 問い合わせデータ取得
  const { inquiries, inquiriesCount, inquiriesLoading, inquiriesEmpty } =
    useSearchInquiries(
      filters.salon_name,
      filters.name,
      limit,
      page,
      orderBy,
      order
    );

  useEffect(() => {
    setTableData(inquiries);
  }, [inquiries]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !inquiriesLoading && inquiriesEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IInquiryTableFilters) => {
      setFilters(newFilters);
      salonName = newFilters.salon_name;
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
    router.push(paths.admin.inquiry.root);
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
    let url = paths.admin.inquiry.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (salonName) params.salon_name = salonName;
    if (name) params.name = name;
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
        await axios.post(endpoints.inquiry.destroy(id));

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
      await axios.post(endpoints.inquiry.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: inquiriesCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [inquiriesCount, table, tableData]);

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
          <InquiryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={inquiriesLoading}
            onClearFilters={handleResetFilters}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={inquiriesCount}
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
                  rowCount={inquiriesCount}
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
                  {inquiriesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
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
            count={inquiriesCount}
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
