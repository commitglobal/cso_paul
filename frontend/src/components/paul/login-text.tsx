import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function LoginText() {
  return (
    <Card className="border-0 shadow-none">
        <CardHeader>
        <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back to PAUL</h1>
        </div>
        </CardHeader>
        <CardContent>
        Login to manage our NGO's data in one place, from
        beneficiaries and donors to events and reports.
        </CardContent>
    </Card>
  )
}
