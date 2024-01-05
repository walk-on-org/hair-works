import { useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import ListItemButton, {
  listItemButtonClasses,
} from "@mui/material/ListItemButton";

import Label from "@/components/label";
import Iconify from "@/components/iconify";
import SearchNotFound from "@/components/search-not-found";

import { IStationItem } from "@/types/station";
import { useSearchStations } from "@/api/station";

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  onSelect: (station: IStationItem | null) => void;
};

export default function StationListDialog({
  title = "駅検索",
  //
  open,
  onClose,
  //
  onSelect,
}: Props) {
  const [searchStation, setSearchStation] = useState("");
  const [inputStation, setInputStation] = useState("");
  const { stations, stationsLoading } = useSearchStations("", searchStation);

  const notFound = !stations.length && !!searchStation;

  const handleChangeSearchStation = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputStation(event.target.value);
    },
    []
  );

  const handleSearchStation = useCallback(() => {
    setSearchStation(inputStation);
  }, [inputStation, searchStation]);

  const handleSelectStation = useCallback(
    (station: IStationItem | null) => {
      onSelect(station);
      setSearchStation("");
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        overflowX: "hidden",
      }}
    >
      {stations.map((station) => (
        <Stack
          key={station.id}
          spacing={0.5}
          component={ListItemButton}
          onClick={() => handleSelectStation(station)}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            [`&.${listItemButtonClasses.selected}`]: {
              bgcolor: "action.selected",
              "&:hover": {
                bgcolor: "action.selected",
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{station.name}</Typography>
          </Stack>

          {station.line_name && (
            <Box sx={{ color: "primary.main", typography: "caption" }}>
              {station.line_name}
            </Box>
          )}

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {station.prefecture_name + station.city_name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>
      </Stack>

      <Stack direction="row" gap={2} sx={{ p: 2, pt: 0 }}>
        <TextField
          value={inputStation}
          onChange={handleChangeSearchStation}
          placeholder="駅名で検索..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <LoadingButton
          loading={stationsLoading}
          variant="contained"
          onClick={handleSearchStation}
        >
          検索
        </LoadingButton>
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchStation} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}
    </Dialog>
  );
}
