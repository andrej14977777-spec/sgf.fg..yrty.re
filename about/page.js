import { getDictionary } from '@/dictionaries';
import AboutClient from './AboutClient';
import ClientsWidget from './Clients';
import { P2pProvider } from '@/components/P2pProvider'; 

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, 'about');
  
  const baseUrl = 'https://zhivoglas.com';
  const pagePath = '/about';

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    
    alternates: {
      canonical: `${baseUrl}/${lang}${pagePath}`,
      languages: {
        'ru-RU': `${baseUrl}/ru${pagePath}`,
        'en-US': `${baseUrl}/en${pagePath}`,
        'uk-UA': `${baseUrl}/uk${pagePath}`,
        'x-default': `${baseUrl}/en${pagePath}`,
      },
    },

    openGraph: {
      title: dict.meta.openGraph.title,
      description: dict.meta.openGraph.description,
      url: `${baseUrl}/${lang}${pagePath}`,
      siteName: 'Zhivoglas',
      locale: lang === 'ru' ? 'ru_RU' : lang === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: dict.meta.openGraph.title,
      description: dict.meta.openGraph.description,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, 'about');
  
  return (
    <P2pProvider>
      <AboutClient dict={dict} />
      <ClientsWidget />
    </P2pProvider>
  );
}
