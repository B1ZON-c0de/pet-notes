export function dateFormatter(isoString: string, isFullDate?: boolean): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.getDate() === now.getDate();

  if (isFullDate) {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isToday) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("ru-RU");
}
