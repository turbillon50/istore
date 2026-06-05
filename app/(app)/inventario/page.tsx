import { getProducts } from "@/lib/data";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [products] = await Promise.all([getProducts()]);
  return <View products={products} />;
}
