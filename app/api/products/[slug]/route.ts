import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/db'

interface RouteParams {
  params: { slug: string }
}

// ─── GET /api/products/[slug] ─────────────────────────────────────────────────

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Compute review average
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : null

    return NextResponse.json({
      data: {
        ...product,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        totalReviews: product._count.reviews,
        totalSold: product._count.orderItems,
      },
    })
  } catch (error) {
    console.error('[GET /api/products/[slug]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
