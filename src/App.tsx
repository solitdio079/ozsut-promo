import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { promoMenus } from "./data/promoMenu";

const whatsappUrl = "https://wa.me/905316188679";

export default function App() {
  const { slug } = useParams();
  const promoMenu =
    promoMenus.find((menu) => menu.slug === slug) ?? promoMenus[0];
  const isLongOffer = promoMenu.price.length > 14;
  const sectionHeading = `${promoMenu.sectionKicker} ${promoMenu.sectionTitle}`;

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
              <h2
                id="contents-title"
                className="font-sans text-2xl font-extrabold leading-tight text-[#1f4e55] sm:text-3xl"
              >
                {sectionHeading}
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

          {promoMenu.gallery ? (
            <div className="mt-8 border-t border-[#7a4532]/20 pt-6">
              <h3 className="font-sans text-xl font-extrabold leading-tight text-[#5a1636] sm:text-2xl">
                Pizza ve hamburger çeşitleri
              </h3>
              <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-7 sm:gap-5 sm:px-7 [&::-webkit-scrollbar]:hidden">
                {promoMenu.gallery.map((item) => (
                  <article
                    className="min-w-[78%] snap-start overflow-hidden rounded-lg border border-[#5a1636]/15 bg-white shadow-[0_12px_28px_rgba(73,40,30,0.12)] sm:min-w-[44%] lg:min-w-[31%]"
                    key={item.title}
                  >
                    <img
                      className="aspect-[4/3] w-full bg-white object-contain"
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                    />
                    <div className="border-t border-[#5a1636]/10 px-4 py-3">
                      <p className="font-sans text-base font-extrabold text-[#30201f]">
                        {item.title}
                      </p>
                      {item.price ? (
                        <p className="mt-1 font-sans text-sm font-black text-[#5a1636]">
                          {item.price}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
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

      <a
        className="fixed bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 font-sans text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1fbd5b] focus:outline-none focus:ring-4 focus:ring-[#25d366]/35 sm:bottom-6 sm:right-6 sm:px-5 sm:text-base"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 shrink-0"
          viewBox="0 0 32 32"
          fill="currentColor"
        >
          <path d="M16.04 3.2A12.72 12.72 0 0 0 5.16 22.5L3.5 28.8l6.45-1.62A12.7 12.7 0 1 0 16.04 3.2Zm0 23.08a10.5 10.5 0 0 1-5.35-1.46l-.38-.22-3.82.96 1-3.72-.25-.39a10.49 10.49 0 1 1 8.8 4.83Zm5.75-7.85c-.31-.16-1.85-.91-2.13-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.01-.99 1.22-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.6c-.21 0-.54.08-.83.39-.29.31-1.09 1.07-1.09 2.61 0 1.54 1.12 3.03 1.28 3.24.16.21 2.21 3.37 5.35 4.72.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
        </svg>
        <span>WhatsApp</span>
      </a>
    </main>
  );
}
