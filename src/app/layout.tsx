
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import TeamSelector from "@/components/team-selector";
import { Providers } from "@/providers";
import Sidebar from "@/components/sidebar";
import { TeamSearch } from "@/components/team-search";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TM - Core",
  description: "TM MLB - Core Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              <header className="border-b-2 py-3 z-10 px-2 flex justify-between items-center h-16 w-full fixed bg-inherit backdrop-blur-xl">
                <Image src="/TruMedia-logo.png" alt="TruMedia Logo" width={`50`} height={50} className="dark:contrast-75 w-auto" priority />

                <ThemeToggle />
              </header>
              <main>
                <div className="md:hidden md:h-0 top-20 relative">
                  <TeamSearch />
                </div>

                <div className="flex">
                  <Sidebar>
                    <TeamSelector />
                  </Sidebar>

                  <div className="flex justify-center w-full md:ml-64 mt-20 md:mt-16 p-2 md:p-4">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
