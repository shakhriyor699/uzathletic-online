import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UzAthletics-online Platform",
  description: "UzAthletics-online Platform",
  icons: {
    icon: "/assets/images/logo.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position='top-right'
          theme="dark"
          duration={4500}
        />
        {children}
      </body>
    </html>
  );
}
