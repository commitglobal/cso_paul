export function buildUrl(words: (string | number)[]) {
  return `/${words.join('/')}/`;
}
