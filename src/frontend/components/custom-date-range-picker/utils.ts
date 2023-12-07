import { fDate } from "@/utils/format-time";

// ----------------------------------------------------------------------

export function shortDateLabel(startDate: Date | null, endDate: Date | null) {
  if (startDate && endDate) {
    return `${fDate(startDate, "yyyy/MM/dd")} - ${fDate(
      endDate,
      "yyyy/MM/dd"
    )}`;
  } else if (startDate) {
    return `${fDate(startDate, "yyyy/MM/dd")} - `;
  } else if (endDate) {
    return `- ${fDate(endDate, "yyyy/MM/dd")}`;
  } else {
    return "";
  }
}
