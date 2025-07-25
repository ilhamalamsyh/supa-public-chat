import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "HH:mm")}`;
  } else {
    return format(date, "MMM dd, yyyy HH:mm");
  }
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatLastSeen = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, "HH:mm")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "HH:mm")}`;
  } else {
    return format(date, "MMM dd, yyyy HH:mm");
  }
};
