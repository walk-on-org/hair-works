"use client";

import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";
import { useBoolean } from "@/hooks/use-boolean";
import { useSearchJobs } from "@/api/job";
import { useGetJobCategories } from "@/api/job-category";
import { useGetPositions } from "@/api/position";
import { useGetEmployments } from "@/api/employment";

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

import { IJobItem, IJobTableFilters } from "@/types/job";

import JobTableRow from "../job-table-row";
import JobTableToolbar from "../job-table-toolbar";
import axios, { endpoints } from "@/utils/axios";
import { JOB_STATUS_OPTIONS } from "@/config-global";
import { EXPORT_CHAR_CODE_OPTIONS } from "@/config-global";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "求人ID", width: 160 },
  { id: "corporation_name", label: "法人", minWidth: 160 },
  { id: "office_name", label: "事業所", minWidth: 160 },
  { id: "name", label: "求人名", minWidth: 160 },
  { id: "job_category_name", label: "職種", width: 120, minWidth: 80 },
  { id: "position_name", label: "役職/役割", width: 120, minWidth: 80 },
  { id: "employment_name", label: "雇用形態", width: 120, minWidth: 80 },
  { id: "status", label: "状態", width: 120 },
  { id: "", width: 88 },
];

const defaultFilters: IJobTableFilters = {
  corporation_name: "",
  office_name: "",
  name: "",
  job_category: [],
  position: [],
  employment: [],
  status: [],
};

type Props = {
  corporationName: string;
  officeName: string;
  jobName: string;
  jobCategory: string[];
  position: string[];
  employment: string[];
  status: string[];
  page: number;
  limit: number;
  orderBy: string;
  order: "asc" | "desc";
};

// ----------------------------------------------------------------------

export default function JobListView({
  corporationName,
  officeName,
  jobName,
  jobCategory,
  position,
  employment,
  status,
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
  const exportCsv = useBoolean();
  const [exportCharCode, setExportCharCode] = useState(
    EXPORT_CHAR_CODE_OPTIONS[0].value
  );
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IJobItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const { jobCategories } = useGetJobCategories();
  const { positions } = useGetPositions();
  const { employments } = useGetEmployments();

  // パラメータより検索条件を設定
  let initFilters = defaultFilters;
  initFilters.corporation_name = corporationName || "";
  initFilters.office_name = officeName || "";
  initFilters.name = jobName || "";
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
  initFilters.status = JOB_STATUS_OPTIONS.filter((row) => {
    return status?.includes(row.value);
  }).map((row) => row.label);
  const [filters, setFilters] = useState(initFilters);

  // 求人データ取得
  const { jobs, jobsCount, jobsLoading, jobsEmpty } = useSearchJobs(
    filters.corporation_name,
    filters.office_name,
    filters.name,
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
    JOB_STATUS_OPTIONS.filter((row) => {
      return filters.status.includes(row.label);
    }).map((row) => row.value),
    limit,
    page,
    orderBy,
    order
  );

  useEffect(() => {
    setTableData(jobs);
  }, [jobs]);

  const denseHeight = table.dense ? 60 : 80;

  const notFound = !jobsLoading && jobsEmpty;

  // 検索
  const handleFilters = useCallback(
    (newFilters: IJobTableFilters) => {
      setFilters(newFilters);
      corporationName = newFilters.corporation_name;
      officeName = newFilters.office_name;
      jobName = newFilters.name;
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
      status = JOB_STATUS_OPTIONS.filter((row) => {
        return newFilters.status.includes(row.label);
      }).map((row) => row.value);
      router.push(createListUrl());
    },
    [router, jobCategories, positions, employments]
  );

  // 検索条件クリア
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    table.setPage(0);
    table.setOrder("desc");
    table.setOrderBy("id");
    router.push(paths.admin.job.root);
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
    let url = paths.admin.job.root;
    let params: {
      [prop: string]: any;
    } = {};
    if (corporationName) params.corporation_name = corporationName;
    if (officeName) params.office_name = officeName;
    if (jobName) params.job_name = jobName;
    if (jobCategory.length > 0) params.job_category_id = jobCategory;
    if (position.length > 0) params.position_id = position;
    if (employment.length > 0) params.employment_id = employment;
    if (status.length > 0) params.status = status;
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
        await axios.post(endpoints.job.destroy(id));

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
      await axios.post(endpoints.job.destroyMultiple, {
        ids: table.selected,
      });

      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRows: jobsCount,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      enqueueSnackbar("削除しました！");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [jobsCount, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.admin.job.detail(id));
    },
    [router]
  );

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
    if (jobName) params.job_name = jobName;
    if (jobCategory.length > 0) params.job_category_id = jobCategory;
    if (position.length > 0) params.position_id = position;
    if (employment.length > 0) params.employment_id = employment;
    if (status.length > 0) params.status = status;
    if (table.selected) params.job_ids = table.selected;
    params.char_code = exportCharCode;
    const urlSearchParam = new URLSearchParams(params).toString();
    let url = endpoints.job.downloadCsv;
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
  }, [
    exportCharCode,
    table,
    corporationName,
    officeName,
    jobName,
    jobCategory,
    position,
    employment,
    status,
  ]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="求人"
          links={[
            { name: "ダッシュボード", href: paths.admin.dashboard },
            {
              name: "求人",
              href: paths.admin.job.root,
            },
            { name: "一覧" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.job.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              求人を作成
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <JobTableToolbar
            filters={filters}
            onFilters={handleFilters}
            searchLoading={jobsLoading}
            onClearFilters={handleResetFilters}
            jobCategories={jobCategories}
            positions={positions}
            employments={employments}
            statusOptions={JOB_STATUS_OPTIONS}
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
              rowCount={jobsCount}
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
                  rowCount={jobsCount}
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
                  {jobsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <JobTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onCorporationViewRow={() =>
                            handleCorporationViewRow(row.corporation_id)
                          }
                          onOfficeViewRow={() =>
                            handleOfficeViewRow(row.office_id)
                          }
                          onDeleteRow={() => handleDeleteRow(row.id)}
                        />
                      ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(0, table.rowsPerPage, jobsCount)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={jobsCount}
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
            件の求人データを削除しますが、よろしいでしょうか?
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
                <strong> {table.selected.length || jobsCount} </strong>
                件の求人データを出力します。
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
