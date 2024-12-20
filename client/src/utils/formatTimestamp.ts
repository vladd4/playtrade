export function formatChatCardTimestamp(timestamp: string): string {
  const today = new Date();
  const date = new Date(timestamp);

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (isToday) {
    return `${hours}:${minutes}`;
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    return `${day}.${month}.${year}`;
  }
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function getDateSeparator(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isYesterday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate() - 1;

  if (isToday) {
    return 'Сьогодні';
  } else if (isYesterday) {
    return 'Вчора';
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  }
}

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;
  return time;
};

export function parseAndFormatDate(input: string) {
  const dateRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;
  const match = input.match(dateRegex);

  if (match) {
    const parsedDate = new Date(match[0]);
    const formattedDate = parsedDate.toLocaleString('ru-RU', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = input.split(match[0]);
    return {
      formattedDate: `${parts[0]} ${formattedDate}`,
      targetDate: parsedDate,
    };
  } else {
    return {
      formattedDate: `${input} | No valid date found.`,
      targetDate: null,
    };
  }
}
