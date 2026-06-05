import { getPosCatalog } from "@/lib/data";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [posCatalog] = await Promise.all([getPosCatalog()]);
  return <View posCatalog={posCatalog} />;
}
