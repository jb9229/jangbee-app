export function getAdtypeStr(adType) {
  if (adType === 1) {
    return '메인광고_첫번째';
  }
  if (adType === 2) {
    return '메인광고_두번째';
  }
  if (adType === 3) {
    return '메인광고_세번째';
  }
  if (adType === 11) {
    return '장비 타켓광고_첫번째';
  }
  if (adType === 12) {
    return '장비 타켓광고_두번째';
  }
  if (adType === 13) {
    return '장비 타켓광고_세번째';
  }
  if (adType === 21) {
    return '지역 타켓광고_첫번째';
  }
  if (adType === 22) {
    return '지역 타켓광고_두번째';
  }
  if (adType === 23) {
    return '지역 타켓광고_세번째';
  }
  if (adType === 31) {
    return '?';
  }
  if (adType === 32) {
    return '?';
  }
  if (adType === 33) {
    return '?';
  }
  return 'undefined';
}

export function test() {}
