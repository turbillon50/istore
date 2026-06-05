import { getOrders } from "@/lib/data";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [seedOrders] = await Promise.all([getOrders()]);
  return <View seedOrders={seedOrders} />;
}
