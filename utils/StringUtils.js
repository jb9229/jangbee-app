export function convertHyphen(str) {
  if (!str) {
    return '-';
  }
  return str;
}

export function formatTelnumber(number) {
  if (number) {
    if (number.length === 10) {
      return `${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6, 10)}`;
    }
    if (number.length === 11) {
      return `${number.substring(0, 3)}-${number.substring(3, 7)}-${number.substring(7, 11)}`;
    }

    return number;
  }

  return '-';
}

export function formatHideTelnumber(number) {
  if (number) {
    if (number.length === 10) {
      return `***­-***-${number.substring(6, 10)}`;
    }

    if (number.length === 11) {
      return `***­-****-${number.substring(7, 11)}`;
    }

    return number;
  }

  return '-';
}

export function ellipsisStr(str, number) {
  if (str) {
    if (str.length > number) {
      return `${str.substring(0, number)}...`;
    }
  }

  return '-';
}
