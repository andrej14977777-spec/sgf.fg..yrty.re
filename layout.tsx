// my-pwa/app/[lang]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/Header";
import Pagination from '@/components/Pagination';
import { getDictionary, Lang } from "../../dictionaries";
import { GoogleAnalytics } from '@next/third-parties/google';
import PwaRegister from '@/components/PwaRegister';
import { getRootMetadata } from '@/lib/seo'; 

const ruslanFont = localFont({
  src: "../../public/fonts/RuslanDisplay-Regular.ttf",
  variable: "--font-slavic",
  display: 'swap',
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ru' }, { lang: 'uk' }];
}

// Забираем глобальные метаданные из комбайна
export const generateMetadata = getRootMetadata;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const headerDict = await getDictionary(lang as Lang, 'header');
  
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${ruslanFont.variable} antialiased bg-background text-foreground`}>
          <Header dict={headerDict} currentLang={lang} />
          <div className="relative min-h-screen">{children}</div>
          <Pagination />
          <PwaRegister lang={lang} /> 
          <GoogleAnalytics gaId="G-N3LN19YYKC" />
      </body>
    </html>
  );
}