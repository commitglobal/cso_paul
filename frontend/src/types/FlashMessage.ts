import { Infer, enums, object, optional, string } from 'superstruct';

export type FlashMessage = Infer<typeof FlashMessage>;

export const FlashMessage = object({
  message: string(),
  level_tag: optional(enums(['success', 'error', 'warning'])),
});
