/** Select fields generator */
export function generateSelect(args: string, placeholder: string[]) {
  const reg = /\b(?:(?!password|token)\w+)\b/gi;
  const arr = args ? args.match(reg) : placeholder;

  const select = new Object();

  for (const a of arr) {
    select[a] = true;
  }
  return select;
}
