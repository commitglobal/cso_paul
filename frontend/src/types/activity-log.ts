import { array, type Infer, object, string } from "superstruct";

export const ActivityLogPropsStruct = object({
  action: string(),
  changes: array(string()),
  content_type: string(),
  date: string(),
});

export type ActivityLogProps = Infer<typeof ActivityLogPropsStruct>;
