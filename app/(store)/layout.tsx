import type { Metadata } from "next";
import Navbar from "@/components/store/navbar";
import Footer from "@/components/store/footer";
import AIAssistant from "@/components/store/ai-assistant";

export const metadata: Metadata = {
  title: {
    default: "iStore Pro — Tecnología que inspira",
    template: "%s | iStore Pro",
  },
  description:
    "Los mejores smartphones, accesorios y servicios tecnológicos de México. Financiamiento sin buró, envíos a todo el país.",
  keywords: ["iphone", "samsung", "celulares", "smartphones", "accesorios", "mexico"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://i-store.shop",
    siteName: "iStore Pro",
    title: "iStore Pro — Tecnología que inspira",
    description: "Los mejores smartphones, accesorios y servicios tecnológicos de México.",
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#131313] flex flex-col">
      <Navbar />
      <main className="fl