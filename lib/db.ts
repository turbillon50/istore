import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string
  brand?: string
  status?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sortBy?: 'price' | 'name' | 'createdAt' | 'stock'
  sortOrder?: 'asc' | 'desc'
}

export interface OrderFilters {
  userId?: string
  status?: string
  paymentStatus?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
  page?: number
  limit?: number
}

export interface InventoryFilters {
  lowStock?: boolean
  outOfStock?: boolean
  productId?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}) {
  const {
    category,
    brand,
    status,
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters

  const where: Prisma.ProductWhereInput = {
    ...(status ? { status } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand: { slug: brand } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          basePrice: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === 'stock'
      ? { inventory: { _count: sortOrder } }
      : { [sortBy]: sortOrder }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: {
          where: { isActive: true },
          select: { id: true, name: true, price: true, compareAtPrice: true },
        },
        inventory: {
          select: { quantity: true, reserved: true },
        },
        _count: { select: { reviews: true } },
      },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    } satisfies PaginationMeta,
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: {
        where: { isActive: true },
        include: {
          inventory: true,
        },
        orderBy: { sortOrder: 'asc' },
      },
      inventory: true,
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true, orderItems: true } },
    },
  })

  return product
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  })
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export async function getBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getOrders(filters: OrderFilters = {}) {
  const {
    userId,
    status,
    paymentStatus,
    search,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = filters

  const where: Prisma.OrderWhereInput = {
    ...(userId ? { userId } : {}),
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { user: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {}),
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: { take: 1 } } },
          },
        },
        address: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    } satisfies PaginationMeta,
  }
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export async function getInventory(filters: InventoryFilters = {}) {
  const { lowStock, outOfStock, productId, search, page = 1, limit = 50 } = filters

  const where: Prisma.InventoryItemWhereInput = {
    ...(productId ? { productId } : {}),
    ...(outOfStock ? { quantity: { lte: 0 } } : {}),
    ...(lowStock && !outOfStock
      ? {
          AND: [
            { quantity: { gt: 0 } },
            { quantity: { lte: prisma.inventoryItem.fields.minStock } },
          ],
        }
      : {}),
    ...(search
      ? {
          OR: [
            { product: { name: { contains: search, mode: 'insensitive' } } },
            { product: { sku: { contains: search, mode: 'insensitive' } } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [total, items] = await Promise.all([
    prisma.inventoryItem.count({ where }),
    prisma.inventoryItem.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { quantity: 'asc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            slug: true,
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
          },
        },
        variant: { select: { id: true, name: true, sku: true } },
      },
    }),
  ])

  const lowStockItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minStock,
  )
  const outOfStockItems = items.filter((item) => item.quantity <= 0)

  const totalPages = Math.ceil(total / limit)

  return {
    data: items,
    alerts: {
      lowStock: lowStockItems.length,
      outOfStock: outOfStockItems.length,
    },
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    } satisfies PaginationMeta,
  }
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [
    totalOrders,
    ordersThisMonth,
    ordersLastMonth,
    ordersToday,
    revenueThisMonth,
    revenueLastMonth,
    revenueToday,
    pendingOrders,
    totalCustomers,
    newCustomersThisMonth,
    totalProducts,
    activeProducts,
    lowStockCount,
    outOfStockCount,
    pendingServiceRequests,
    openLeads,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        paymentStatus: 'PAID',
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({
      where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } },
    }),
    prisma.product.count(),
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.inventoryItem.count({
      where: {
        AND: [
          { quantity: { gt: 0 } },
          { quantity: { lte: prisma.inventoryItem.fields.minStock } },
        ],
      },
    }),
    prisma.inventoryItem.count({ where: { quantity: { lte: 0 } } }),
    prisma.serviceRequest.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    prisma.lead.count({ where: { status: { in: ['NEW', 'CONTACTED'] } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  const revenueGrowth =
    revenueLastMonth._sum.total && revenueLastMonth._sum.total > 0
      ? (((revenueThisMonth._sum.total ?? 0) - revenueLastMonth._sum.total) /
          revenueLastMonth._sum.total) *
        100
      : 0

  const ordersGrowth =
    ordersLastMonth > 0 ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 : 0

  return {
    revenue: {
      today: revenueToday._sum.total ?? 0,
      thisMonth: revenueThisMonth._sum.total ?? 0,
      lastMonth: revenueLastMonth._sum.total ?? 0,
      growth: Math.round(revenueGrowth * 100) / 100,
    },
    orders: {
      total: totalOrders,
      today: ordersToday,
      thisMonth: ordersThisMonth,
      lastMonth: ordersLastMonth,
      pending: pendingOrders,
      growth: Math.round(ordersGrowth * 100) / 100,
    },
    customers: {
      total: totalCustomers,
      newThisMonth: newCustomersThisMonth,
    },
    products: {
      total: totalProducts,
      active: activeProducts,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
    },
    service: {
      pending: pendingServiceRequests,
    },
    leads: {
      open: openLeads,
    },
    recentOrders,
    topProductIds: topProducts.map((p) => ({
      productId: p.productId,
      totalSold: p._sum.quantity ?? 0,
    })),
  }
}
