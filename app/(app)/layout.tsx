import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ToastProvider } from "@/components/ui/toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen surface">
        <Sidebar />
        <div className="min-w-0 lg:pl-64">
          <Topbar />
          {/* pb extra en móvil para que el contenido no quede bajo la bottom nav fija */}
          <main className="mx-auto w-full min-w-0 max-w-[1500px] overflow-x-hidden p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
