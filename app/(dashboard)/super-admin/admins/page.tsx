import UsersPage from "@/components/pages/users-page";
export const metadata = { title: "Manajemen Admin" };
export default function Page() { return <UsersPage basePath="/super-admin" fixedRole="admin" />; }
