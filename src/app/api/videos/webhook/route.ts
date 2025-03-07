
import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/musk";
import { VideoAssetCreatedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent } from "@mux/mux-node/resources/webhooks"
import { eq } from "drizzle-orm";

const SIGNING_SECRET=process.env.MUX_WEBHOOK_SECRET
 import { headers } from "next/headers";
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
        break
    }
 }
 return new Response('Webhook received', { status: 200 })

}