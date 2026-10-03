export type PromoMenu = {
  slug: string;
  navLabel: string;
  campaignLabel: string;
  title: string;
  period: string;
  validity: string;
  image: string;
  imageAlt: string;
  imageFit: "cover" | "contain";
  price: string;
  note: string;
  sectionKicker: string;
  sectionTitle: string;
  detailLabel: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  gallery?: Array<{
    title: string;
    price?: string;
    image: string;
    imageAlt: string;
  }>;
};

export const promoMenus: PromoMenu[] = [
  {
    slug: "pizza-hamburger-icecek",
    navLabel: "Pizza & Hamburger",
    campaignLabel: "Kampanya 2",
    title: "Pizza veya hamburger alana içecek hediye",
    period: "Kampanya 2",
    validity:
      "Pizza veya hamburgerin yanında 200 ml şişe Coca-Cola ya da Fanta hediye.",
    image: "/promo/pizza-hamburger-icecek.jpeg",
    imageAlt: "Pizza, hamburger, Coca-Cola ve Fanta kampanya görseli",
    imageFit: "contain",
    price: "Kola veya Fanta hediye!",
    note: "Tüm pizza ve hamburger çeşitlerinde geçerlidir.",
    sectionKicker: "Kampanya",
    sectionTitle: "detayı",
    detailLabel: "İçecek hediyesi",
    sections: [
      {
        title: "Seçim",
        items: ["Pizza çeşitlerinden biri", "Hamburger çeşitlerinden biri"],
      },
      {
        title: "Hediye",
        items: ["1 adet 200 ml şişe Coca-Cola", "veya 1 adet 200 ml şişe Fanta"],
      },
      {
        title: "Geçerlilik",
        items: ["Tüm pizza çeşitleri", "Tüm hamburger çeşitleri"],
      },
    ],
    gallery: [
      {
        title: "Margherita pizza",
        price: "665 TL",
        image: "/promo/pizza-margarita.jpeg",
        imageAlt: "Margherita pizza",
      },
      {
        title: "BBQ tavuklu pizza",
        price: "700 TL",
        image: "/promo/pizza-bbq-tavuklu.jpeg",
        imageAlt: "BBQ tavuklu pizza",
      },
      {
        title: "Sebzeli pizza",
        price: "665 TL",
        image: "/promo/pizza-sebzeli.jpeg",
        imageAlt: "Sebzeli pizza",
      },
      {
        title: "Ay pizza",
        price: "760 TL",
        image: "/promo/pizza-ay.jpeg",
        imageAlt: "Ay pizza",
      },
      {
        title: "Dört peynirli pizza",
        price: "750 TL",
        image: "/promo/pizza-dort-peynirli.jpeg",
        imageAlt: "Dört peynirli pizza",
      },
      {
        title: "Hamburger",
        price: "700 TL",
        image: "/promo/hamburger.jpeg",
        imageAlt: "Hamburger",
      },
      {
        title: "Cızır burger",
        price: "635 TL",
        image: "/promo/cizir-burger.jpeg",
        imageAlt: "Cızır burger",
      },
      {
        title: "Tavuk burger",
        price: "575 TL",
        image: "/promo/tavuk-burger.jpeg",
        imageAlt: "Tavuk burger",
      },
    ],
  },
  {
    slug: "tatli-bir-mola",
    navLabel: "Tatlı Bir Mola",
    campaignLabel: "Kampanya 3",
    title: "Tatlı bir mola",
    period: "Kampanya 3",
    validity: "Dilim pasta alana yanında çay veya kahve hediye.",
    image: "/promo/tatli-bir-mola.jpeg",
    imageAlt: "Tatlı bir mola dilim pasta, çay ve kahve kampanya görseli",
    imageFit: "contain",
    price: "350 TL",
    note: "Dilim pasta alana yanında çay veya kahve hediye.",
    sectionKicker: "Tatlı",
    sectionTitle: "seçenekleri",
    detailLabel: "Çay veya kahve hediyesi",
    sections: [
      {
        title: "Dilim pasta",
        items: ["Karamelli", "Meyveli", "Çikolatalı", "Frambuaz"],
      },
      {
        title: "Hediye içecek",
        items: ["1 bardak çay", "veya 1 fincan kahve"],
      },
      {
        title: "Kampanya",
        items: ["Dilim pasta alana geçerlidir", "Tatlı bir mola için hazır"],
      },
    ],
  },
];
