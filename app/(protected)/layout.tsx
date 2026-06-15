import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication check here
  // For now, we'll just render the children
  return <>{children}</>;
}
