export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} +  years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} + months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} + days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} +  hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} + " minutes`;
  }
  return `${Math.floor(seconds)} + " seconds`;
}

/**
 * yyyy-mm-dd to dd-mm-yyyy
 *
 * @param {string} ddMMYYYY
 * @returns
 */
export function formatDate(ddMMYYYY) {
  const [yyyy, mm, dd] = ddMMYYYY.split("-");

  return `${parseInt(dd, 10).toLocaleString("en-Us", {
    minimumIntegerDigits: 2,
  })}-${parseInt(mm, 10).toLocaleString("en-Us", {
    minimumIntegerDigits: 2,
  })}-${yyyy}`;
}
