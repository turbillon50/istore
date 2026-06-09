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
    const reviews = (product as any).reviews ?? []
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
        : null

    return NextResponse.json({
      data: {
        ...product,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        totalReviews: (product as any)._count?.reviews ?? 0,
        totalSold: (product as any)._count?.orderItems ?? 0,
      },
    })
  } catch (error) {
    console.error('[GET /api/products/[slug]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
