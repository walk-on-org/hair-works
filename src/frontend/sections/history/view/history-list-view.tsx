"use client";

import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { useSearchHistories } from "@/api/history";
import { useGetJobCategories } from "@/api/job-category";
import { useGetPositions } from "@/api/position";
import { useGetEmployments } from "@/api/employment";

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

import { IHistoryItem, IHistoryTableFilters } from "@/types/history";

import HistoryTableRow from "../history-table-row";
import HistoryTableToolbar from "../history-table-toolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "閲覧履歴ID", width: 120 },
  { id: "member_name", label: "会員", width: 140, minWidth: 100 },
  { id: "corporation_name", label: "法人", width: 160, minWidth: 120 },
  { id: "office_name", label: "事業所", width: 160, minWidth: 120 },
  { id: "job_name", label: "求人", width: 160, minWidth: 120 },
  { id: "job_category_name", label: "職種", width: 120, minWidth: 80 },
  { id: "position_name", label: "役職/役割", width: 120, minWidth: 80 },
  { id: "employment_name", label: "雇用形態", width: 120, minWidth: 80 },
  { id: "viewed_at", label: "閲覧日時", width: 140, minWidth: 120 },
];

const defaultFilters: IHistoryTableFilters = {
  corporation_name: "",
  office_name: "",
  job_name: "",
  job_category: [],
  position: [],
  employment: [],
};

type Props = {
  corporationName: string;
  officeName: string;
  jobName: string;
  jobCategory: string[];
  position: string[];
  employment: string[];
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function HistoryListView({
  corporationName,
  officeName,
  jobName,
  jobCategory,
  position,
  employment,
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
  const [tableData, setTableData] = useState<IHistoryItem[]>([]);

  const { jobCategories } = useGetJobCategories();
  const { positions } = useGetPositions();
  const { employments } = useGetEmployments();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.corporation_name = corporationName || "";
  initFilters.office_name = officeName || "";
  initFilters.job_name = jobName || "";
  initFilters.job_category = jobCategories
    .filter((row) => {
      return jobCategory?.includes(row.name);
    })
    .map((row) => row.id);
  initFilters.position = positions
    .filter((row) => {
      return position?.includes(row.name);
    })
    .map((row) => row.id);
  initFilters.employment = employments
    .filter((row) => {
      return employment?.includes(row.name);
    })
    .map((row) => row.id);
  const [filters, setFilters] = useState(initFilters);

  // 閲覧履歴データ取得
  const { histories, historiesCount, historiesLoading, historiesEmpty } =
    useSearchHistories(
      filters.corporation_name,
      filters.office_name,
      filters.job_name,
      jobCategories
        .filter((row) => {
          return filters.job_category.includes(row.name);
        })
        .map((row) => row.id),
      positions
        .filter((row) => {
          return filters.position.includes(row.name);
        })
        .map((row) => row.id),
      employments
        .filter((row) => {
          return filters.employment.includes(row.name);
        })
        .map((row) => row.id),
      limit,
      page,
      orderBy,
      order
    );

  useEffect(() => {
    setTableData(histories);
  }, [histories]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !historiesLoading && historiesEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IHistoryTableFilters) => {
      setFilters(newFilters);
      corporationName = newFilters.corporation_name;
      officeName = newFilters.office_name;
      jobName = newFilters.job_name;
      jobCategory = jobCategories
        .filter((row) => {
          return newFilters.job_category.includes(row.name);
        })
        .map((row) => row.id);
      position = positions
        .filter((row) => {
          return newFilters.position.includes(row.name);
        })
        .map((row) => row.id);
      employment = employments
        .filter((row) => {
          return newFilters.employment.includes(row.name);
        })
        .map((row) => row.id);
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
    router.push(paths.admin.history.root);
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
    let url = paths.admin.history.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (officeName) params.office_name = officeName;
    if (jobName) params.job_name = jobName;
    if (jobCategory.length > 0) params.job_category_id = jobCategory;
    if (position.length > 0) params.position_id = position;
    if (employment.length > 0) params.employment_id = employment;
    if (page > 1) params.page = page;
    params.limit = limit;
    params.order = order == "asc" ? "asc" : "desc";
    params.orderBy = orderBy;
    const urlSearchParam = new URLSearchParams(params).toString();
    if (urlSearchParam) url += "?" + urlSearchParam;
    return url;
  };

  const handleCorporationViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.corporation.detail(id));
    },
    [router]
  );

  const handleOfficeViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.office.detail(id));
    },
    [router]
  );

  const handleJobViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
    },
    [router]
  );

  const handleMemberViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.member.detail(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="閲覧履歴"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "閲覧履歴",
              href: paths.admin.history.root,
            },
            { name: "一覧" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <HistoryTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={historiesLoading}
            onClearFilters={handleResetFilters}
            jobCategories={jobCategories}
            positions={positions}
            employments={employments}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={historiesCount}
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
                  rowCount={historiesCount}
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
                  {historiesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <HistoryTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onCorporationViewRow={() =>
                            handleCorporationViewRow(row.corporation_id)
                          }
                          onOfficeViewRow={() =>
                            handleOfficeViewRow(row.office_id)
                          }
                          onJobViewRow={() => handleJobViewRow(row.job_id)}
                          onMemberViewRow={() =>
                            handleMemberViewRow(row.member_id)
                          }
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, historiesCount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={historiesCount}
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
