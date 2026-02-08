import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apolloWrapper";


export const metadata: Metadata = {
  title: "Slooze CMS",
  description: "Commodities Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
