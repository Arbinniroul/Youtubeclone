"use client"; // Corrected directive for Next.js 13+ Client Components

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { HomeIcon, PlaySquareIcon, FlameIcon } from "lucide-react"; // Import icons (replace with your actual icon library)

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon, // Use the imported icon component
  },
  {
    title: "Subscription",
    url: "/feed/subscription",
    icon: PlaySquareIcon, // Use the imported icon component
    auth: true,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon, // Use the imported icon component
  },
];

const MainSection = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} //TODO: change to look at current pathname
                onClick={() => {}}//TODO : Do something on click
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