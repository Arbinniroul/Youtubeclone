import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const StudioSidebarHeader=()=>{
    const {user}=useUser();
    const { state}=useSidebar();
    if(!user) {return (
        <SidebarHeader className='flex items-center justify-center pb-4 '>
          <Skeleton className="size-[112px] rounded-full"/>
          <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[60px]"></Skeleton>
          <Skeleton className="h-4 w-[100px]"></Skeleton>
          </div>
        </SidebarHeader>
    );
}
if(state==='collapsed' )
{
    return(
        <SidebarMenuItem className="flex items-center h-10 justify-center mb-4 pr-3">
            
            <SidebarMenuButton tooltip='Your Profile' asChild>
             <Link href='/users/current'>
             <UserAvatar
             imageUrl={user?.imageUrl}
             name={user?.fullName??"User"}
             size="sm"

             />
             <span className="text-sm">Your Profile</span>
             </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
    return(
        <SidebarHeader className='flex items-center justify-center pb-4'>
          <Link href='/user/current'>
            <UserAvatar
            imageUrl={user?.imageUrl}
            name={user?.fullName ??"User"}
            classname="size-[112px] hover:capacity-80 transition-opacity"
            />
            </Link>
            <div className="flex flex-col items-center mt-2">
            
                <p className="text-sm font-medium">
                    Your Profile
                </p>
                <p className="text-sm text-muted-foreground">{user?.fullName}</p>
            </div>
        </SidebarHeader>
    )
}

export default StudioSidebarHeader;