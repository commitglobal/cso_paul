import { format, formatDuration } from 'date-fns';
import { ro } from 'date-fns/locale';

export const DAY_MONTH_YEAR = 'dd.MM.yyyy';
export const MONTH_DAY_YEAR = 'MMM dd, yyyy';
export const DAY_MONTH_YEAR_HOUR = 'dd.MM.yyyy HH:mm:ss';

export function formatDate(
  dateString?: string | number | null,
  formatString = DAY_MONTH_YEAR,
) {
  if (!dateString) {
    return 'N/A';
  }

  const date = new Date(dateString);

  const day = date.getDate();

  if (date instanceof Date && !isNaN(day)) {
    return format(date, formatString, { locale: ro });
  }

  return 'N/A';
}

const SECONDS = 60 * 1000;
// const MINUTES = 60 * SECONDS;

export function formatVideoDuration(duration: number) {
  const minutes = Math.floor(duration / SECONDS);
  return formatDuration({ minutes }, { locale: ro });
}

export function formatNumberWithCommas(x?: string | null) {
  return x
    ?.toString()
    .replace(/[^\d]/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
