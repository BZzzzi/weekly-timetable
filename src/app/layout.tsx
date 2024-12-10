import type { Metadata } from "next";
import "./globals.css";

import { Open_Sans } from "next/font/google";
const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "면담 신청 시간표",
  description: "김병정 교수님 면담 신청 시간표 사이트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={sans.className}>{children}</body>
    </html>
  );
}
