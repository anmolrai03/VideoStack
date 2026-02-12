function formatDate(isodate) {
  const created = new Date(isodate);

  const date = created.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const time = created.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return { date, time };
}

export default formatDate;
