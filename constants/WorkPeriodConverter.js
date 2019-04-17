export default function convertWorkStr(value) {
  if (!value) {
    return '-';
  }

  if (value === 0.3) {
    return '오전';
  }
  if (value === 0.8) {
    return '오후';
  }

  return `${value}일`;
}
