import { CommonProps } from "@/types/common-props";
import { SelectOption } from "@/types/select-option";
import { array, assign, type Infer, object } from "superstruct";

export type TeamUserProps = Infer<typeof TeamUserProps>;

export const TeamUserProps = assign(
  object({
    role_choices: array(SelectOption),
  }),
  CommonProps
);
