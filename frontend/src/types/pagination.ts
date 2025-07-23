import { boolean, type Infer, nullable, number, object } from "superstruct";

export const Pagination = object({
  has_next: boolean(),
  has_previous: boolean(),
  num_pages: number(),
  current_page: number(),
  next_page_number: nullable(number()),
  previous_page_number: nullable(number()),
  total_items: number(),
  per_page: number(),
});

export type Pagination = Infer<typeof Pagination>;
