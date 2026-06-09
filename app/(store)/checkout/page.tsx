"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  CreditCard,
  Truck,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  ArrowLeft,
  Banknote,
  Star,
  Package,
  AlertCircle,
} from "lucide-react";

// ──────────────────────────────────────────────
// Zod schemas per step
// ──────────────────────────────────────────────

const datosSchema = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().regex(/^[0-9+\s\-]{10,15}$/, "Teléfono inválido"),
  street: z.string().min(5, "Ingresa la calle y número"),
  colony: z.string().min(3, "Ingresa la colonia"),
  city: z.string().min(2, "Ingresa la ciudad"),
  state: z.string().min(2, "Selecciona el estado"),
  zip: z.string().regex(/^[0-9]{5}$/, "Código postal inválido (5 dígitos)"),
  references: z.string().optional(),
});

type DatosForm = z.infer<typeof datosSchema>;

// ──────────────────────────────────────────────
// Mock order items
// ──────────────────────────────────────────────

const ORDER_ITEMS = [
  {
    id: "ci_1",
    name: "iPhone 15 Pro Max 256GB",
    variant: "Natural Titanium / 256GB",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=p-jpg&.v=1693009283816",
    price: 27999,
    quantity: 1,
  },
  {
    id: "ci_2",
    name: "AirPods Pro (2da generación)",
    variant: "Blanco / USB-C",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg",
    price: 4999,
    quantity: 1,
  },
];

const MX_STATES = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato",
  "Guerrero", "Hidalgo", "Jalisco", "Estado de México", "Michoacán", "Morelos",
  "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
  "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
  "Veracruz", "Yucatán", "Zacatecas",
];

// ──────────────────────────────────────────────
// Step definitions
// ──────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Envío" },
  { id: 3, label: "Pago" },
  { id: 4, label: "Confirmación" },
];

// ──────────────────────────────────────────────
// Shipping options
// ──────────────────────────────────────────────

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Envío estándar",
    description: "3-5 días hábiles",
    price: 0,
    icon: Truck,
    badge: "Gratis",
  },
  {
    id: "express",
    name: "Envío express",
    description: "1-2 días hábiles",
    price: 249,
    icon: Package,
    badge: null,
  },
  {
    id: "pickup",
    name: "Recoger en tienda",
    description: "Disponible hoy — Sucursal Centro",
    price: 0,
    icon: Building2,
    badge: "Gratis",
  },
];

// ──────────────────────────────────────────────
// Payment options
// ──────────────────────────────────────────────

const PAYMENT_OPTIONS = [
  { id: "card", label: "Tarjeta de crédito / débito", icon: CreditCard },
  { id: "mercadopago", label: "MercadoPago", icon: Star },
  { id: "cash", label: "Pago en efectivo (OXXO / 7-Eleven)", icon: Banknote },
];

// ──────────────────────────────────────────────
// Field component
// ──────────────────────────────────────────────

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white/70">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#ff8c00]/40 focus:bg-white/[0.06] transition-all ${className}`}
    />
  );
}

function Select({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff8c00]/40 transition-all appearance-none ${className}`}
    >
      {children}
    </select>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber] = useState(() => `ISP-${Date.now().toString().slice(-8)}`);

  // RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<DatosForm>({
    resolver: zodResolver(datosSchema),
  });

  // Calculations
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const selectedShipping = SHIPPING_OPTIONS.find((o) => o.id === shippingOption)!;
  const shippingCost = selectedShipping.price;
  const total = subtotal - couponDiscount + shippingCost;

  const applyCoupon = async () => {
    setCouponError("");
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setCouponLoading(false);
    const codes: Record<string, number> = { ISTORE10: 0.1, PROMO15: 0.15 };
    const upper = coupon.toUpperCase().trim();
    if (codes[upper]) {
      setAppliedCoupon({ code: upper, discount: codes[upper] });
      setCoupon("");
    } else {
      setCouponError("Cupón no válido");
    }
  };

  const onDatosSubmit = () => setCurrentStep(2);
  const onShippingNext = () => setCurrentStep(3);
  const onPaymentNext = async () => {
    setCurrentStep(4);
    setOrderConfirmed(true);
  };

  // Confirmation screen
  if (orderConfirmed && currentStep === 4) {
    return (
      <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-3">¡Pedido confirmado!</h1>
          <p className="text-white/60 mb-2">
            Tu pedido <span className="text-white font-bold">{orderNumber}</span> ha sido recibido.
          </p>
          <p className="text-white/50 text-sm mb-8">
            Recibirás un correo de confirmación en {getValues("email") || "tu correo"} con todos los detalles.
          </p>

          {/* Order summary */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6 text-left">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/50">Número de pedido</span>
              <span className="font-bold text-white">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/50">Total</span>
              <span className="font-bold text-white">${total.toLocaleString("es-MX")} MXN</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Envío estimado</span>
              <span className="font-bold text-white">{selectedShipping.description}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/pedidos"
              className="w-full py-3.5 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl text-center"
            >
              Ver mis pedidos
            </Link>
            <Link
              href="/"
              className="w-full py-3.5 bg-white/[0.05] border border-white/10 text-white font-semibold rounded-xl text-center hover:bg-white/[0.08] transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/carrito" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Carrito
          </Link>
          <h1 className="text-xl font-black text-white">Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div
                    animate={{
                      backgroundColor:
                        currentStep > step.id
                          ? "#22c55e"
                          : currentStep === step.id
                          ? "#ff8c00"
                          : "transparent",
                      borderColor:
                        currentStep > step.id
                          ? "#22c55e"
                          : currentStep === step.id
                          ? "#ff8c00"
                          : "rgba(255,255,255,0.15)",
                    }}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm"
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={currentStep === step.id ? "text-black" : "text-white/30"}>
                        {step.id}
                      </span>
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium hidden sm:block ${currentStep === step.id ? "text-[#ffb77d]" : "text-white/30"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-1 transition-colors ${currentStep > step.id ? "bg-green-500" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main form area ── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Datos ── */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit(onDatosSubmit)}
                  className="space-y-6"
                >
                  {/* Contact */}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/15 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#ffb77d]" />
                      </div>
                      <h2 className="font-bold text-white">Información de contacto</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormField label="Correo electrónico" error={errors.email?.message}>
                          <Input
                            {...register("email")}
                            type="email"
                            placeholder="tu@correo.com"
                            autoComplete="email"
                          />
                        </FormField>
                      </div>
                      <FormField label="Nombre" error={errors.firstName?.message}>
                        <Input
                          {...register("firstName")}
                          placeholder="Juan"
                          autoComplete="given-name"
                        />
                      </FormField>
                      <FormField label="Apellidos" error={errors.lastName?.message}>
                        <Input
                          {...register("lastName")}
                          placeholder="Pérez García"
                          autoComplete="family-name"
                        />
                      </FormField>
                      <div className="sm:col-span-2">
                        <FormField label="Teléfono" error={errors.phone?.message}>
                          <Input
                            {...register("phone")}
                            type="tel"
                            placeholder="+52 55 1234 5678"
                            autoComplete="tel"
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/15 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#ffb77d]" />
                      </div>
                      <h2 className="font-bold text-white">Dirección de envío</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormField label="Calle y número" error={errors.street?.message}>
                          <Input
                            {...register("street")}
                            placeholder="Av. Insurgentes 1234, Int. 5"
                            autoComplete="street-address"
                          />
                        </FormField>
                      </div>
                      <FormField label="Colonia" error={errors.colony?.message}>
                        <Input
                          {...register("colony")}
                          placeholder="Del Valle"
                        />
                      </FormField>
                      <FormField label="Ciudad" error={errors.city?.message}>
                        <Input
                          {...register("city")}
                          placeholder="Ciudad de México"
                          autoComplete="address-level2"
                        />
                      </FormField>
                      <FormField label="Estado" error={errors.state?.message}>
                        <div className="relative">
                          <Select {...register("state")} defaultValue="">
                            <option value="" disabled className="bg-[#1e1e1e]">Selecciona estado</option>
                            {MX_STATES.map((s) => (
                              <option key={s} value={s} className="bg-[#1e1e1e]">{s}</option>
                            ))}
                          </Select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                      </FormField>
                      <FormField label="Código postal" error={errors.zip?.message}>
                        <Input
                          {...register("zip")}
                          placeholder="06760"
                          maxLength={5}
                          autoComplete="postal-code"
                        />
                      </FormField>
                      <div className="sm:col-span-2">
                        <FormField label="Referencias (opcional)">
                          <Input
                            {...register("references")}
                            placeholder="Entre calles, color de fachada, etc."
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] transition-all"
                  >
                    Continuar al envío
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}

              {/* ── STEP 2: Envío ── */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/15 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-[#ffb77d]" />
                      </div>
                      <h2 className="font-bold text-white">Método de envío</h2>
                    </div>

                    <div className="space-y-3">
                      {SHIPPING_OPTIONS.map((option) => (
                        <motion.button
                          key={option.id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setShippingOption(option.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                            shippingOption === option.id
                              ? "border-[#ff8c00] bg-[#ff8c00]/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${shippingOption === option.id ? "bg-[#ff8c00]/20" : "bg-white/[0.05]"}`}>
                            <option.icon className={`w-5 h-5 ${shippingOption === option.id ? "text-[#ffb77d]" : "text-white/40"}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-white">{option.name}</p>
                            <p className="text-xs text-white/50 mt-0.5">{option.description}</p>
                          </div>
                          <div className="text-right">
                            {option.badge ? (
                              <span className="text-sm font-bold text-emerald-400">{option.badge}</span>
                            ) : (
                              <span className="text-sm font-bold text-white">
                                +${option.price.toLocaleString("es-MX")}
                              </span>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shippingOption === option.id ? "border-[#ff8c00] bg-[#ff8c00]" : "border-white/20"}`}>
                            {shippingOption === option.id && <Check className="w-3 h-3 text-black" />}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-4 bg-white/[0.05] border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Atrás
                    </button>
                    <button
                      onClick={onShippingNext}
                      className="flex-[2] py-4 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] transition-all"
                    >
                      Continuar al pago
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Pago ── */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff8c00]/15 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-[#ffb77d]" />
                      </div>
                      <h2 className="font-bold text-white">Método de pago</h2>
                      <span className="ml-auto flex items-center gap-1 text-xs text-white/40">
                        <Lock className="w-3 h-3" />
                        Pago seguro SSL
                      </span>
                    </div>

                    {/* Payment method tabs */}
                    <div className="space-y-3 mb-6">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setPaymentMethod(opt.id)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            paymentMethod === opt.id
                              ? "border-[#ff8c00] bg-[#ff8c00]/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <opt.icon className={`w-5 h-5 ${paymentMethod === opt.id ? "text-[#ffb77d]" : "text-white/40"}`} />
                          <span className="flex-1 text-sm font-semibold text-white">{opt.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? "border-[#ff8c00] bg-[#ff8c00]" : "border-white/20"}`}>
                            {paymentMethod === opt.id && <Check className="w-3 h-3 text-black" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Card form */}
                    <AnimatePresence mode="wait">
                      {paymentMethod === "card" && (
                        <motion.div
                          key="card-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <FormField label="Número de tarjeta">
                            <div className="relative">
                              <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                            </div>
                          </FormField>
                          <FormField label="Nombre en tarjeta">
                            <Input placeholder="JUAN PÉREZ GARCÍA" />
                          </FormField>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField label="Vencimiento">
                              <Input placeholder="MM/AA" maxLength={5} />
                            </FormField>
                            <FormField label="CVV">
                              <Input placeholder="123" maxLength={4} type="password" />
                            </FormField>
                          </div>
                          <div className="bg-white/[0.03] rounded-xl p-3 flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-white/30" />
                            <p className="text-xs text-white/35">
                              Tus datos de pago están protegidos con cifrado SSL de 256 bits y procesados por Stripe.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "mercadopago" && (
                        <motion.div
                          key="mp-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-6"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-[#009ee3]/15 border border-[#009ee3]/20 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-black text-[#009ee3]">MP</span>
                          </div>
                          <p className="text-sm text-white/60 mb-4">
                            Serás redirigido a MercadoPago para completar tu pago de forma segura.
                          </p>
                          <p className="text-xs text-white/30">
                            Acepta tarjetas, OXXO, transferencia y más.
                          </p>
                        </motion.div>
                      )}

                      {paymentMethod === "cash" && (
                        <motion.div
                          key="cash-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
                        >
                          <p className="text-sm text-amber-300 font-semibold mb-2">¿Cómo funciona?</p>
                          <ol className="text-sm text-white/60 space-y-2 list-decimal list-inside">
                            <li>Confirma tu pedido</li>
                            <li>Recibirás un código de pago por correo</li>
                            <li>Paga en cualquier OXXO o 7-Eleven</li>
                            <li>Tu pedido se procesa en 1-2 horas hábiles tras el pago</li>
                          </ol>
                          <p className="text-xs text-white/30 mt-3">Código expira en 48 horas.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-4 bg-white/[0.05] border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Atrás
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onPaymentNext}
                      className="flex-[2] py-4 bg-gradient-to-r from-[#ff8c00] to-[#ffb77d] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      Confirmar pedido · ${total.toLocaleString("es-MX")}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Order summary sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sticky top-24">
              <h2 className="text-sm font-bold text-white mb-4">Resumen</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white/[0.04] rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff8c00] text-black text-[10px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-white/40">{item.variant}</p>
                    </div>
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      ${(item.price * item.quantity).toLocaleString("es-MX")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              {!appliedCoupon ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Código de descuento"
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#ff8c00]/40 transition-all"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!coupon.trim() || couponLoading}
                    className="px-3 py-2 bg-[#ff8c00]/15 border border-[#ff8c00]/30 text-[#ffb77d] text-xs font-semibold rounded-xl hover:bg-[#ff8c00]/25 transition-all disabled:opacity-50"
                  >
                    {couponLoading ? "..." : <Tag className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2 mb-4">
                  <span className="text-xs text-emerald-400 font-bold">{appliedCoupon.code} (-{Math.round(appliedCoupon.discount * 100)}%)</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-white/30 hover:text-white/60">×</button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-400 mb-3">{couponError}</p>}

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString("es-MX")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento</span>
                    <span>-${couponDiscount.toLocaleString("es-MX")}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/50">
                  <span>Envío</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400">Gratis</span>
                  ) : (
                    <span className="text-white">${shippingCost.toLocaleString("es-MX")}</span>
                  )}
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white text-base">${total.toLocaleString("es-MX")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
