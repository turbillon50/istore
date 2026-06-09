"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: "Nuevo" | "Hot" | "Oferta" | "Agotado";
  slug: string;
  onAddToCart?: (id: string) => void;
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-3 h-3"
            fill={star <= Math.round(rating) ? "#ffb77d" : "transparent"}
            stroke={star <= Math.round(rating) ? "#ffb77d" : "#ffffff30"}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-white/30">({count})</span>
      )}
    </div>
  );
}

const badgeConfig = {
  Nuevo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Hot: "bg-red-500/20 text-red-300 border-red-500/30",
  Oferta: "bg-[#ff8c00]/20 text-[#ffb77d] border-[#ff8c00]/30",
  Agotado: "bg-white/10 text-white/40 border-white/10",
};

export default function ProductCard({
  id,
  name,
  brand,
  price,
  comparePrice,
  image,
  rating = 4.5,
  reviewCount,
  badge,
  slug,
  onAddToCart,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discountPercent =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#ff8c00]/30 hover:bg-white/[0.05] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,140,0,0.1)]"
    >
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
        aria-label="Agregar a favoritos"
      >
        <Heart
          className="w-4 h-4 transition-colors"
          fill={isWishlisted ? "#ff8c00" : "transparent"}
          stroke={isWishlisted ? "#ff8c00" : "white"}
        />
      </button>

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeConfig[badge]}`}
          >
            {badge === "Oferta" && discountPercent
              ? `-${discountPercent}%`
              : badge}
          </span>
        </div>
      )}

      <Link href={`/productos/${slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </motion.div>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-white/20 transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <Eye className="w-4 h-4" />
              Vista rápida
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs font-semibold text-[#ffb77d]/70 uppercase tracking-wider mb-1">
            {brand}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#ffb77d] transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={rating} count={reviewCount} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-white">
              ${price.toLocaleString("es-MX")}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-white/35 line-through">
                ${comparePrice.toLocaleString("es-MX")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={badge === "Agotado"}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            badge === "Agotado"
              ? "bg-white/5 text-white/30 cursor-not-allowed"
              : addedToCart
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:scale-[1.02]"
          }`}
        >
          {badge === "Agotado" ? (
            "Sin stock"
          ) : addedToCart ? (
            "Agregado al carrito"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Agregar al carrito
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
