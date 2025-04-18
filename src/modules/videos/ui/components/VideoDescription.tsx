import { cn } from "@/lib/utils";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react"

interface videoDescriptionProps{
    compactView:string,
    expandedViews:string,
    compactDate:string,
    expandedDate:string,
    description?:string|null
}

export const Videodescription=({compactView,compactDate,expandedViews,description,expandedDate}:videoDescriptionProps)=>{
  
const [isExpanded,setIsExpanded]=useState(false);
return(
    <div onClick={()=>{setIsExpanded((current)=>!current)}} className="bg-secondary/50 rounded-xl cursor-pointer hover:bg-secondary/70 transiton">
<div className="flex gap-2 text-sm ">
<span className="font-medium">
    {
    isExpanded? expandedViews:compactView

    } views
</span>
<span className="font-medium">
    {
    isExpanded? expandedDate:compactDate

    } 
</span>
</div>
<div className="relative">
    <p className={cn("text-sm whitespace-pre-wrap",!isExpanded && "line-clamp-2")}>
        {description || "No Description"}
    </p>
<div className="flex items-center gap-1 mt-4 font-medium">
    {
        isExpanded?(
            <>
            Show Less <ChevronUpIcon className="size-4"/>
            </>
        ):( <>
        Show More <ChevronDownIcon className="size-4"/>
        </>)
    }

</div>
</div>
</div>
)
}