import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioNavbar } from "../component/studio-navbar";

import StudioSidebar from "../component/studio-sidebar";

interface SLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: SLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar /> 
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
