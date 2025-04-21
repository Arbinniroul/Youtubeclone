// src/app/page.tsx
import { HydrateClient, trpc } from '@/trpc/server';
import { Homeview } from '@/modules/home/ui/views/home-view';


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

  return (
   <HydrateClient>
     <Homeview categoryId={categoryId}/>
   </HydrateClient>
  );
}
export default Page;