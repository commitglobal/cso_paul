import type { FlashMessage } from "@/types/flash-message";
import { toast } from "sonner";

export function renderToast(flashMessage: FlashMessage) {
  const message = flashMessage.message;

  switch (flashMessage.level_tag) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast(message);
  }
}
