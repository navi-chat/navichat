import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "NaviChat",
  description: "Use chatbot in your website with just a single script",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} antialiased w-full`} style={{ height: "calc(100vh - 5rem)" }}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </>
  )
}