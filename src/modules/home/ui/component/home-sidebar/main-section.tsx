"use client"; // Corrected directive for Next.js 13+ Client Components

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { HomeIcon, PlaySquareIcon, FlameIcon } from "lucide-react"; // Import icons (replace with your actual icon library)
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon, 
  },
  {
    title: "Subscription",
    url: "/feed/subscribed",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon, 
  },
];

const MainSection = () => {
  const pathname=usePathname();
  const {isSignedIn}=useAuth()
  const clerk=useClerk();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton

                tooltip={item.title}
                asChild
                isActive={pathname===item.url} 
                onClick={(e) => {
                   if(!isSignedIn && item.auth){
                    e.preventDefault();
                    return clerk.openSignIn();
                   }
                }}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" /> {/* Render the icon */}
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default MainSection;