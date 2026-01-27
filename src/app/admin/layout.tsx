import { Providers } from "./providers";

export const metadata = {
  title: "Yume Admin",
  description: "Admin panel for Yume Ramen",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}