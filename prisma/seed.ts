import { PrismaClient, ProductType, ProductStatus, BannerZone, BannerType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding iStore Pro database...')

  // ─────────────────────────────────────────────────────────────────────────
  // 1. CATEGORIES
  // ─────────────────────────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'smartphones' },
      update: {},
      create: {
        slug: 'smartphones',
        name: 'Smartphones',
        description: 'Los mejores teléfonos inteligentes del mercado',
        icon: 'smartphone',
        color: '#ff8c00',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accesorios' },
      update: {},
      create: {
        slug: 'accesorios',
        name: 'Accesorios',
        description: 'Fundas, cargadores, cables y más',
        icon: 'cable',
        color: '#3b82f6',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'audio' },
      update: {},
      create: {
        slug: 'audio',
        name: 'Audio',
        description: 'Audífonos, bocinas y accesorios de audio premium',
        icon: 'headphones',
        color: '#8b5cf6',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tablets' },
      update: {},
      create: {
        slug: 'tablets',
        name: 'Tablets',
        description: 'iPads, tablets Android y más',
        icon: 'tablet',
        color: '#22c55e',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'servicios' },
      update: {},
      create: {
        slug: 'servicios',
        name: 'Servicios',
        description: 'Reparación, garantía extendida y soporte técnico',
        icon: 'wrench',
        color: '#f59e0b',
        sortOrder: 5,
        isActive: true,
      },
    }),
  ])

  const [catSmartphones, catAccesorios, catAudio, catTablets] = categories
  console.log(`✓ ${categories.length} categorías creadas`)

  // ─────────────────────────────────────────────────────────────────────────
  // 2. BRANDS
  // ─────────────────────────────────────────────────────────────────────────

  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'apple' },
      update: {},
      create: {
        slug: 'apple',
        name: 'Apple',
        description: 'Think different.',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/brands/apple-logo.svg',
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'samsung' },
      update: {},
      create: {
        slug: 'samsung',
        name: 'Samsung',
        description: 'Do What You Can't.',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/brands/samsung-logo.svg',
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'xiaomi' },
      update: {},
      create: {
        slug: 'xiaomi',
        name: 'Xiaomi',
        description: 'Innovation for everyone.',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/brands/xiaomi-logo.svg',
        isActive: true,
        isFeatured: true,
        sortOrder: 3,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'motorola' },
      update: {},
      create: {
        slug: 'motorola',
        name: 'Motorola',
        description: 'Ready for anything.',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/brands/motorola-logo.svg',
        isActive: true,
        isFeatured: false,
        sortOrder: 4,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'sony' },
      update: {},
      create: {
        slug: 'sony',
        name: 'Sony',
        description: 'Be Moved.',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/brands/sony-logo.svg',
        isActive: true,
        isFeatured: false,
        sortOrder: 5,
      },
    }),
  ])

  const [brandApple, brandSamsung, brandXiaomi, brandMotorola, brandSony] = brands
  console.log(`✓ ${brands.length} marcas creadas`)

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PRODUCTS (12 productos — mercado mexicano)
  // ─────────────────────────────────────────────────────────────────────────

  const productsData = [
    // ── Apple ──────────────────────────────────────────────────────────────
    {
      sku: 'APL-IPH15-128-BLK',
      slug: 'iphone-15-128gb-negro',
      name: 'iPhone 15 128 GB — Negro',
      shortDesc: 'Chip A16 Bionic, Dynamic Island, cámara de 48 MP',
      description:
        'El iPhone 15 con chip A16 Bionic ofrece una experiencia excepcional con Dynamic Island, sistema de cámara de 48 MP con zoom óptico 2x y USB-C. Resistente al agua IP68.',
      categoryId: catSmartphones.id,
      brandId: brandApple.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: false,
      isHot: true,
      price: 17999,
      comparePrice: 19999,
      costPrice: 14500,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/iphone15-black-1.jpg', alt: 'iPhone 15 Negro frontal', order: 1, isMain: true },
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/iphone15-black-2.jpg', alt: 'iPhone 15 Negro trasero', order: 2, isMain: false },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.1" Super Retina XDR OLED, 2556×1179, 460 ppi',
        'Procesador': 'Apple A16 Bionic',
        'RAM': '6 GB',
        'Almacenamiento': '128 GB',
        'Cámara principal': '48 MP f/1.6 + 12 MP ultrawide',
        'Cámara frontal': '12 MP TrueDepth',
        'Batería': '3877 mAh, carga rápida 20W, inalámbrica 15W',
        'Conectividad': '5G, Wi-Fi 6, Bluetooth 5.3, USB-C',
        'Resistencia': 'IP68 (6 metros, 30 min)',
        'OS': 'iOS 17',
      }),
      features: JSON.stringify(['Dynamic Island', 'USB-C', 'MagSafe 15W', 'Emergency SOS vía satélite', 'Detección de accidentes']),
      publishedAt: new Date(),
    },
    {
      sku: 'APL-IPH15PRO-256-NAT',
      slug: 'iphone-15-pro-256gb-titanio-natural',
      name: 'iPhone 15 Pro 256 GB — Titanio Natural',
      shortDesc: 'Chip A17 Pro, Action Button, cámara 48 MP con zoom 5x',
      description:
        'El iPhone 15 Pro con diseño de titanio aeroespacial y chip A17 Pro. Action Button personalizable, cámara de 48 MP con zoom óptico 5x y grabación ProRes 4K a 60 fps.',
      categoryId: catSmartphones.id,
      brandId: brandApple.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: false,
      isHot: true,
      price: 26999,
      comparePrice: 28999,
      costPrice: 21500,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/iphone15pro-natural-1.jpg', alt: 'iPhone 15 Pro Titanio Natural frontal', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.1" Super Retina XDR OLED ProMotion 120Hz, 2556×1179',
        'Procesador': 'Apple A17 Pro',
        'RAM': '8 GB',
        'Almacenamiento': '256 GB',
        'Cámara principal': '48 MP f/1.78 + 12 MP ultrawide + 12 MP 5x teléfoto',
        'Cámara frontal': '12 MP TrueDepth',
        'Batería': '3274 mAh, carga 27W, MagSafe 15W',
        'Conectividad': '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C 3.0',
        'Chasis': 'Titanio grado 5',
        'OS': 'iOS 17',
      }),
      features: JSON.stringify(['Action Button', 'ProRes 4K@60fps', 'Ray Tracing A17 Pro', 'MagSafe 15W', 'Titanio aeroespacial']),
      publishedAt: new Date(),
    },
    // ── Samsung ────────────────────────────────────────────────────────────
    {
      sku: 'SAM-S24-128-PHT',
      slug: 'samsung-galaxy-s24-128gb-phantom-black',
      name: 'Samsung Galaxy S24 128 GB — Phantom Black',
      shortDesc: 'Galaxy AI, Snapdragon 8 Gen 3, cámara 50 MP',
      description:
        'El Galaxy S24 con inteligencia artificial Galaxy AI integrada. Procesador Snapdragon 8 Gen 3, pantalla Dynamic AMOLED 2X 120 Hz y cámara de 50 MP con zoom espacial.',
      categoryId: catSmartphones.id,
      brandId: brandSamsung.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: true,
      isHot: false,
      price: 15999,
      comparePrice: 17499,
      costPrice: 12800,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/galaxy-s24-black-1.jpg', alt: 'Galaxy S24 Phantom Black', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.2" Dynamic AMOLED 2X, 2340×1080, 120Hz',
        'Procesador': 'Snapdragon 8 Gen 3 for Galaxy',
        'RAM': '8 GB',
        'Almacenamiento': '128 GB',
        'Cámara principal': '50 MP f/1.8 + 12 MP ultrawide + 10 MP 3x teléfoto',
        'Cámara frontal': '12 MP',
        'Batería': '4000 mAh, carga 25W, inalámbrica 15W',
        'Conectividad': '5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.2',
        'OS': 'Android 14 + One UI 6.1',
      }),
      features: JSON.stringify(['Galaxy AI', 'Circle to Search', 'Live Translate', 'Nightography', '7 años de actualizaciones']),
      publishedAt: new Date(),
    },
    {
      sku: 'SAM-S24U-256-BLK',
      slug: 'samsung-galaxy-s24-ultra-256gb-titanium-black',
      name: 'Samsung Galaxy S24 Ultra 256 GB — Titanium Black',
      shortDesc: 'S Pen integrado, zoom 100x, pantalla 6.8" QHD+',
      description:
        'La experiencia definitiva de Samsung. S Pen integrado, pantalla QHD+ 120Hz, zoom óptico 5x y zoom espacial 100x. El smartphone más potente de Galaxy.',
      categoryId: catSmartphones.id,
      brandId: brandSamsung.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: true,
      isHot: true,
      price: 31999,
      comparePrice: 34999,
      costPrice: 26000,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/galaxy-s24-ultra-1.jpg', alt: 'Galaxy S24 Ultra Titanium Black', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.8" Dynamic AMOLED 2X, 3088×1440 QHD+, 120Hz',
        'Procesador': 'Snapdragon 8 Gen 3 for Galaxy',
        'RAM': '12 GB',
        'Almacenamiento': '256 GB',
        'Cámara principal': '200 MP f/1.7 + 12 MP ultrawide + 10 MP 3x + 50 MP 5x',
        'Zoom': 'Óptico 5x / Espacial 100x',
        'Batería': '5000 mAh, carga 45W',
        'S Pen': 'Integrado con latencia 2.8ms',
        'OS': 'Android 14 + One UI 6.1',
      }),
      features: JSON.stringify(['S Pen integrado', 'Zoom 100x', 'Galaxy AI', 'Titanio', 'ProVisual Engine']),
      publishedAt: new Date(),
    },
    // ── Xiaomi ─────────────────────────────────────────────────────────────
    {
      sku: 'XMI-RN13-128-BLK',
      slug: 'xiaomi-redmi-note-13-128gb-midnight-black',
      name: 'Xiaomi Redmi Note 13 128 GB — Midnight Black',
      shortDesc: 'AMOLED 120Hz, cámara 108 MP, carga 33W',
      description:
        'El Redmi Note 13 ofrece pantalla AMOLED de 6.67" a 120Hz, cámara principal de 108 MP y batería de 5000 mAh con carga rápida de 33W a un precio accesible.',
      categoryId: catSmartphones.id,
      brandId: brandXiaomi.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 4999,
      comparePrice: 5999,
      costPrice: 3800,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/redmi-note13-black-1.jpg', alt: 'Redmi Note 13 Midnight Black', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.67" AMOLED, 2400×1080, 120Hz',
        'Procesador': 'Snapdragon 685',
        'RAM': '8 GB',
        'Almacenamiento': '128 GB + MicroSD',
        'Cámara principal': '108 MP + 8 MP ultrawide + 2 MP macro',
        'Cámara frontal': '16 MP',
        'Batería': '5000 mAh, carga 33W',
        'OS': 'Android 13 + MIUI 14',
      }),
      features: JSON.stringify(['Carga rápida 33W', 'NFC', 'Jack 3.5mm', 'MicroSD', 'Splash resistant']),
      publishedAt: new Date(),
    },
    {
      sku: 'XMI-14-256-WHT',
      slug: 'xiaomi-14-256gb-blanco',
      name: 'Xiaomi 14 256 GB — Blanco',
      shortDesc: 'Snapdragon 8 Gen 3, Leica, carga 90W',
      description:
        'El Xiaomi 14 con cámaras co-desarrolladas con Leica, procesador Snapdragon 8 Gen 3 y carga ultrarrápida de 90W. La propuesta premium de Xiaomi.',
      categoryId: catSmartphones.id,
      brandId: brandXiaomi.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: true,
      isHot: false,
      price: 18999,
      comparePrice: 20999,
      costPrice: 15000,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/xiaomi14-white-1.jpg', alt: 'Xiaomi 14 Blanco', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.36" LTPO AMOLED, 2670×1200, 120Hz',
        'Procesador': 'Snapdragon 8 Gen 3',
        'RAM': '12 GB',
        'Almacenamiento': '256 GB UFS 4.0',
        'Cámara Leica': '50 MP Summilux f/1.6 + 50 MP ultrawide + 50 MP 3.2x',
        'Batería': '4610 mAh, carga 90W HyperCharge, inalámbrica 50W',
        'OS': 'Android 14 + HyperOS',
      }),
      features: JSON.stringify(['Leica Summilux', 'Carga 90W', 'IP68', 'HyperOS', 'Snapdragon 8 Gen 3']),
      publishedAt: new Date(),
    },
    // ── Motorola ───────────────────────────────────────────────────────────
    {
      sku: 'MOT-G84-256-MRN',
      slug: 'motorola-moto-g84-256gb-marshmallow-blue',
      name: 'Motorola Moto G84 256 GB — Marshmallow Blue',
      shortDesc: 'pOLED 6.55" 120Hz, batería 5000 mAh, audio Dolby Atmos',
      description:
        'El Moto G84 con pantalla pOLED de 6.55" a 120Hz, sonido Dolby Atmos, cámara de 50 MP con OIS y batería de 5000 mAh. La mejor relación calidad-precio de Motorola.',
      categoryId: catSmartphones.id,
      brandId: brandMotorola.id,
      productType: ProductType.PHONE,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 5499,
      comparePrice: 6999,
      costPrice: 4200,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/moto-g84-blue-1.jpg', alt: 'Moto G84 Marshmallow Blue', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '6.55" pOLED, 2400×1080, 120Hz',
        'Procesador': 'Snapdragon 695 5G',
        'RAM': '12 GB',
        'Almacenamiento': '256 GB + MicroSD',
        'Cámara': '50 MP f/1.8 OIS + 8 MP ultrawide',
        'Batería': '5000 mAh, carga 33W TurboPower',
        'Audio': 'Dolby Atmos, altavoces estéreo',
        'OS': 'Android 13',
      }),
      features: JSON.stringify(['Dolby Atmos', 'OIS', 'MicroSD', 'Jack 3.5mm', 'NFC']),
      publishedAt: new Date(),
    },
    // ── Audio ──────────────────────────────────────────────────────────────
    {
      sku: 'APL-AWPRO2-WHT',
      slug: 'apple-airpods-pro-2da-generacion',
      name: 'Apple AirPods Pro (2ª generación)',
      shortDesc: 'ANC adaptativa, audio espacial personalizado, USB-C',
      description:
        'Los AirPods Pro de 2ª generación con cancelación activa de ruido adaptativa, audio espacial personalizado con seguimiento dinámico de cabeza y nuevo estuche con USB-C.',
      categoryId: catAudio.id,
      brandId: brandApple.id,
      productType: ProductType.AUDIO,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: false,
      isHot: false,
      price: 4999,
      comparePrice: 5999,
      costPrice: 3800,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/airpods-pro2-1.jpg', alt: 'AirPods Pro 2da gen', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Chip': 'Apple H2',
        'ANC': 'Adaptativa hasta 2x más potente que gen 1',
        'Audio': 'Audio espacial personalizado, Dolby Atmos',
        'Batería auricular': '6h (con ANC), 30h con estuche',
        'Conectividad': 'Bluetooth 5.3',
        'Resistencia': 'IPX4',
        'Carga': 'USB-C / MagSafe / Lightning',
      }),
      features: JSON.stringify(['ANC adaptativa', 'Audio espacial', 'Conversación transparente', 'Detección de prótesis auditivas', 'USB-C']),
      publishedAt: new Date(),
    },
    {
      sku: 'SNY-WH1000XM5-BLK',
      slug: 'sony-wh-1000xm5-negro',
      name: 'Sony WH-1000XM5 — Negro',
      shortDesc: 'ANC líder de la industria, 30h batería, Multipoint',
      description:
        'Los auriculares over-ear con la mejor cancelación de ruido de la industria según Sony. Procesador QN2 HD, 30 horas de batería y conectividad Multipoint para dos dispositivos.',
      categoryId: catAudio.id,
      brandId: brandSony.id,
      productType: ProductType.AUDIO,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 7999,
      comparePrice: 9499,
      costPrice: 5800,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/sony-xm5-black-1.jpg', alt: 'Sony WH-1000XM5 Negro', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Chip ANC': 'QN2 HD + QN1',
        'Batería': '30h con ANC, 3h en 3min de carga',
        'Controladores': '30mm carbono',
        'Conectividad': 'Bluetooth 5.2, Multipoint, NFC',
        'Micrófono': '8 micrófonos beamforming',
        'Peso': '250g',
        'Carga': 'USB-C',
      }),
      features: JSON.stringify(['ANC líder industria', 'Speak-to-Chat', 'Multipoint', 'LDAC', 'Hi-Res Audio']),
      publishedAt: new Date(),
    },
    // ── Tablets ────────────────────────────────────────────────────────────
    {
      sku: 'APL-IPAD10-64-YEL',
      slug: 'apple-ipad-10ma-generacion-64gb-amarillo',
      name: 'Apple iPad 10ª generación 64 GB — Amarillo',
      shortDesc: 'Chip A14 Bionic, pantalla 10.9" Liquid Retina, USB-C',
      description:
        'El iPad de 10ª generación con diseño completamente nuevo, chip A14 Bionic, pantalla Liquid Retina de 10.9" y USB-C. Ideal para estudiar, trabajar y entretenerte.',
      categoryId: catTablets.id,
      brandId: brandApple.id,
      productType: ProductType.TABLET,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 10999,
      comparePrice: 11999,
      costPrice: 8500,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/ipad10-yellow-1.jpg', alt: 'iPad 10ª gen Amarillo', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Pantalla': '10.9" Liquid Retina, 2360×1640, 264 ppi',
        'Procesador': 'Apple A14 Bionic',
        'Almacenamiento': '64 GB',
        'Cámara trasera': '12 MP, video 4K',
        'Cámara frontal': '12 MP ultrawide paisaje',
        'Conectividad': 'Wi-Fi 6, Bluetooth 5.2, USB-C',
        'Batería': '28.65 Wh (~10h video)',
        'OS': 'iPadOS 17',
      }),
      features: JSON.stringify(['USB-C', 'Magic Keyboard compatible', 'Apple Pencil 1ra gen', 'Center Stage', 'True Tone']),
      publishedAt: new Date(),
    },
    // ── Accesorios ─────────────────────────────────────────────────────────
    {
      sku: 'APL-MAGCHG15-WHT',
      slug: 'apple-magsafe-charger-15w',
      name: 'Apple MagSafe Charger 15W — 1 metro',
      shortDesc: 'Carga inalámbrica magnética hasta 15W para iPhone 12 y superior',
      description:
        'El cargador MagSafe original de Apple. Carga inalámbrica magnética de hasta 15W para iPhone 12 en adelante. Compatible con estuches MagSafe y accesorios del ecosistema.',
      categoryId: catAccesorios.id,
      brandId: brandApple.id,
      productType: ProductType.ACCESSORY,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 1199,
      comparePrice: 1399,
      costPrice: 800,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/magsafe-charger-1.jpg', alt: 'MagSafe Charger 15W', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Potencia máxima': '15W (iPhone 12+)',
        'Compatibilidad': 'iPhone 12, 13, 14, 15 y sus variantes',
        'Longitud del cable': '1 metro',
        'Conector': 'USB-C (adaptador 20W no incluido)',
        'Tecnología': 'MagSafe magnético',
      }),
      features: JSON.stringify(['Alineación magnética automática', 'Compatible AirPods Pro', 'Carga segura']),
      publishedAt: new Date(),
    },
    {
      sku: 'SAM-25WCHRG-WHT',
      slug: 'samsung-cargador-25w-super-fast-charging',
      name: 'Samsung Cargador 25W Super Fast Charging',
      shortDesc: 'Carga rápida 25W compatible con Galaxy S21 en adelante',
      description:
        'Cargador de pared Samsung Super Fast Charging de 25W con cable USB-C incluido. Compatible con Galaxy S21, S22, S23, S24 y Note 20/21.',
      categoryId: catAccesorios.id,
      brandId: brandSamsung.id,
      productType: ProductType.ACCESSORY,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false,
      isHot: false,
      price: 499,
      comparePrice: 699,
      costPrice: 320,
      images: JSON.stringify([
        { url: 'https://res.cloudinary.com/istorepro/image/upload/products/samsung-25w-charger-1.jpg', alt: 'Samsung 25W Super Fast Charging', order: 1, isMain: true },
      ]),
      specs: JSON.stringify({
        'Potencia': '25W',
        'Tecnología': 'Super Fast Charging 2.0',
        'Entrada': '100-240V AC',
        'Salida': '9V/2.77A, 5V/3A',
        'Cable incluido': 'USB-C a USB-C 1.5m',
      }),
      features: JSON.stringify(['Cable incluido', 'Super Fast Charging 2.0', 'Protección sobrecalentamiento']),
      publishedAt: new Date(),
    },
  ]

  let productCount = 0
  for (const data of productsData) {
    await prisma.product.upsert({
      where: { sku: data.sku },
      update: {},
      create: data as Parameters<typeof prisma.product.create>[0]['data'],
    })
    productCount++
  }
  console.log(`✓ ${productCount} productos creados`)

  // ─────────────────────────────────────────────────────────────────────────
  // 4. BRANCHES (Sucursales)
  // ─────────────────────────────────────────────────────────────────────────

  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { slug: 'cdmx-polanco' },
      update: {},
      create: {
        slug: 'cdmx-polanco',
        name: 'iStore Pro Polanco',
        address: 'Av. Presidente Masaryk 123, Polanco',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip: '11560',
        phone: '+52 55 1234 5678',
        email: 'polanco@istorepro.mx',
        lat: 19.4320,
        lng: -99.1946,
        isMain: true,
        isActive: true,
        sortOrder: 1,
        hours: JSON.stringify({
          lun: '10:00 - 20:00',
          mar: '10:00 - 20:00',
          mie: '10:00 - 20:00',
          jue: '10:00 - 20:00',
          vie: '10:00 - 21:00',
          sab: '10:00 - 21:00',
          dom: '11:00 - 19:00',
        }),
        services: JSON.stringify(['Venta', 'Reparación', 'Trade-In', 'Soporte técnico', 'Financiamiento']),
        images: JSON.stringify([
          { url: 'https://res.cloudinary.com/istorepro/image/upload/branches/polanco-1.jpg', alt: 'Sucursal Polanco exterior' },
        ]),
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'gdl-andares' },
      update: {},
      create: {
        slug: 'gdl-andares',
        name: 'iStore Pro Andares',
        address: 'Blvd. Puerta de Hierro 4965, Andares, L-215',
        city: 'Zapopan',
        state: 'Jalisco',
        zip: '45116',
        phone: '+52 33 9876 5432',
        email: 'andares@istorepro.mx',
        lat: 20.7142,
        lng: -103.4066,
        isMain: false,
        isActive: true,
        sortOrder: 2,
        hours: JSON.stringify({
          lun: '10:00 - 21:00',
          mar: '10:00 - 21:00',
          mie: '10:00 - 21:00',
          jue: '10:00 - 21:00',
          vie: '10:00 - 22:00',
          sab: '10:00 - 22:00',
          dom: '11:00 - 20:00',
        }),
        services: JSON.stringify(['Venta', 'Reparación', 'Trade-In', 'Financiamiento']),
        images: JSON.stringify([
          { url: 'https://res.cloudinary.com/istorepro/image/upload/branches/andares-1.jpg', alt: 'Sucursal Andares' },
        ]),
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'mty-valle' },
      update: {},
      create: {
        slug: 'mty-valle',
        name: 'iStore Pro Valle',
        address: 'Av. Batallón de San Patricio 111, Valle Oriente',
        city: 'San Pedro Garza García',
        state: 'Nuevo León',
        zip: '66269',
        phone: '+52 81 5555 1234',
        email: 'valle@istorepro.mx',
        lat: 25.6579,
        lng: -100.3565,
        isMain: false,
        isActive: true,
        sortOrder: 3,
        hours: JSON.stringify({
          lun: '10:00 - 21:00',
          mar: '10:00 - 21:00',
          mie: '10:00 - 21:00',
          jue: '10:00 - 21:00',
          vie: '10:00 - 22:00',
          sab: '10:00 - 22:00',
          dom: '12:00 - 20:00',
        }),
        services: JSON.stringify(['Venta', 'Reparación', 'Trade-In']),
        images: JSON.stringify([
          { url: 'https://res.cloudinary.com/istorepro/image/upload/branches/valle-1.jpg', alt: 'Sucursal Valle' },
        ]),
      },
    }),
  ])
  console.log(`✓ ${branches.length} sucursales creadas`)

  // ─────────────────────────────────────────────────────────────────────────
  // 5. FINANCING OPTIONS
  // ─────────────────────────────────────────────────────────────────────────

  const financing = await Promise.all([
    prisma.financing.upsert({
      where: { id: 'fin-kueski' },
      update: {},
      create: {
        id: 'fin-kueski',
        name: 'Kueski Pay',
        provider: 'Kueski',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/financing/kueski-logo.svg',
        minAmount: 500,
        maxAmount: 50000,
        isActive: true,
        sortOrder: 1,
        plans: JSON.stringify([
          { months: 3,  rate: 0,    minAmount: 500,   label: '3 MSI' },
          { months: 6,  rate: 0,    minAmount: 1500,  label: '6 MSI' },
          { months: 12, rate: 0,    minAmount: 3000,  label: '12 MSI' },
          { months: 18, rate: 0.08, minAmount: 5000,  label: '18 meses' },
          { months: 24, rate: 0.12, minAmount: 8000,  label: '24 meses' },
        ]),
        requirements: JSON.stringify([
          'INE o pasaporte vigente',
          'CURP',
          'Número de celular activo',
          'Cuenta bancaria o tarjeta de débito',
          'Historial crediticio no requerido',
        ]),
      },
    }),
    prisma.financing.upsert({
      where: { id: 'fin-bbva' },
      update: {},
      create: {
        id: 'fin-bbva',
        name: 'BBVA Meses sin Intereses',
        provider: 'BBVA',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/financing/bbva-logo.svg',
        minAmount: 1000,
        maxAmount: 200000,
        isActive: true,
        sortOrder: 2,
        plans: JSON.stringify([
          { months: 3,  rate: 0, minAmount: 1000, label: '3 MSI' },
          { months: 6,  rate: 0, minAmount: 2000, label: '6 MSI' },
          { months: 9,  rate: 0, minAmount: 3000, label: '9 MSI' },
          { months: 12, rate: 0, minAmount: 5000, label: '12 MSI' },
          { months: 18, rate: 0, minAmount: 8000, label: '18 MSI' },
        ]),
        requirements: JSON.stringify([
          'Tarjeta de crédito BBVA',
          'Tarjeta vigente',
          'Disponible en tienda física y en línea',
        ]),
      },
    }),
    prisma.financing.upsert({
      where: { id: 'fin-hsbc' },
      update: {},
      create: {
        id: 'fin-hsbc',
        name: 'HSBC Meses sin Intereses',
        provider: 'HSBC',
        logo: 'https://res.cloudinary.com/istorepro/image/upload/financing/hsbc-logo.svg',
        minAmount: 800,
        maxAmount: 150000,
        isActive: true,
        sortOrder: 3,
        plans: JSON.stringify([
          { months: 3,  rate: 0, minAmount: 800,  label: '3 MSI' },
          { months: 6,  rate: 0, minAmount: 1500, label: '6 MSI' },
          { months: 12, rate: 0, minAmount: 4000, label: '12 MSI' },
          { months: 18, rate: 0, minAmount: 7000, label: '18 MSI' },
        ]),
        requirements: JSON.stringify([
          'Tarjeta de crédito HSBC',
          'Tarjeta vigente',
        ]),
      },
    }),
  ])
  console.log(`✓ ${financing.length} opciones de financiamiento creadas`)

  // ─────────────────────────────────────────────────────────────────────────
  // 6. SITE CONFIG
  // ─────────────────────────────────────────────────────────────────────────

  const configs = [
    { key: 'store_name',        value: 'iStore Pro',                      group: 'general', label: 'Nombre de la tienda' },
    { key: 'store_tagline',     value: 'Tecnología Premium en México',    group: 'general', label: 'Tagline' },
    { key: 'store_email',       value: 'hola@istorepro.mx',               group: 'contact', label: 'Email de contacto' },
    { key: 'store_phone',       value: '+52 55 1234 5678',                group: 'contact', label: 'Teléfono principal' },
    { key: 'store_whatsapp',    value: '+5215512345678',                  group: 'contact', label: 'WhatsApp' },
    { key: 'store_address',     value: 'Av. Masaryk 123, Polanco, CDMX', group: 'contact', label: 'Dirección principal' },
    { key: 'social_instagram',  value: 'https://instagram.com/istorepromx', group: 'social', label: 'Instagram' },
    { key: 'social_facebook',   value: 'https://facebook.com/istorepromx',  group: 'social', label: 'Facebook' },
    { key: 'social_tiktok',     value: 'https://tiktok.com/@istorepromx',   group: 'social', label: 'TikTok' },
    { key: 'social_x',          value: 'https://x.com/istorepromx',         group: 'social', label: 'X (Twitter)' },
    { key: 'currency',          value: 'MXN',                            group: 'store',   label: 'Moneda' },
    { key: 'currency_symbol',   value: '$',                              group: 'store',   label: 'Símbolo de moneda' },
    { key: 'shipping_free_min', value: 1500,                             group: 'store',   label: 'Envío gratis desde (MXN)', type: 'number' },
    { key: 'shipping_price',    value: 150,                              group: 'store',   label: 'Precio de envío (MXN)', type: 'number' },
    { key: 'tax_rate',          value: 0.16,                             group: 'store',   label: 'Tasa de IVA', type: 'number' },
    { key: 'return_days',       value: 30,                               group: 'store',   label: 'Días para devolución', type: 'number' },
  ]

  for (const cfg of configs) {
    await prisma.siteConfig.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value as Parameters<typeof prisma.siteConfig.upsert>[0]['update']['value'] },
      create: {
        key: cfg.key,
        value: cfg.value as Parameters<typeof prisma.siteConfig.create>[0]['data']['value'],
        group: cfg.group,
        label: cfg.label,
        type: (cfg as { type?: string }).type ?? 'text',
      },
    })
  }
  console.log(`✓ ${configs.length} configuraciones del sitio creadas`)

  // ─────────────────────────────────────────────────────────────────────────
  // 7. BANNERS
  // ─────────────────────────────────────────────────────────────────────────

  const banners = await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner-hero-1' },
      update: {},
      create: {
        id: 'banner-hero-1',
        name: 'Hero — iPhone 15 Pro',
        zone: BannerZone.HERO_MAIN,
        type: BannerType.IMAGE,
        title: 'iPhone 15 Pro',
        subtitle: 'Titanio. Tan resistente como avanzado.',
        description: 'Chip A17 Pro. Action Button. Zoom óptico 5x.',
        cta: 'Comprar ahora',
        ctaUrl: '/productos/iphone-15-pro-256gb-titanio-natural',
        image: 'https://res.cloudinary.com/istorepro/image/upload/banners/iphone15pro-hero.jpg',
        imageMobile: 'https://res.cloudinary.com/istorepro/image/upload/banners/iphone15pro-hero-mobile.jpg',
        overlay: true,
        overlayColor: 'rgba(19,19,19,0.55)',
        textColor: '#ffffff',
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner-hero-2' },
      update: {},
      create: {
        id: 'banner-hero-2',
        name: 'Hero — Galaxy S24 Ultra',
        zone: BannerZone.HERO_MAIN,
        type: BannerType.IMAGE,
        title: 'Galaxy S24 Ultra',
        subtitle: 'Galaxy AI está aquí.',
        description: 'S Pen integrado. Zoom 100x. Titanio.',
        cta: 'Explorar',
        ctaUrl: '/productos/samsung-galaxy-s24-ultra-256gb-titanium-black',
        image: 'https://res.cloudinary.com/istorepro/image/upload/banners/galaxy-s24-ultra-hero.jpg',
        imageMobile: 'https://res.cloudinary.com/istorepro/image/upload/banners/galaxy-s24-ultra-hero-mobile.jpg',
        overlay: true,
        overlayColor: 'rgba(10,10,20,0.6)',
        textColor: '#ffffff',
        isActive: true,
        sortOrder: 2,
      },
    }),
  ])
  console.log(`✓ ${banners.length} banners creados`)

  // ─────────────────────────────────────────────────────────────────────────
  // 8. NAVIGATION MENU
  // ─────────────────────────────────────────────────────────────────────────

  const mainMenu = await prisma.menu.upsert({
    where: { handle: 'main-nav' },
    update: {},
    create: {
      name: 'Navegación Principal',
      handle: 'main-nav',
      isActive: true,
    },
  })

  const menuItems = [
    { label: 'Smartphones',    href: '/categorias/smartphones',  sortOrder: 1, icon: 'smartphone' },
    { label: 'Accesorios',     href: '/categorias/accesorios',   sortOrder: 2, icon: 'cable' },
    { label: 'Audio',          href: '/categorias/audio',        sortOrder: 3, icon: 'headphones' },
    { label: 'Tablets',        href: '/categorias/tablets',      sortOrder: 4, icon: 'tablet' },
    { label: 'Servicios',      href: '/servicios',               sortOrder: 5, icon: 'wrench' },
    { label: 'Financiamiento', href: '/financiamiento',          sortOrder: 6, icon: 'credit-card' },
    { label: 'Trade-In',       href: '/trade-in',                sortOrder: 7, icon: 'refresh-cw' },
    { label: 'Sucursales',     href: '/sucursales',              sortOrder: 8, icon: 'map-pin' },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: `menu-main-${item.sortOrder}` },
      update: {},
      create: {
        id: `menu-main-${item.sortOrder}`,
        menuId: mainMenu.id,
        label: item.label,
        href: item.href,
        icon: item.icon,
        sortOrder: item.sortOrder,
      },
    })
  }
  console.log(`✓ Menú principal con ${menuItems.length} ítems creado`)

  console.log('\n✅ Seed completado exitosamente!')
  console.log('   Categorías: 5')
  console.log('   Marcas:     5')
  console.log('   Productos:  12')
  console.log('   Sucursales: 3')
  console.log('   Financiamiento: 3')
  console.log('   Configs:    16')
  console.log('   Banners:    2')
  console.log('   Menú:       8 ítems')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
