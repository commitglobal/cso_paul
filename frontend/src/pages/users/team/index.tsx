import { DataTable } from "@/components/ui/data-table";
import { useValidatedProps } from "@/hooks/use-validated-props.ts";
import BaseLayout from "@/layouts/base-layout.tsx";
import { LoginChoiceProps } from "@/pages/users/auth/login-choice-props.ts";
import { useMemo } from "react";
import { columns, type User } from "./columns";

// function getData(users: User[]): UserProps[] {
//   return users.map((user) => ({
//     id: user.id,
//     user: {
//       name: `${user.first_name} ${user.last_name}`,
//       email: user.email,
//       is_current_user: false, // This can be set based on your logic
//     },
//     role: "User", // Default role, you can modify this based on your logic
//     added_since: new Date(user.date_joined).toLocaleDateString(),
//     last_activity: new Date(user.last_login).toLocaleDateString(),
//   }));
// }

export default function TeamPage() {
  const {
    props: { users },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  const tableColumns = useMemo(() => columns("ion"), []);

  // const data = getData(users as UserProps[]);

  console.log("We have users data:", users);

  return (
    <div className="container mx-auto py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
      </div>

      <DataTable columns={tableColumns} data={users as User[]} />
    </div>
  );
}

TeamPage.layout = BaseLayout;
