"use client"
import MuxPlayer from "@mux/mux-player-react";
;

interface videoPlayerProps{
    playbackId?:string | null | undefined;
    thumbnailUrl?:string | null | undefined;
    autoplay?:string |null | undefined;
    onPlay?:()=>void;
}

export const VideoPlayer=({playbackId,thumbnailUrl, autoplay, onPlay}:videoPlayerProps)=>{
    if(!playbackId){
        return null;
    }
    return(
        <MuxPlayer
         playbackId={playbackId}
          playerInitTime={0} 
          poster={thumbnailUrl || "/placeholder.svg"} 
          autoPlay={autoplay} 
          onPlay={onPlay}
           thumbnailTime={0}
           className="w-full h-full object-contain "
            accentColor="#FF2056" />
    )
}