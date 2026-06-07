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
    image: string;
    imageAlt: string;
  }>;
};

export const promoMenus: PromoMenu[] = [
  {
    slug: "serpme-kahvalti",
    navLabel: "Serpme Kahvaltı",
    campaignLabel: "Hafta içi fırsatı",
    title: "Hafta içine özel serpme kahvaltı",
    period: "Pazartesi - Cuma",
    validity: "Hafta içi günlerde geçerlidir.",
    image: "/promo/serpme-kahvalti.jpeg",
    imageAlt: "Serpme kahvaltı sofrası",
    imageFit: "cover",
    price: "1000 TL",
    note: "Serpme kahvaltı 2 kişiliktir. İlave kişi ücretlidir.",
    sectionKicker: "Kahvaltı",
    sectionTitle: "içeriği",
    detailLabel: "2 kişilik servis",
    sections: [
      {
        title: "Peynir tabağı",
        items: [
          "Beyaz peynir",
          "Kaşar peyniri",
          "Çıtır peynir topu",
          "Çeçil peyniri",
        ],
      },
      {
        title: "Sofra lezzetleri",
        items: [
          "Söğüş tabağı",
          "Zeytin tabağı (siyah ve yeşil)",
          "Yörük ezmesi",
          "2 çeşit reçel",
        ],
      },
      {
        title: "Klasikler",
        items: ["Bal", "Kaymak", "Tereyağı", "Yoğurtlu biber kızartması"],
      },
      {
        title: "Sıcak tabağı",
        items: ["Gözleme", "Pişi", "Sigara böreği"],
      },
      {
        title: "Sıcak servis",
        items: ["Sucuklu yumurta", "Patates kızartması"],
      },
      {
        title: "Tatlı kapanış",
        items: ["Meyve tabağı"],
      },
    ],
  },
  {
    slug: "pizza-hamburger-icecek",
    navLabel: "Pizza & Hamburger",
    campaignLabel: "Kampanya 2",
    title: "Pizza veya hamburger alana içecek hediye",
    period: "Kampanya 2",
    validity: "Pizza veya hamburgerin yanında Coca-Cola ya da Fanta hediye.",
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
        items: ["1 adet Coca-Cola", "veya 1 adet Fanta"],
      },
      {
        title: "Geçerlilik",
        items: ["Tüm pizza çeşitleri", "Tüm hamburger çeşitleri"],
      },
    ],
    gallery: [
      {
        title: "Anadoludan pizza",
        image: "/promo/pizza-anadoludan.jpeg",
        imageAlt: "Anadoludan pizza",
      },
      {
        title: "Ay pizza",
        image: "/promo/pizza-ay.jpeg",
        imageAlt: "Ay pizza",
      },
      {
        title: "Bolonez soslu pizza",
        image: "/promo/pizza-bolonez-soslu.jpeg",
        imageAlt: "Bolonez soslu pizza",
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
    price: "300 TL",
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
