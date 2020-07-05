export function formatNumber (num)
{
  if (num)
  {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return 0;
}

export const numberWithCommas = (no: number): string =>
{
  if (!no) { return }

  return no.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
