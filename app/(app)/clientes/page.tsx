import { getClients } from "@/lib/data";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [clients] = await Promise.all([getClients()]);
  return <View clients={clients} />;
}
