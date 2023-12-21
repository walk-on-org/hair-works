import { format, getTime, formatDistanceToNow } from "date-fns";
import ja from "date-fns/locale/ja";

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || "yyyy/MM/dd";

  return date ? format(new Date(date), fm, { locale: ja }) : "";
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || "yyyy/MM/dd HH:mm";

  return date ? format(new Date(date), fm, { locale: ja }) : "";
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}
