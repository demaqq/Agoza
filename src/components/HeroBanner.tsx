import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ArrowRight, Plus, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { ETHIOPIAN_CITIES } from '../data/citiesData';

export const HeroBanner: React.FC = () => {
  const { setIsListModalOpen, collectibles, t } = useMarketplace();

  const activeCount = collectibles.filter((c) => c.status === 'active').length;
  const cityCount = ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').length;

  const scrollToFeed = () => {
    document.getElementById('marketplace-feed-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: Tag, value: activeCount.toLocaleString('en-US'), label: t.hero.statListings },
    { icon: MapPin, value: `${cityCount}+`, label: t.hero.statCities },
    { icon: ShieldCheck, value: '100%', label: t.hero.statProtected },
  ];

  return (
    <section className="relative overflow-hidden bg-[#140c07] text-white">
      {/* Decorative background: warm coffee gradient + subtle tibeb-inspired stripe */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,163,115,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(27,94,32,0.35),transparent_60%)]" />
        <div className="absolute bottom-0 inset-x-0 h-1.5 flex">
          <span className="flex-1 bg-[#1b8a3a]" />
          <span className="flex-1 bg-[#f4c430]" />
          <span className="flex-1 bg-[#d62828]" />
        </div>
        <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(135deg,#fff_0_2px,transparent_2px_14px)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-4 text-[#e8cfb4]">
            <span className="inline-flex items-center gap-1 bg-[#d4a373] text-[#1e130c] px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              {t.hero.kicker}
            </span>
            <span>{t.hero.kickerSub}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] text-balance mb-4">
            {t.heroHeadline}
          </h1>

          <p className="text-sm sm:text-lg text-[#e4d4c4] leading-relaxed max-w-2xl mb-8 text-pretty">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToFeed}
              className="py-3 px-7 bg-[#d4a373] hover:bg-[#e0b487] text-[#1e130c] font-extrabold text-sm rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{t.hero.shopLatest}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setIsListModalOpen(true)}
              className="py-3 px-7 bg-white/5 hover:bg-white/10 text-white border border-white/40 font-bold text-sm rounded-full transition-transform active:scale-95 cursor-pointer flex items-center gap-2 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.hero.postListing}</span>
            </button>
          </div>
        </div>

        {/* Trust stats */}
        <dl className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-56">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3"
            >
              <Icon className="w-5 h-5 text-[#d4a373] shrink-0" aria-hidden="true" />
              <div>
                <dd className="text-lg sm:text-2xl font-black tabular-nums leading-none">{value}</dd>
                <dt className="text-[11px] sm:text-xs text-[#c4b19f] mt-1 leading-snug">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
