const sortOrder = ["asc", "desc"] as const;

type PageSize = (typeof sortOrder)[number];

export { sortOrder, type PageSize };
