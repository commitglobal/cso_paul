const pageSizes = [
  "5",
  "10",
  "25",
  "50",
  "all",
] as const;


type PageSize = typeof pageSizes[number];

export {
  pageSizes,
  type PageSize,
}
