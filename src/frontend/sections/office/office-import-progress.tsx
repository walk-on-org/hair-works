import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import axios, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  processId: string;
  onFinish: (existsError: boolean) => void;
};

export default function OfficeImportProgress({ processId, onFinish }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(async () => {
      // 管理テーブルより全体件数、処理済件数を取得
      let res = await axios.get(
        endpoints.processManagement.checkProcess(processId)
      );
      setProgress((res.data.processed_count / res.data.total_count) * 100);
      // 実行済の場合、終了
      if (res.data.status == 2) {
        clearInterval(timer);
        onFinish(res.data.error_count > 0 ? true : false);
      }
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
