"use client"; // Corrected directive for Next.js 13+ Client Components

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react"; // Import icons (replace with your actual icon library)
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
const items = [
  {
    title: "History",
    url: "/playlist/history",
    icon: HistoryIcon,
    auth: true, // Use the imported icon component
  },
  {
    title: "Liked Videos",
    url: "/playlist/liked",
    icon: ThumbsUpIcon,
    auth: true, // Use the imported icon component
  },
  {
    title: "All Playlists",
    url: "/playlist",
    icon: ListVideoIcon, // Use the imported icon component
    auth: true,
  },
 
];

const PersonalSection = () => {
  const {isSignedIn}=useAuth()
  const clerk=useClerk();
  return (
   
    <SidebarGroup>
        <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false} //TODO: change to look at current pathname
                onClick={(e) => {
                  if(!isSignedIn && item.auth){
                   e.preventDefault();
                   return clerk.openSignIn();
                  }
               }}//TODO : Do something on click
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

export default PersonalSection;