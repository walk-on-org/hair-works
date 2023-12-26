import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";

import { useBoolean } from "@/hooks/use-boolean";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";

import { IMailmagazineConfigItem } from "@/types/mailmagazine-config";

// ----------------------------------------------------------------------

type Props = {
  row: IMailmagazineConfigItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function MailmagazineConfigTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    title,
    deliver_job_type_name,
    job_keyword,
    job_match_distance,
    job_count_limit,
    job_match_lp_job_category,
    job_match_employment,
    search_other_corporation,
    mailmagazine_m_areas,
    m_emp_prefecture_names,
    m_lp_job_category_names,
    m_employment_names,
    m_qualification_names,
    m_status_names,
    m_change_time_names,
    member_birthyear_from,
    member_birthyear_to,
    j_corporation_names,
    j_job_category_names,
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();

  let memberCondition = "";
  if (mailmagazine_m_areas) {
    memberCondition += `【住所】${mailmagazine_m_areas
      .map((row) => {
        return row.prefecture_name + row.city_name;
      })
      .join("、")}\n`;
  }
  if (m_emp_prefecture_names)
    memberCondition += `【希望勤務地】${m_emp_prefecture_names.join("、")}\n`;
  if (m_lp_job_category_names)
    memberCondition += `【希望職種】${m_lp_job_category_names.join("、")}\n`;
  if (m_employment_names)
    memberCondition += `【希望勤務体系】${m_employment_names.join("、")}\n`;
  if (m_qualification_names)
    memberCondition += `【保有資格】${m_qualification_names.join("、")}\n`;
  if (m_status_names)
    memberCondition += `【ステータス】${m_status_names.join("、")}\n`;
  if (m_change_time_names)
    memberCondition += `【希望転職時期】${m_change_time_names.join("、")}\n`;
  if (member_birthyear_from || member_birthyear_to) {
    memberCondition += "【生まれ年】";
    if (member_birthyear_from) memberCondition += `${member_birthyear_from}年`;
    memberCondition += "〜";
    if (member_birthyear_to) memberCondition += `${member_birthyear_to}年`;
  }

  let jobCondition = "";
  if (j_corporation_names)
    jobCondition += `【法人】${j_corporation_names.join("、")}\n`;
  if (job_keyword) jobCondition += `【キーワード】${job_keyword}\n`;
  if (j_job_category_names)
    jobCondition += `【職種】${j_job_category_names.join("、")}\n`;
  if (job_match_lp_job_category) jobCondition += "【役職/役割】求職者と同じ\n";
  if (job_match_employment) jobCondition += "【雇用形態】求職者と同じ\n";
  if (search_other_corporation)
    jobCondition += "【検索】１つ目の求人以外は他企業から検索\n";

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{title}</TableCell>

        <TableCell>{deliver_job_type_name}</TableCell>

        <TableCell>{job_match_distance}</TableCell>

        <TableCell>{job_count_limit}</TableCell>

        <TableCell>{memberCondition}</TableCell>

        <TableCell>{jobCondition}</TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          詳細
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          編集
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          削除
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="削除"
        content="削除してよろしいでしょうか?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            削除
          </Button>
        }
      />
    </>
  );
}
