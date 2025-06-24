import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginChoiceProps } from '@/pages/Users/Login/LoginChoiceProps';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function LoginChoiceForm({
  endpoints
}: LoginChoiceProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <div className="flex flex-col items-justify gap-2 text-left">
            <h1 className="text-2xl font-bold">Login to PAUL</h1>
          </div>


        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {endpoints.ngohub && (
                <Button asChild variant="outline">
                    <a href={`${endpoints.ngohub_url}`}>Login with NGO Hub</a>
                </Button>
            )}
            
            {endpoints.email && endpoints.ngohub && (
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                    OR
                </span>
                </div>
            )}

            {endpoints.email && (
                <Button asChild type="submit">
                    <a href={`${endpoints.email_url}`}>Login with email</a>
                </Button>
            )}
          </div>
          <div className="text-center text-sm mt-6">
            New here?{" "}
            <a href="#" className="underline underline-offset-4">
              Register your organization
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
