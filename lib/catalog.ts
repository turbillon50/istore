// =====================================================================
// iStore — Catálogo PÚBLICO de la tienda (cara al cliente).
// iStore NO es un software para talleres: ES LA TIENDA del dueño. Aquí vive
// lo que el público compra (celulares, accesorios) y los servicios de
// reparación que solicita. Fuente de verdad de la vitrina de la home.
//
// El campo `image` usa URLs estables; si falla, la tarjeta degrada a un
// placeholder elegante por categoría (nunca imagen rota). Cuando el catálogo
// local en /public/products esté cableado, basta apuntar `image` ahí.
// =====================================================================

export type ProductCategory =
  | "Smartphones"
  | "Audífonos"
  | "Smartwatch"
  | "Tablets"
  | "Fundas"
  | "Cargadores";

export interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  /** Precio anterior (tachado) para badge de oferta. */
  compareAt?: number;
  /** "Nuevo" | "Oferta" | "Más vendido" — opcional. */
  tag?: "Nuevo" | "Oferta" | "Más vendido";
  rating: number;
  reviews: number;
  /** Existencias; 0 = agotado. */
  stock: number;
  image: string;
  /** Galería opcional (la primera siempre es `image`). */
  gallery?: string[];
  blurb: string;
  highlights: string[];
}

export interface StoreService {
  id: string;
  name: string;
  /** Desde qué precio arranca el servicio. */
  fromPrice: number;
  durationLabel: string;
  icon: "screen" | "battery" | "water" | "diagnostic" | "software" | "camera";
  blurb: string;
  includes: string[];
}

const U =
  "https://images.unsplash.com/";
const img = (id: string) =>
  `${U}${id}?auto=format&fit=crop&w=900&q=80`;

// --------------------------- PRODUCTOS -------------------------------
export const products: StoreProduct[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "Smartphones",
    price: 24999,
    compareAt: 27999,
    tag: "Más vendido",
    rating: 4.9,
    reviews: 312,
    stock: 7,
    image: img("photo-1695048133142-1a20484d2569"),
    gallery: [
      img("photo-1695048133142-1a20484d2569"),
      img("photo-1592286927505-1def25115558"),
    ],
    blurb:
      "Titanio, chip A17 Pro y cámara de 48 MP. El iPhone más potente, con garantía y factura.",
    highlights: ["Pantalla 6.1” Super Retina XDR", "Chip A17 Pro", "Cámara 48 MP", "USB-C"],
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 22499,
    tag: "Nuevo",
    rating: 4.8,
    reviews: 188,
    stock: 5,
    image: img("photo-1610945265064-0e34e5519bbf"),
    blurb:
      "S Pen integrado, Galaxy AI y zoom de 100x. Pantalla brillante de 6.8” para todo el día.",
    highlights: ["Pantalla 6.8” QHD+", "Galaxy AI", "S Pen incluido", "Zoom 100x"],
  },
  {
    id: "iphone-13",
    name: "iPhone 13 128GB",
    brand: "Apple",
    category: "Smartphones",
    price: 12999,
    compareAt: 14999,
    tag: "Oferta",
    rating: 4.7,
    reviews: 540,
    stock: 12,
    image: img("photo-1632661674596-df8be070a5c5"),
    blurb:
      "El equilibrio perfecto entre precio y rendimiento. Batería todo el día y cámara dual.",
    highlights: ["Pantalla 6.1” OLED", "Chip A15 Bionic", "Cámara dual 12 MP", "Face ID"],
  },
  {
    id: "xiaomi-redmi-note-13",
    name: "Xiaomi Redmi Note 13",
    brand: "Xiaomi",
    category: "Smartphones",
    price: 4999,
    rating: 4.6,
    reviews: 421,
    stock: 20,
    image: img("photo-1598327105666-5b89351aff97"),
    blurb:
      "Cámara de 108 MP y carga turbo a un precio increíble. Ideal para el día a día.",
    highlights: ["Cámara 108 MP", "Carga 33W", "Pantalla AMOLED 120Hz", "Batería 5000 mAh"],
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro (2ª gen)",
    brand: "Apple",
    category: "Audífonos",
    price: 4799,
    compareAt: 5499,
    tag: "Oferta",
    rating: 4.9,
    reviews: 276,
    stock: 15,
    image: img("photo-1600294037681-c80b4cb5b434"),
    blurb:
      "Cancelación activa de ruido mejorada, audio adaptativo y estuche con USB-C.",
    highlights: ["Cancelación de ruido", "Audio espacial", "Estuche USB-C", "Hasta 6h de uso"],
  },
  {
    id: "galaxy-buds",
    name: "Galaxy Buds FE",
    brand: "Samsung",
    category: "Audífonos",
    price: 1799,
    rating: 4.5,
    reviews: 132,
    stock: 18,
    image: img("photo-1590658268037-6bf12165a8df"),
    blurb:
      "Sonido envolvente y cancelación de ruido en un diseño cómodo para todo el día.",
    highlights: ["Cancelación de ruido", "Bluetooth 5.2", "Resistencia IPX2", "Estuche compacto"],
  },
  {
    id: "apple-watch-s9",
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Smartwatch",
    price: 8999,
    tag: "Nuevo",
    rating: 4.8,
    reviews: 96,
    stock: 9,
    image: img("photo-1551816230-ef5deaed4a26"),
    blurb:
      "Pantalla más brillante, gesto de doble toque y sensores de salud avanzados.",
    highlights: ["Pantalla Retina siempre activa", "ECG y oxígeno en sangre", "GPS", "Resistente al agua"],
  },
  {
    id: "galaxy-watch-6",
    name: "Galaxy Watch 6",
    brand: "Samsung",
    category: "Smartwatch",
    price: 5499,
    compareAt: 6299,
    tag: "Oferta",
    rating: 4.6,
    reviews: 74,
    stock: 11,
    image: img("photo-1617625802912-cde586faf331"),
    blurb:
      "Monitoreo de sueño, composición corporal y diseño elegante con bisel táctil.",
    highlights: ["Análisis de sueño", "Composición corporal", "Wear OS", "Carga rápida"],
  },
  {
    id: "ipad-10",
    name: "iPad 10ª generación 64GB",
    brand: "Apple",
    category: "Tablets",
    price: 9499,
    rating: 4.7,
    reviews: 143,
    stock: 6,
    image: img("photo-1544244015-0df4b3ffc6b0"),
    blurb:
      "Pantalla Liquid Retina de 10.9”, chip A14 y USB-C. Perfecta para estudiar y crear.",
    highlights: ["Pantalla 10.9” Liquid Retina", "Chip A14 Bionic", "USB-C", "Compatible Apple Pencil"],
  },
  {
    id: "galaxy-tab-a9",
    name: "Galaxy Tab A9+",
    brand: "Samsung",
    category: "Tablets",
    price: 4299,
    tag: "Más vendido",
    rating: 4.5,
    reviews: 210,
    stock: 14,
    image: img("photo-1561154464-82e9adf32764"),
    blurb:
      "Pantalla de 11” a 90Hz y sonido cuádruple. Entretenimiento sin límites.",
    highlights: ["Pantalla 11” 90Hz", "4 bocinas", "Batería 7040 mAh", "Android 13"],
  },
  {
    id: "funda-magsafe",
    name: "Funda MagSafe Premium",
    brand: "iStore",
    category: "Fundas",
    price: 449,
    compareAt: 599,
    tag: "Oferta",
    rating: 4.6,
    reviews: 389,
    stock: 40,
    image: img("photo-1601593346740-925612772716"),
    blurb:
      "Silicón aterciopelado con imán MagSafe. Protección de grado militar y tacto suave.",
    highlights: ["Compatible MagSafe", "Grado militar", "Silicón antideslizante", "Varios colores"],
  },
  {
    id: "cargador-usbc-20w",
    name: "Cargador USB-C 20W + Cable",
    brand: "iStore",
    category: "Cargadores",
    price: 349,
    rating: 4.7,
    reviews: 612,
    stock: 50,
    image: img("photo-1583863788434-e58a36330cf0"),
    blurb:
      "Carga rápida certificada con cable USB-C trenzado de 1m. Compatible iPhone y Android.",
    highlights: ["Carga rápida 20W", "Cable trenzado 1m", "Protección de sobrecarga", "Universal"],
  },
];

// --------------------------- SERVICIOS -------------------------------
export const services: StoreService[] = [
  {
    id: "cambio-pantalla",
    name: "Cambio de pantalla",
    fromPrice: 899,
    durationLabel: "Mismo día",
    icon: "screen",
    blurb:
      "Pantalla nueva con garantía. Recibimos tu equipo, lo reparamos y te avisamos cuando esté listo.",
    includes: ["Diagnóstico gratis", "Refacción con garantía", "90 días de garantía", "Prueba frente a ti"],
  },
  {
    id: "cambio-bateria",
    name: "Cambio de batería",
    fromPrice: 549,
    durationLabel: "1–2 horas",
    icon: "battery",
    blurb:
      "Recupera la autonomía de tu equipo con una batería de alta calidad instalada por expertos.",
    includes: ["Batería de alto ciclo", "Calibración incluida", "90 días de garantía", "Sin perder datos"],
  },
  {
    id: "limpieza-humedad",
    name: "Limpieza por humedad",
    fromPrice: 480,
    durationLabel: "24 horas",
    icon: "water",
    blurb:
      "¿Se mojó tu equipo? Limpieza profunda de placa y secado profesional para rescatarlo.",
    includes: ["Limpieza ultrasónica", "Revisión de placa", "Diagnóstico completo", "Reporte honesto"],
  },
  {
    id: "diagnostico",
    name: "Diagnóstico de 17 puntos",
    fromPrice: 0,
    durationLabel: "30 minutos",
    icon: "diagnostic",
    blurb:
      "Revisamos pantalla, batería, cámaras, sensores y más. Te decimos exactamente qué tiene tu equipo.",
    includes: ["17 puntos de revisión", "Sin costo", "Cotización clara", "Sin compromiso"],
  },
  {
    id: "desbloqueo-software",
    name: "Software y desbloqueo",
    fromPrice: 350,
    durationLabel: "1 hora",
    icon: "software",
    blurb:
      "Actualización, formateo, recuperación de sistema y liberación de equipos compatibles.",
    includes: ["Respaldo previo", "Instalación limpia", "Optimización", "Asesoría incluida"],
  },
  {
    id: "cambio-camara",
    name: "Reparación de cámara",
    fromPrice: 690,
    durationLabel: "Mismo día",
    icon: "camera",
    blurb:
      "Cámara borrosa o que no enfoca. Cambiamos el módulo por uno nuevo con garantía.",
    includes: ["Módulo nuevo", "Calibración", "90 días de garantía", "Prueba frente a ti"],
  },
];

export const productCategories: (ProductCategory | "Todos")[] = [
  "Todos",
  "Smartphones",
  "Audífonos",
  "Smartwatch",
  "Tablets",
  "Fundas",
  "Cargadores",
];
