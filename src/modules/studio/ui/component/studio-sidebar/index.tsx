"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"



import Link from "next/link"
import { LogOutIcon, VideoIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import StudioSidebarHeader from "./studiosidebarHeader"



const StudioSidebar = () => {
  const pathname=usePathname();
  return (
    <Sidebar className="pt-20 z-10 shadow-md" collapsible="icon">
        <SidebarContent className="bg-background">


          <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader/>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname==="/studio"} tooltip="Exit Studio" asChild>
              <Link href="/studio">
              <VideoIcon className="size-4"/>
              <span className="text-sm">Content</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Exit Studio" asChild>
              <Link href="/">
              <LogOutIcon className="size-4"/>
              <span className="text-sm">Exit studio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
         
          </SidebarMenu>
          </SidebarGroup>
          
        </SidebarContent>
        

        
    </Sidebar>
  )
}

export default StudioSidebar