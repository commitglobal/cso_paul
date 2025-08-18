import { type Infer, number, object, string } from "superstruct";

export const ActivityLogPropsStruct = object({
  id: number(),
  userId: number(),
  action: string(),
  date: string(),
});

export type ActivityLogProps = Infer<typeof ActivityLogPropsStruct>;
