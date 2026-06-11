import UsersPage from "@/components/pages/users-page";
export const metadata = { title: "Manajemen Mahasiswa" };
export default function Page() { return <UsersPage basePath="/admin" fixedRole="mahasiswa" />; }
