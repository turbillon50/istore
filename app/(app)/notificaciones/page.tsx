import { getNotifications } from "@/lib/data";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [notifications] = await Promise.all([getNotifications()]);
  return <View notifications={notifications} />;
}
