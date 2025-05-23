import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";


import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface videoMenuProps{
videoId:string,
variant:"ghost"|"secondary"
onRemove:()=>void;
}

export const VideoMenu=({videoId,
    variant="ghost",
    onRemove}:videoMenuProps)=>{
        const onShare=()=>{
            
            const fullUrl=`${APP_URL}/videos/${videoId}`
            navigator.clipboard.writeText(fullUrl);
            toast.success("Link Copied to the Clipboard")

        }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size="icon" className="rounded-full">
                    <MoreVerticalIcon/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  >
                    <DropdownMenuItem onClick={onShare}>
                    <ShareIcon className="mr-2 size-4"/>
                    Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{}}>
                    <ListPlusIcon className="mr-2 size-4"/>
                    Add to Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove}>
                    <Trash2Icon className="mr-2 size-4"/>
                    Remove Item
                    </DropdownMenuItem>
                </DropdownMenuContent>

        </DropdownMenu>
    )
}