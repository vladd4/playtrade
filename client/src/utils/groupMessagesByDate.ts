import { getDateSeparator } from "./formatTimestamp";

interface MessageGroup<T> {
  date: string;
  messages: T[];
}

type FormattedMessageGroups<T> = MessageGroup<T>[];

export function groupMessagesByDate<T extends { timestamp: string }>(
  messages: T[]
): FormattedMessageGroups<T> {
  if (messages.length === 0) {
    return [];
  }

  const groupedMessages: FormattedMessageGroups<T> = [];
  let lastDate: string | null = null;

  messages.forEach((msg) => {
    const messageDate = getDateSeparator(msg.timestamp);

    if (messageDate !== lastDate) {
      groupedMessages.push({
        date: messageDate,
        messages: [msg],
      });
      lastDate = messageDate;
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  return groupedMessages;
}
