
import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/musk";
import { VideoAssetCreatedWebhookEvent, VideoAssetDeletedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent } from "@mux/mux-node/resources/webhooks"
import { eq } from "drizzle-orm";

const SIGNING_SECRET=process.env.MUX_WEBHOOK_SECRET
 import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
type WebhookEvent=
|VideoAssetCreatedWebhookEvent
|VideoAssetReadyWebhookEvent
|VideoAssetErroredWebhookEvent
|VideoAssetTrackReadyWebhookEvent;
export const POST=async(request:Request)=>{
    if(!SIGNING_SECRET){
        throw new Error('Error: Please add MUX_WEBHOOK_SECRET to your environment variables')
    }
 const headerPayload=await headers();
 const muxSignature=headerPayload.get("mux-signature")

 if(!muxSignature){
     throw new Error("Missing Mux Signature in request headers")
 }
 const payload=await request.json();
 const body=JSON.stringify(payload);
 mux.webhooks.verifySignature(
    body,{
        "mux-signature":muxSignature,
    },
    SIGNING_SECRET,
 )
 switch(payload.type as WebhookEvent["type"]) {
    case "video.asset.created":{
        const  data=payload.data as VideoAssetCreatedWebhookEvent["data"];
        if(!data){
           return new Response("No upload id found",{status:400})
        }
        await db
        .update(videos)
        .set({
            muxAssetId:data.id,
            muxStatus:"created",
        })
        .where(eq(videos.muxUploadId,data.upload_id))
        break;
    }
    case "video.asset.ready":{
        const  data=payload.data as VideoAssetReadyWebhookEvent["data"];
        const playbackId=data.playback_ids?.[0].id;
        if(!data.upload_id){
            return new Response("No upload id found",{status:400})
        }
        if(!playbackId){
            return new Response("No playback id found",{status:400})
        }
        const tempThumbnailUrl=`https://image.mux.com/${playbackId}/thumbnail.jpg`;
        const tempPreviewUrl=`https://image.mux.com/${playbackId}/animated.gif`;
        const duration=data.duration ? Math.round(data.duration * 1000) : 0;

        const utapi=new UTApi();
        const [uploadedThumbnail,uploadedPreview]=await utapi.uploadFilesFromUrl([
            tempThumbnailUrl,
            tempPreviewUrl]
)
        if(!uploadedThumbnail.data|| !uploadedPreview.data){
            return new Response("Failed to Upload thumbnail or preview",{status:500})
        }
        const {key:thumbnailKey,url:thumbnailUrl}=uploadedThumbnail.data
        const {key:previewKey,url:previewUrl}=uploadedPreview.data
        await db
        .update(videos)
        .set({
            muxStatus:data.status,
            muxPlaybackId:playbackId,
            muxassetId:data.id,
            thumbnailUrl,
            thumbnailKey,
            previewUrl,
            previewKey,
            duration,
        })
        .where(eq(videos.muxUploadId,data.upload_id))
        break;
    }
case "video.asset.errored":{
    const data=payload.data as VideoAssetErroredWebhookEvent["data"]
    if(!data.upload_id){
        return new Response("No upload id found",{status:400})
    }
    await db
    .update(videos)
    .set({
        muxStatus:data.status,
    })
    .where(eq(videos.muxUploadId,data.upload_id))
    break;
    }
 case "video.asset.deleted":{
    const data=payload.data as VideoAssetDeletedWebhookEvent["data"]
    if(!data.upload_id){
        return new Response("No upload id found",{status:400})
    }
    await db
    .delete(videos)
    .where(eq(videos.muxUploadId,data.upload_id))
    break;
   
 }
 }
 return new Response('Webhook received', { status: 200 })

}