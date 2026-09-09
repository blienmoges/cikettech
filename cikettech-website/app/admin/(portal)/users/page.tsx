import UsersClient from "./UsersClient";

export const metadata = {
  title: "Users | CIKETTECH Admin",
  description: "Manage admin accounts and their roles.",
};

export default function AdminUsersPage() {
  return <UsersClient />;
}
