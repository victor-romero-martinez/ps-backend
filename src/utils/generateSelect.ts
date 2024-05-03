/** Select fields generator */
export function generateSelect(args: string, placeholder: string[]) {
  const arr = args
    ? args.split(',').filter((str) => str !== 'password')
    : placeholder;
  const select = new Object();

  for (const a of arr) {
    select[a] = true;
  }
  return select;
}
