// src/app/page.tsx
import { HydrateClient, trpc } from '@/trpc/server';
import { Homeview } from '@/modules/home/ui/views/home-view';
import { DEFAULT_LIMIT } from '@/constants';


export const dynamic="force-dynamic";


interface pageProps{
  searchParams:Promise<{
    categoryId?:string;
  }>

}
 const Page=async({searchParams}:pageProps)=> {
  const {categoryId}=await searchParams;
  
  // Call the `hello` procedure on the server
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({categoryId,limit:DEFAULT_LIMIT})

  return (
   <HydrateClient>
     <Homeview categoryId={categoryId}/>
   </HydrateClient>
  );
}
export default Page;