import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Unbounded } from "next/font/google";
import { locales, hasLocale, BRAND } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SmoothScroll from "@/components/SmoothScroll";
import "../globals.css";

const body = Geist({ variable: "--font-body", subsets: ["latin"] });
const display = Unbounded({ variable: "--font-display", subsets: ["latin"], weight: ["400", "700", "900"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${BRAND} — ${dict.meta.title}`,
    description: dict.meta.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${body.variable} ${display.variable} antialiased`}>
      <body className="text-ink">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
