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
import { useBoolean } from "@/hooks/use-boolean";
import { useSearchMembers } from "@/api/member";
import { useGetPrefectures } from "@/api/prefecture";

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

import { IMemberItem, IMemberTableFilters } from "@/types/member";

import MemberTableRow from "../member-table-row";
import MemberTableToolbar from "../member-table-toolbar";
import axios, { endpoints } from "@/utils/axios";
import {
  REGISTER_SITE_OPTIONS,
  REGISTER_FORM_OPTIONS,
  INTRODUCTION_GIFT_STATUS_OPTIONS,
} from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "会員ID", width: 160 },
  { id: "name", label: "氏名" },
  { id: "email", label: "メールアドレス", width: 120, minWidth: 80 },
  { id: "phone", label: "電話番号", width: 120, minWidth: 80 },
  { id: "change_time", label: "希望転職時期", width: 120, minWidth: 80 },
  { id: "employment_name", label: "希望勤務体系", width: 120, minWidth: 80 },
  { id: "emp_prefecture_name", label: "希望勤務地", width: 120, minWidth: 80 },
  { id: "status", label: "状態", width: 120 },
  { id: "applicant_count", label: "応募数", width: 80 },
  { id: "register_site", label: "登録サイト", width: 120, minWidth: 80 },
  { id: "register_form", label: "登録フォーム", width: 120, minWidth: 80 },
  { id: "utm_source", label: "登録経路", width: 120, minWidth: 80 },
  { id: "job_name", label: "登録経緯求人", width: 160 },
  { id: "", width: 88 },
];

const defaultFilters: IMemberTableFilters = {
  name: "",
  phone: "",
  email: "",
  emp_prefecture: [],
  register_site: [],
  register_form: [],
  // TODO 登録経路
  introduction_gift_status: [],
};

type Props = {
  name: string;
  email: string;
  phone: string;
  empPrefecture: string[];
  registerSite: string[];
  registerForm: string[];
  introductionGiftStatus: string[];
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function MemberListView({
  name,
  email,
  phone,
  empPrefecture,
  registerSite,
  registerForm,
  introductionGiftStatus,
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
  const [tableData, setTableData] = useState<IMemberItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const { prefectures } = useGetPrefectures();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.name = name || "";
  initFilters.email = email || "";
  initFilters.phone = phone || "";
  initFilters.emp_prefecture = prefectures
    .filter((row) => {
      return empPrefecture?.includes(row.name);
    })
    .map((row) => row.id);
  initFilters.register_site = REGISTER_SITE_OPTIONS.filter((row) => {
    return registerSite?.includes(row.value);
  }).map((row) => row.label);
  initFilters.register_form = REGISTER_FORM_OPTIONS.filter((row) => {
    return registerForm?.includes(row.value);
  }).map((row) => row.label);
  initFilters.introduction_gift_status =
    INTRODUCTION_GIFT_STATUS_OPTIONS.filter((row) => {
      return introductionGiftStatus?.includes(row.value);
    }).map((row) => row.label);
  const [filters, setFilters] = useState(initFilters);

  // 会員情報データ取得
  const { members, membersCount, membersLoading, membersEmpty } =
    useSearchMembers(
      filters.name,
      filters.email,
      filters.phone,
      prefectures
        .filter((row) => {
          return filters.emp_prefecture.includes(row.name);
        })
        .map((row) => row.id),
      REGISTER_SITE_OPTIONS.filter((row) => {
        return filters.register_site.includes(row.label);
      }).map((row) => row.value),
      REGISTER_FORM_OPTIONS.filter((row) => {
        return filters.register_form.includes(row.label);
      }).map((row) => row.value),
      INTRODUCTION_GIFT_STATUS_OPTIONS.filter((row) => {
        return filters.introduction_gift_status.includes(row.label);
      }).map((row) => row.value),
      limit,
      page,
      orderBy,
      order
    );

  useEffect(() => {
    setTableData(members);
  }, [members]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !membersLoading && membersEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IMemberTableFilters) => {
      setFilters(newFilters);
      name = newFilters.name;
      email = newFilters.email;
      phone = newFilters.phone;
      empPrefecture = prefectures
        .filter((row) => {
          return newFilters.emp_prefecture.includes(row.name);
        })
        .map((row) => row.id);
      registerSite = REGISTER_SITE_OPTIONS.filter((row) => {
        return newFilters.register_site.includes(row.label);
      }).map((row) => row.value);
      registerForm = REGISTER_FORM_OPTIONS.filter((row) => {
        return newFilters.register_form.includes(row.label);
      }).map((row) => row.value);
      introductionGiftStatus = INTRODUCTION_GIFT_STATUS_OPTIONS.filter(
        (row) => {
          return newFilters.introduction_gift_status.includes(row.label);
        }
      ).map((row) => row.value);
      router.push(createListUrl());
    },
    [router, prefectures]
  );

  // 検索条件クリア
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    table.setPage(0);
    table.setOrder("desc");
    table.setOrderBy("id");
    router.push(paths.admin.member.root);
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
    let url = paths.admin.member.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (name) params.name = name;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (empPrefecture.length > 0) params.emp_prefecture_id = empPrefecture;
    if (registerSite.length > 0) params.register_site = registerSite;
    if (registerForm.length > 0) params.register_form = registerForm;
    if (introductionGiftStatus.length > 0)
      params.introduction_gift_status = introductionGiftStatus;
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
        await axios.post(endpoints.member.destroy(id));

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
      await axios.post(endpoints.member.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: membersCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [membersCount, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.member.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.member.detail(id));
    },
    [router]
  );

  const handleJobViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="会員情報"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "会員情報",
              href: paths.admin.member.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <MemberTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={membersLoading}
            onClearFilters={handleResetFilters}
            prefectures={prefectures}
            registerSiteOptions={REGISTER_SITE_OPTIONS}
            registerFormOptions={REGISTER_FORM_OPTIONS}
            introductionGiftStatusOptions={INTRODUCTION_GIFT_STATUS_OPTIONS}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={membersCount}
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
                  rowCount={membersCount}
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
                  {membersLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <MemberTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onJobViewRow={() => handleJobViewRow(row.job_id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, membersCount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={membersCount}
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
            件の会員データを削除しますが、よろしいでしょうか?
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
