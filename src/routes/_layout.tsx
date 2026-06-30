import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, MobileNav } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_layout")({
  component: LayoutShell,
});

function LayoutShell() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <Toaster theme="dark" />
    </div>
  );
}
