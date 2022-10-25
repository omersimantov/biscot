export const getFormattedDate = (d: Date): string => {
  const date = new Date(d);
  const today = new Date();
  if (date.toLocaleDateString() === today.toLocaleDateString())
    return "Today @ " + date.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toLocaleDateString() === yesterday.toLocaleDateString())
    return "Yesterday @ " + date.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit" });
  return (
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
    " @ " +
    date.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit" })
  );
};
