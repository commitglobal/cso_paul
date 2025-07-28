import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next";
import { Link } from '@inertiajs/react';


type AddTeamMemberDialogProps = {
  onClose: () => void;
  open: boolean;
};


export function AddTeamMemberDialog({
  onClose,
  open,
}: AddTeamMemberDialogProps) {
  
    const {t} = useTranslation();

  return (
    <Dialog open={open}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('users.team.addUser')}</DialogTitle>
            <DialogDescription>
              Lorem ipsum. <Link href="#">Understand user roles</Link>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">{t('users.team.add.name')}</Label>
              <Input id="name" name="name" defaultValue="" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">{t('users.team.add.email')}</Label>
              <Input id="email" name="email" defaultValue="" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">{t('users.team.add.userRole')}</Label>
              <Input id="role" name="role" defaultValue="" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
