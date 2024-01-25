"use client";

import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
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
import { UploadBox } from "@/components/upload";
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
import JobImportProgress from "../job-import-progress";
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
    defaultSelected: [],
  });
  const confirm = useBoolean(); // 削除確認
  const exportCsv = useBoolean(); // エクスポート確認
  const importCsv = useBoolean(); // インポート確認
  const approvalRequestConfirm = useBoolean(); // 承認依頼確認
  const approvedConfirm = useBoolean(); // 承認済確認
  const publishConfirm = useBoolean(); // 掲載ON確認
  const stopConfirm = useBoolean(); // 掲載FF確認
  const copyConfirm = useBoolean(); // コピー確認
  const importErrorExport = useBoolean(); // インポートエラー確認
  const reload = useBoolean(); // 一覧リロード
  const [exportCharCode, setExportCharCode] = useState(
    EXPORT_CHAR_CODE_OPTIONS[0].value
  ); // エクスポート文字コード
  const [importFile, setImportFile] = useState<File | string>(); // インポートファイル
  const [importFileName, setImportFileName] = useState("");
  const [importProcessId, setImportProcessId] = useState<number | undefined>(
    undefined
  ); // インポート処理ID
  const [importInProcess, setImportInProcess] = useState<boolean>(false); // インポート処理中
  const [originJobId, setOriginJobId] = useState(""); // コピー元事業所ID

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
    order,
    reload.value
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

  // CSVインポートファイル選択
  const handleDropImportCsv = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setImportFileName(file.name);
        setImportFile(newFile);
      }
    },
    [importFile, importFileName]
  );

  // CSVインポート実行
  const handleImportCsv = useCallback(async () => {
    try {
      const res = await axios.post(
        endpoints.job.uploadCsv,
        {
          file: importFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImportProcessId(res.data.process_id);
      setImportInProcess(true);
      setImportFile(undefined);
      setImportFileName("");
      enqueueSnackbar("インポートを開始しました。");
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [importFile]);

  // CSVインポート終了
  const handleImportFinish = useCallback(
    (existsError: boolean) => {
      setImportInProcess(false);
      reload.onToggle();
      if (existsError) {
        importErrorExport.onTrue();
      } else {
        enqueueSnackbar("インポートを終了しました。");
      }
    },
    [reload, importErrorExport]
  );

  // インポートエラー結果CSVダウンロード
  const handleExportErrorCsv = useCallback(() => {
    try {
      axios
        .get(
          endpoints.processManagement.errorDownload(
            importProcessId == undefined ? "" : String(importProcessId)
          ),
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const blob = new Blob([res.data], { type: res.data.type });
          const filename = decodeURI(
            res.headers["content-disposition"]
          ).substring(
            res.headers["content-disposition"].indexOf("=") + 1,
            res.headers["content-disposition"].length
          );
          saveAs(blob, filename);
          enqueueSnackbar("エラー結果をエクスポートしました！");
        });
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.error(error);
    }
  }, [importProcessId]);

  // 一括承認依頼
  const handleApprovalRequestRows = useCallback(async () => {
    try {
      await axios.post(endpoints.job.approvalRequestMultiple, {
        ids: table.selected,
      });

      enqueueSnackbar("求人を承認待ちに変更しました。");
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [table, reload]);

  // 一括承認
  const handleApprovedRows = useCallback(async () => {
    try {
      await axios.post(endpoints.job.approvedMultiple, {
        ids: table.selected,
      });

      enqueueSnackbar("求人を承認しました。");
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [table, reload]);

  // 一括掲載ON
  const handlePublishRows = useCallback(async () => {
    try {
      const res = await axios.post(endpoints.job.publishMultiple, {
        ids: table.selected,
      });

      if (res.data.message) {
        enqueueSnackbar(res.data.message, {
          variant: "error",
          persist: true,
        });
      } else {
        enqueueSnackbar("選択した求人を掲載中に変更しました。");
      }
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [table, reload]);

  // 一括掲載OFF
  const handleStopRows = useCallback(async () => {
    try {
      await axios.post(endpoints.job.stopMultiple, {
        ids: table.selected,
      });

      enqueueSnackbar("掲載中の求人を掲載停止に変更しました。");
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [table, reload]);

  // コピー元求人ID変更
  const handleChangeOriginJobId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOriginJobId(event.target.value);
  };
  // 求人コピー
  const handleCopyRows = useCallback(async () => {
    try {
      const res = await axios.post(endpoints.job.copyMultiple(originJobId), {
        ids: table.selected,
      });

      if (res.data.message) {
        enqueueSnackbar(res.data.message, {
          variant: "error",
          persist: true,
        });
      } else {
        enqueueSnackbar("求人情報をコピーしました。");
      }
      table.onSelectAllRows(false, []);
      reload.onToggle();
    } catch (error) {
      enqueueSnackbar("エラーが発生しました。", { variant: "error" });
      console.log(error);
    }
  }, [originJobId, table, reload]);

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

          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ p: 2 }}
            gap={1}
          >
            <Button
              onClick={exportCsv.onTrue}
              variant="outlined"
              startIcon={<Iconify icon="ph:export-bold" />}
            >
              エクスポート
            </Button>

            {!importInProcess && (
              <Button
                onClick={importCsv.onTrue}
                variant="outlined"
                startIcon={<Iconify icon="solar:import-bold" />}
              >
                インポート
              </Button>
            )}
          </Stack>

          {importInProcess && (
            <JobImportProgress
              processId={
                importProcessId == undefined ? "" : String(importProcessId)
              }
              onFinish={handleImportFinish}
            />
          )}

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
                <Stack direction="row" gap={1}>
                  <Tooltip title="一括掲載ON">
                    <Button color="primary" onClick={publishConfirm.onTrue}>
                      一括掲載ON
                    </Button>
                  </Tooltip>
                  <Tooltip title="一括掲載ON">
                    <Button color="primary" onClick={stopConfirm.onTrue}>
                      一括掲載OFF
                    </Button>
                  </Tooltip>
                  <Tooltip title="一括承認依頼">
                    <Button
                      color="primary"
                      onClick={approvalRequestConfirm.onTrue}
                    >
                      一括承認依頼
                    </Button>
                  </Tooltip>
                  <Tooltip title="一括承認">
                    <Button color="primary" onClick={approvedConfirm.onTrue}>
                      一括承認
                    </Button>
                  </Tooltip>
                  <Tooltip title="求人コピー">
                    <Button color="primary" onClick={copyConfirm.onTrue}>
                      求人コピー
                    </Button>
                  </Tooltip>
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

      <ConfirmDialog
        open={importCsv.value}
        onClose={importCsv.onFalse}
        title="インポート"
        content={
          <>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <Typography>
                インポートするファイルを選択してください。
              </Typography>

              {importFileName && <Typography>{importFileName}</Typography>}

              <UploadBox
                accept={{ "text/csv": [] }}
                onDrop={handleDropImportCsv}
                placeholder={
                  <Stack
                    spacing={0.5}
                    alignItems="center"
                    sx={{ color: "text.disabled" }}
                  >
                    <Iconify icon="eva:cloud-upload-fill" width={40} />
                    <Typography variant="body2">ファイルを選択</Typography>
                  </Stack>
                }
                sx={{
                  mb: 3,
                  py: 2.5,
                  width: "auto",
                  height: "auto",
                  borderRadius: 1.5,
                }}
              />
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleImportCsv();
              importCsv.onFalse();
            }}
          >
            インポート
          </Button>
        }
      />

      <ConfirmDialog
        open={importErrorExport.value}
        onClose={importErrorExport.onFalse}
        title="インポート結果エラー"
        content={
          <>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <Typography>
                インポートしたファイルにエラーが存在しました。
                ファイルの中身を確認して、エラーになった行のみを再度インポートしてください。
              </Typography>
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleExportErrorCsv();
              importErrorExport.onFalse();
            }}
          >
            確認
          </Button>
        }
      />

      <ConfirmDialog
        open={approvalRequestConfirm.value}
        onClose={approvalRequestConfirm.onFalse}
        title="一括承認依頼"
        content={
          <>
            <strong> {table.selected.length} </strong>
            件の求人データを一括承認依頼しますが、よろしいでしょうか?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleApprovalRequestRows();
              approvalRequestConfirm.onFalse();
            }}
          >
            一括承認依頼
          </Button>
        }
      />

      <ConfirmDialog
        open={approvedConfirm.value}
        onClose={approvedConfirm.onFalse}
        title="一括承認済"
        content={
          <>
            <strong> {table.selected.length} </strong>
            件の求人データを一括承認済しますが、よろしいでしょうか?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleApprovedRows();
              approvedConfirm.onFalse();
            }}
          >
            一括承認済
          </Button>
        }
      />

      <ConfirmDialog
        open={publishConfirm.value}
        onClose={publishConfirm.onFalse}
        title="一括掲載ON"
        content={
          <>
            <strong> {table.selected.length} </strong>
            件の求人データを一括掲載ONしますが、よろしいでしょうか?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handlePublishRows();
              publishConfirm.onFalse();
            }}
          >
            一括掲載ON
          </Button>
        }
      />

      <ConfirmDialog
        open={stopConfirm.value}
        onClose={stopConfirm.onFalse}
        title="一括掲載OFF"
        content={
          <>
            <strong> {table.selected.length} </strong>
            件の求人データを一括掲載OFFしますが、よろしいでしょうか?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleStopRows();
              stopConfirm.onFalse();
            }}
          >
            一括掲載OFF
          </Button>
        }
      />

      <ConfirmDialog
        open={copyConfirm.value}
        onClose={copyConfirm.onFalse}
        title="求人コピー"
        content={
          <>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <Typography>
                <strong> {table.selected.length} </strong>
                件の求人に以下で入力した求人の情報をコピーします。
              </Typography>

              <TextField
                fullWidth
                label="コピー元求人ID"
                value={originJobId}
                onChange={handleChangeOriginJobId}
                placeholder="求人IDを入力"
              />
            </Stack>
          </>
        }
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleCopyRows();
              copyConfirm.onFalse();
            }}
          >
            コピー
          </Button>
        }
      />
    </>
  );
}
