import type { Metadata } from "next";
import SideBar from "@/components/Admin/SideBar/SideBar";

export const metadata: Metadata = {
  title: "PlayTrade Marketplace | Admin Panel",
  description: "PlayTrade Marketplace | Admin Panel",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <SideBar />
      {children}
    </section>
  );
}
