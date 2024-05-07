function maker(params: string[]) {
  const select = new Object();
  params.forEach((s) => (select[s] = true));
  return select;
}

/** Select fields generator*/
export function generateSelect({
  placeholder,
  fields,
  includes,
}: {
  placeholder: string[];
  fields?: string;
  includes?: string;
}) {
  const reg = /\b(?:(?!password|token|\W)\w+)\b/gi;
  let arr = fields ? fields.match(reg) : placeholder;

  if (fields && fields.length < 1) arr = placeholder;
  const result = maker(arr);

  if (includes) {
    if (includes && includes.length < 1) return result;
    const [name, ...rest] = includes.match(reg);
    const includesRes = maker(rest);

    result[name] = includesRes;
  }

  return result;
}
