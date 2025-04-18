import { current } from "@reduxjs/toolkit";
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
<div onClick={()=>{setIsExpanded((current)=>!current)}} className="bg-secondary/50 rounded-xl cursor-pointer hover:bg-secondary/70 transiton">
<div className="flex gap-2 text-sm ">
<span className="font-medium">
    {
    isExpanded? expandedViews:compactView

    }views
</span>
<span className="font-medium">
    {
    isExpanded? expandedDate:compactDate

    }views
</span>
</div>
<div>
    
</div>
</div>
}