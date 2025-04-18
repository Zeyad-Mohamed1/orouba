import type { Metadata } from "next";
import { Baloo_Bhaijaan_2, Amaranth } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";

const balooBhaijaan2 = Baloo_Bhaijaan_2({
  variable: "--font-baloo-bhaijaan-2",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

const amaranth = Amaranth({
  variable: "--font-amaranth",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orouba",
  description: "Orouba",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${
          locale === "en" ? amaranth.className : balooBhaijaan2.className
        } antialiased bg-gray-50`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster position={locale === "en" ? "top-right" : "top-left"} />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
