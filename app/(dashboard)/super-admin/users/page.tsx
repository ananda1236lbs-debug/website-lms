import UsersPage from "@/components/pages/users-page";
export const metadata = { title: "Manajemen Pengguna" };
export default function SuperAdminUsersPage() {
  return <UsersPage basePath="/super-admin" />;
}
