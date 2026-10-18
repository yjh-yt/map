import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI地图聊天应用",
  description: "Next.js + Gemini + SQLite + 高德地图",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}
