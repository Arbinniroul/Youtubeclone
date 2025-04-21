

import { CategoriesSection } from "../sections/CategoriesSection";
import { ResultSection } from "../sections/ResultSection";



interface pageProps{

        query:string | undefined;
        categoryId:string|undefined

}
export const SearchView=({query,categoryId}:pageProps)=>{

    return(
        <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId}/>
      <ResultSection query={query} categoryId={categoryId}/>
        </div>
    )

}