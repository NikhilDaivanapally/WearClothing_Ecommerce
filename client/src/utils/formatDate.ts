const formatDate = (date: string) => {
  const date_localformat = new Date(Date.parse(date)).toDateString();
  const Time = new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour clock and show AM/PM
  });
  const formateDate = `${date_localformat} at ${Time}`;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  const ProvidedYear = new Date(date).getFullYear();
  const ProvidedMonth = new Date(date).getMonth();
  const ProvidedDate = new Date(date).getDate();

  switch (true) {
    case currentYear === ProvidedYear &&
      currentMonth === ProvidedMonth &&
      currentDate === ProvidedDate:
      return "Today";
    case currentYear === ProvidedYear &&
      currentMonth === ProvidedMonth &&
      currentDate - 1 === ProvidedDate:
      return "Yesterday";

    default:
      return formateDate;
  }
};
export default formatDate;
