import { boolean, type Infer, object, string } from "superstruct";

export const HeaderPropsStruct = object({
  accessorKey: string(),
  header: string(),
  enableSorting: boolean(),
});

export type HeaderProps = Infer<typeof HeaderPropsStruct>;

