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
import { useGetMembers } from "@/api/member";
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
  getComparator,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";
import { useSnackbar } from "@/components/snackbar";

import {
  IMemberItem,
  IMemberTableFilters,
  IMemberTableFilterValue,
} from "@/types/member";

import MemberTableRow from "../member-table-row";
import MemberTableToolbar from "../member-table-toolbar";
import MemberTableFiltersResult from "../member-table-filters-result";
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
  { id: "email", label: "メールアドレス", width: 120 },
  { id: "phone", label: "電話番号", width: 120 },
  { id: "change_time", label: "希望転職時期", width: 120 },
  { id: "employment", label: "希望勤務体系", width: 120 },
  { id: "emp_prefecture", label: "希望勤務地", width: 120 },
  { id: "status", label: "状態", width: 120 },
  { id: "applicant_count", label: "応募数", width: 80 },
  { id: "register_site", label: "登録サイト", width: 120 },
  { id: "register_form", label: "登録フォーム", width: 120 },
  { id: "register_route", label: "登録経路", width: 120 },
  { id: "job", label: "登録経緯求人", width: 160 },
  { id: "proposal_datetimes", label: "連絡可能日時", width: 160 },
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

// ----------------------------------------------------------------------

export default function MemberListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: "id" });
  const confirm = useBoolean();
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IMemberItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();

  // 求人データ取得
  const { members, membersLoading, membersEmpty } = useGetMembers();
  const { prefectures } = useGetPrefectures();

  useEffect(() => {
    if (members.length) {
      setTableData(members);
    }
  }, [members]);

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

  const notFound = (!dataFiltered.length && canReset) || membersEmpty;

  const handleFilters = useCallback(
    (name: string, value: IMemberTableFilterValue) => {
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
        await axios.post(endpoints.member.destroy(id));

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
      await axios.post(endpoints.member.destroyMultiple, {
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="求人"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "求人",
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
            prefectures={prefectures}
            registerSiteOptions={REGISTER_SITE_OPTIONS}
            registerFormOptions={REGISTER_FORM_OPTIONS}
            introductionGiftStatusOptions={INTRODUCTION_GIFT_STATUS_OPTIONS}
          />

          {canReset && (
            <MemberTableFiltersResult
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
                  {membersLoading ? (
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

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IMemberItem[];
  comparator: (a: any, b: any) => number;
  filters: IMemberTableFilters;
}) {
  const {
    name,
    email,
    phone,
    emp_prefecture,
    register_site,
    register_form,
    introduction_gift_status,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (member) => member.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (email) {
    inputData = inputData.filter(
      (member) => member.email.toLowerCase().indexOf(email.toLowerCase()) !== -1
    );
  }

  if (phone) {
    inputData = inputData.filter(
      (member) => member.phone.toLowerCase().indexOf(phone.toLowerCase()) !== -1
    );
  }

  if (emp_prefecture.length) {
    inputData = inputData.filter((member) =>
      emp_prefecture.includes(member.emp_prefecture_name)
    );
  }

  if (register_site.length) {
    inputData = inputData.filter((member) =>
      register_site.includes(member.register_site_name)
    );
  }

  if (register_form.length) {
    inputData = inputData.filter((member) =>
      register_form.includes(member.register_form_name)
    );
  }

  if (introduction_gift_status.length) {
    inputData = inputData.filter((member) =>
      introduction_gift_status.includes(member.introduction_gift_status_name)
    );
  }

  return inputData;
}
