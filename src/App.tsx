import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { promoMenus } from "./data/promoMenu";

export default function App() {
  const { slug } = useParams();
  const promoMenu =
    promoMenus.find((menu) => menu.slug === slug) ?? promoMenus[0];
  const isLongOffer = promoMenu.price.length > 14;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [promoMenu.slug]);

  return (
    <main className="min-h-screen bg-[#f7f1e7] bg-[linear-gradient(90deg,rgba(98,31,56,0.08)_1px,transparent_1px)] [background-size:22px_22px] px-3 py-4 text-[#30201f] sm:px-6 sm:py-7">
      <section
        className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-[#5a1636]/20 bg-[#fff9ef] shadow-[0_18px_48px_rgba(73,40,30,0.16)]"
        aria-labelledby="promo-title"
      >
        <header
          className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          style={{
            background:
              "repeating-linear-gradient(90deg,#5a1636 0,#5a1636 12px,#fff9ef 12px,#fff9ef 22px)",
          }}
        >
          <p className="w-fit rounded bg-[#fff9ef] px-3 py-1 font-serif text-5xl font-black leading-none text-[#1f4e55] sm:text-6xl lg:text-7xl">
            ÖZSÜT
          </p>
          <p className="w-fit rounded bg-[#fff9ef] px-3 py-2 font-sans text-xs font-extrabold uppercase text-[#1f4e55] sm:text-sm">
            {promoMenu.campaignLabel}
          </p>
        </header>

        <nav
          className="flex gap-2 overflow-x-auto border-b border-[#7a4532]/20 px-4 py-3 sm:px-7"
          aria-label="Kampanya menüleri"
        >
          {promoMenus.map((menu) => {
            const isActive = menu.slug === promoMenu.slug;

            return (
              <Link
                className={[
                  "shrink-0 rounded border px-3 py-2 font-sans text-sm font-extrabold transition",
                  isActive
                    ? "border-[#5a1636] bg-[#5a1636] text-[#fff9ef]"
                    : "border-[#5a1636]/20 bg-white/55 text-[#5a1636] hover:border-[#5a1636]/45",
                ].join(" ")}
                to={`/menu/${menu.slug}`}
                key={menu.slug}
                aria-current={isActive ? "page" : undefined}
              >
                {menu.navLabel}
              </Link>
            );
          })}
        </nav>

        <section className="grid gap-6 px-4 py-6 sm:px-7 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8 lg:py-9">
          <div className="flex flex-col justify-center">
            <p className="mb-3 w-fit rounded border border-[#5a1636]/25 px-3 py-2 font-sans text-sm font-extrabold text-[#5a1636] sm:text-base">
              {promoMenu.period}
            </p>
            <h1
              id="promo-title"
              className="max-w-[12ch] font-serif text-5xl font-black uppercase leading-[0.92] text-[#5a1636] sm:text-6xl lg:text-7xl"
            >
              {promoMenu.title}
            </h1>
            <p className="mt-5 font-sans text-base font-bold text-[#7a4532] sm:text-lg">
              {promoMenu.validity}
            </p>
          </div>

          <figure className="m-0 overflow-hidden rounded-lg shadow-[0_18px_36px_rgba(55,36,26,0.18)]">
            <img
              className={[
                "block w-full",
                promoMenu.imageFit === "contain"
                  ? "aspect-[16/10] bg-[#1f1412] object-contain sm:aspect-[16/9] lg:min-h-[420px]"
                  : "aspect-[4/5] object-cover sm:aspect-[16/11] lg:min-h-[420px]",
              ].join(" ")}
              src={promoMenu.image}
              alt={promoMenu.imageAlt}
            />
          </figure>
        </section>

        <section
          className="mx-4 border-y border-[#7a4532]/25 py-7 sm:mx-7"
          aria-labelledby="contents-title"
        >
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-sm font-extrabold uppercase text-[#7a4532]">
                {promoMenu.sectionKicker}
              </p>
              <h2
                id="contents-title"
                className="font-serif text-4xl font-black leading-none text-[#1f4e55] sm:text-5xl"
              >
                {promoMenu.sectionTitle}
              </h2>
            </div>
            <p className="font-sans text-sm font-bold text-[#7a4532]">
              {promoMenu.detailLabel}
            </p>
          </div>

          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {promoMenu.sections.map((section) => (
              <article
                className="border-t border-[#5a1636]/20 pt-4"
                key={section.title}
              >
                <h3 className="mb-3 font-serif text-2xl font-black leading-none text-[#5a1636]">
                  {section.title}
                </h3>
                <ul className="grid gap-2">
                  {section.items.map((item) => (
                    <li
                      className="font-sans text-[0.98rem] font-semibold leading-snug text-[#30201f]"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <footer className="grid gap-3 px-4 py-8 text-center sm:px-7">
          <p
            className={[
              "mx-auto max-w-4xl font-serif font-black uppercase leading-none text-[#5a1636]",
              isLongOffer
                ? "text-4xl sm:text-5xl lg:text-6xl"
                : "text-6xl sm:text-7xl lg:text-8xl",
            ].join(" ")}
          >
            {promoMenu.price}
          </p>
          <p className="mx-auto max-w-xl font-sans text-base font-bold leading-relaxed text-[#7a4532] sm:text-lg">
            {promoMenu.note}
          </p>
        </footer>
      </section>
    </main>
  );
}
