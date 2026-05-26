// my-pwa/app/[lang]/page.tsx
import CategoryCard from '@/components/CategoryCard';
import { getDictionary, Lang } from '../../dictionaries';
import { getPageMetadata, SchemaScript } from '@/lib/seo'; 

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Lang, 'common');
  
  return getPageMetadata(dict, '', lang as Lang);
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Lang, 'common');

  return (
    <div className="flex flex-col relative">
      <SchemaScript dict={dict} type="website" route="" lang={lang as Lang} />
      
      <main className="font-sans px-2 mx-auto w-full max-w-6xl pt-18 z-10">
        <section className="relative animate-entry flex flex-col items-end w-full mx-auto px-6"> 
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-11 h-11 bg-accent/5 blur-2xl rounded-full pointer-events-none" aria-hidden="true" /> 
          <h1 className="h1-hero leading-none relative text-right text-[8px] md:text-xs lg:text-sm font-black uppercase w-full">
            <span className="font-serif tracking-[1em] mr-[-1em]">
              {dict.hero.art3}
            </span> 
            <br /> 
            <span className="h1-accent tracking-wide inline-block scale-x-[1.3] text-4xl md:text-6xl lg:text-7xl bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-sans origin-right"> 
              {dict.hero.art4} 
            </span> 
          </h1> 
        </section>


        <section aria-label="Main Services" className="justify-items-center grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up px-2">
          <CategoryCard 
            href={`/${lang}/photo`}
            //imageSrc="https://dl.dropboxusercontent.com/scl/fi/q04qo7vu7wf7dioyekv7i/mainphoto.webp?g22b&raw=1"
            imageSrc="/works/mainphoto.webp"
            imageAlt={dict.alt.photo}
            category={dict.categories.visuals}
            title={dict.categories.photo}
            priority={true}
          />
          <CategoryCard 
            href={`/${lang}/website`}
            imageSrc="/works/mainwebsite.webp"
            imageAlt={dict.alt.web}
            category={dict.categories.web}
            title={dict.categories.websiteDev}
            priority={true}
          />
          <CategoryCard 
            href={`/${lang}/video`}
            imageSrc="/works/mainvideo.webp"
            imageAlt={dict.alt.video}
            category={dict.categories.media}
            title={dict.categories.videoAudio}
            priority={true}
          />
          <CategoryCard 
            href={`/${lang}/software`}
            imageSrc="/works/mainsoft.webp"
            imageAlt={dict.alt.software}
            category={dict.categories.development}
            title={dict.categories.software}
            priority={true}
          />
        </section>
      </main>

      <section aria-label="Additional Categories" className="font-sans px-4 mx-auto w-full pt-2 z-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> 
        <div className="relative mt-2 mb-4 animate-entry flex flex-col items-center text-center">
          <p 
            className="text-xs md:text-lg font-light bg-linear-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-pulse"
            style={{ animationDuration: '12s' }}
          > 
            {dict.quote.part1}<strong className="text-xs md:text-base font-black italic">{dict.quote.mirror}</strong>{dict.quote.part2}<strong className="text-xs md:text-base font-black italic">{dict.quote.hammer}</strong>{dict.quote.part3}
          </p>
        </div>

        <div className="mb-3 justify-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up max-w-4xl mx-auto">
          <CategoryCard 
            href={`/${lang}/music`}
            imageSrc="/works/mainmusic.webp"
            imageAlt={dict.alt.music}
            category={dict.categories.audio}
            title={dict.categories.musicCreation}
          />
          <CategoryCard 
            href={`/${lang}/design`}
            imageSrc="/works/maindesign.webp"
            imageAlt={dict.alt.design}
            category={dict.categories.creative}
            title={dict.categories.design}
          />
          <CategoryCard 
            href={`/${lang}/ideas`}
            imageSrc="/works/mainidea.webp"
            imageAlt={dict.alt.ideas}
            category={dict.categories.concepts}
            title={dict.categories.ideas}
          />
        </div>
      </section>
      
    </div>
  );
}