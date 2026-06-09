import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  slug: string;
  rating: number;
  reviewCount: number;
}

interface AssistantRequest {
  message: string;
  context?: {
    productId?: string;
    categoryId?: string;
    cartItems?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

// ──────────────────────────────────────────────
// Product catalog for RAG-lite (in prod: fetch from DB)
// ──────────────────────────────────────────────

const PRODUCT_CATALOG: ProductSummary[] = [
  {
    id: "prod_01",
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    price: 27999,
    comparePrice: 32999,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400&hei=400&fmt=p-jpg",
    slug: "iphone-15-pro-max-256gb",
    rating: 4.8,
    reviewCount: 247,
  },
  {
    id: "prod_02",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    price: 23999,
    comparePrice: 27999,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=400&hei=400&fmt=p-jpg",
    slug: "iphone-15-pro-256gb",
    rating: 4.7,
    reviewCount: 189,
  },
  {
    id: "prod_03",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 29999,
    comparePrice: 34999,
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-ultra-s928-sm-s928bzadeub-thumb-539573242?$344_344_PNG$",
    slug: "samsung-galaxy-s24-ultra",
    rating: 4.6,
    reviewCount: 134,
  },
  {
    id: "prod_04",
    name: "AirPods Pro (2da generación)",
    brand: "Apple",
    price: 4999,
    comparePrice: 5999,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=jpeg",
    slug: "airpods-pro-2",
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: "prod_05",
    name: "MacBook Air M2 15\"",
    brand: "Apple",
    price: 32999,
    comparePrice: 37999,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mqkr3?wid=400&hei=400&fmt=jpeg",
    slug: "macbook-air-m2-15",
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: "prod_06",
    name: "iPad Pro 11\" M4",
    brand: "Apple",
    price: 19999,
    comparePrice: 23999,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-cell-spacegray-202210?wid=400&hei=400&fmt=jpeg",
    slug: "ipad-pro-11-m4",
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "prod_07",
    name: "Apple Watch Series 9 41mm",
    brand: "Apple",
    price: 9999,
    comparePrice: 12499,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT2Y3?wid=400&hei=400&fmt=jpeg",
    slug: "apple-watch-series-9-41mm",
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "prod_08",
    name: "Samsung Galaxy S24+",
    brand: "Samsung",
    price: 23999,
    comparePrice: 27999,
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s926bzadeub-345154082?$344_344_PNG$",
    slug: "samsung-galaxy-s24-plus",
    rating: 4.5,
    reviewCount: 87,
  },
];

// ──────────────────────────────────────────────
// RAG-lite: simple keyword matching
// ──────────────────────────────────────────────

function findRelevantProducts(query: string, limit = 3): ProductSummary[] {
  const q = query.toLowerCase();
  const scored = PRODUCT_CATALOG.map((p) => {
    let score = 0;
    if (q.includes(p.brand.toLowerCase())) score += 3;
    if (p.name.toLowerCase().includes(q)) score += 5;
    const terms = q.split(/\s+/);
    for (const term of terms) {
      if (term.length > 2 && p.name.toLowerCase().includes(term)) score += 2;
    }
    // Category keywords
    if ((q.includes("auricular") || q.includes("earphone") || q.includes("airpod")) && p.name.toLowerCase().includes("airpod")) score += 4;
    if ((q.includes("watch") || q.includes("reloj") || q.includes("smartwatch")) && p.name.toLowerCase().includes("watch")) score += 4;
    if ((q.includes("tablet") || q.includes("ipad")) && p.name.toLowerCase().includes("ipad")) score += 4;
    if ((q.includes("laptop") || q.includes("mac") || q.includes("computadora")) && p.name.toLowerCase().includes("macbook")) score += 4;
    if ((q.includes("celular") || q.includes("teléfono") || q.includes("smartphone") || q.includes("phone")) && (p.name.toLowerCase().includes("iphone") || p.name.toLowerCase().includes("galaxy"))) score += 2;
    if (q.includes("barato") || q.includes("económico")) score += (p.price < 15000 ? 3 : 0);
    if (q.includes("caro") || q.includes("premium") || q.includes("mejor")) score += (p.price > 20000 ? 2 : 0);
    return { ...p, score };
  });

  return scored
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ──────────────────────────────────────────────
// System prompt builder
// ──────────────────────────────────────────────

function buildSystemPrompt(relevantProducts: ProductSummary[]): string {
  const productContext = relevantProducts.length > 0
    ? `\n\nProductos relevantes del catálogo:\n${relevantProducts.map((p) =>
        `- ${p.name} (${p.brand}): $${p.price.toLocaleString("es-MX")} MXN${p.comparePrice ? ` (antes $${p.comparePrice.toLocaleString("es-MX")})` : ""} · Rating: ${p.rating}/5 · Slug: ${p.slug}`
      ).join("\n")}`
    : "";

  return `Eres Iris, la asistente de ventas de iStore Pro — una tienda de tecnología premium en México. Eres amable, conocedora y orientada a ayudar al cliente a encontrar el producto perfecto.

Tu personalidad:
- Entusiasta de la tecnología pero accesible
- Directa y útil — no das rodeos
- Hablas español mexicano natural (sin anglicismos innecesarios)
- Siempre ofreces opciones cuando el cliente tiene dudas

Lo que puedes hacer:
- Recomendar productos según necesidades y presupuesto
- Comparar especificaciones entre dispositivos
- Explicar financiamiento (hasta 12 meses sin intereses, Kueski Pay sin buró)
- Informar sobre el Trade-In (hasta $18,500 por equipo usado)
- Explicar el servicio técnico (reparaciones con garantía)
- Responder preguntas sobre envíos, garantías y devoluciones

Políticas:
- Envío gratis en pedidos mayores a $999 MXN
- Devoluciones en 30 días
- Garantía oficial de fábrica en todos los productos
- Todos los productos son nuevos y sellados de fábrica

Formato de respuestas:
- Sé concisa (máximo 3-4 párrafos)
- Cuando menciones productos, usa sus slugs en formato [Nombre del producto](/productos/slug)
- Si el cliente menciona un presupuesto, sugiere las mejores opciones en ese rango
${productContext}

Recuerda: tu objetivo es ayudar al cliente a encontrar lo que necesita, no simplemente vender. Si el cliente no necesita el producto más caro, díselo.`;
}

// ──────────────────────────────────────────────
// POST handler — streaming
// ──────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: AssistantRequest = await req.json();
    const { message, context, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    // RAG-lite: find relevant products
    const relevantProducts = findRelevantProducts(message);

    // Augment query with cart context
    let contextualMessage = message;
    if (context?.cartItems && context.cartItems.length > 0) {
      const cartSummary = context.cartItems.map((i) => `${i.name} x${i.quantity}`).join(", ");
      contextualMessage = `[Contexto: el usuario tiene en el carrito: ${cartSummary}]\n\n${message}`;
    }

    // Build messages array
    const messages = [
      { role: "system", content: buildSystemPrompt(relevantProducts) },
      ...conversationHistory.slice(-8), // Keep last 8 turns
      { role: "user", content: contextualMessage },
    ];

    // Determine if using OpenRouter or OpenAI
    const isOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const baseUrl = isOpenRouter
      ? "https://openrouter.ai/api/v1"
      : "https://api.openai.com/v1";
    const model = isOpenRouter
      ? "anthropic/claude-3-5-haiku"
      : "gpt-4o-mini";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    if (isOpenRouter) {
      headers["HTTP-Referer"] = "https://i-store.shop";
      headers["X-Title"] = "iStore Pro AI Assistant";
    }

    // Stream response
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error("AI API error:", upstream.status, errorText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    // Pipe stream + inject suggested products at the end
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullText += delta;
                  // Forward text chunk
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "text", content: delta })}\n\n`
                    )
                  );
                }
              } catch {
                // Skip malformed JSON chunks
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // Send suggested products at end of stream
        if (relevantProducts.length > 0) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "products",
                products: relevantProducts,
              })}\n\n`
            )
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Assistant route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
