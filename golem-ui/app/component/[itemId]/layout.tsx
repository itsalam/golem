import "@/app/globals.css";
import { DrawerProvider } from "@/components/FocusDrawer/drawer-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Golem Local UI",
  description: "UI for your local Golem Instance.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DrawerProvider>{children}</DrawerProvider>
}