import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s - Kuaku market online store",
    default: "Kuaku market online store",
  },
  description: "Kuaku market online store, Your one stop shop for all your needs",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-15">{children}</main>
      <Footer />
    </div>
  );
}
