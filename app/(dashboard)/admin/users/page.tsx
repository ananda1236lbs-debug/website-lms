import UsersPage from "@/components/pages/users-page";
export const metadata = { title: "Manajemen Pengguna" };
export default function AdminUsersPage() {
  return <UsersPage basePath="/admin" />;
}
