import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, BRAND } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import StageCanvas from "@/components/stage/StageCanvas";
import Hero from "@/components/home/Hero";
import LightsCue from "@/components/home/LightsCue";
import WarehouseStory from "@/components/home/WarehouseStory";
import TripStory from "@/components/home/TripStory";
import Packs from "@/components/home/Packs";
import Budget from "@/components/home/Budget";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main>
      <StageCanvas />

      <span className="fixed left-4 top-5 z-10 font-display text-sm font-bold uppercase tracking-[0.3em] sm:left-10">
        {BRAND}
      </span>
      <Link
        href={lang === "pt" ? "/en" : "/pt"}
        className="fixed right-4 top-4 z-10 rounded-full border border-ink/20 px-3 py-1.5 text-xs tracking-widest text-ink/80 transition hover:border-magenta hover:text-ink sm:right-10"
      >
        {dict.switchLang}
      </Link>

      <Hero t={dict.hero} />
      <LightsCue t={dict.lights} />
      <WarehouseStory t={dict.warehouse} />
      <TripStory t={dict.trip} />
      <Packs t={dict.packs} lang={lang} />
      <Budget t={dict.budget} packs={dict.packs} lang={lang} />

      {/* placeholder until the request form (phase 6) lands */}
      <section id="pedido" className="flex min-h-svh items-center justify-center px-4">
        <p className="text-xs uppercase tracking-[0.35em] text-mute">{dict.next}</p>
      </section>
    </main>
  );
}
