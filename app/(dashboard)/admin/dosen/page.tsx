import UsersPage from "@/components/pages/users-page";
export const metadata = { title: "Manajemen Dosen" };
export default function Page() { return <UsersPage basePath="/admin" fixedRole="dosen" />; }
