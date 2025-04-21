import { CategoriesSection } from "../sections/category-section";
import { HomeVideoSection } from "../sections/home-video-section";

interface homeviewProps{
    categoryId?:string;

}



export const Homeview = ({categoryId}:homeviewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId}/>
      <HomeVideoSection categoryId={categoryId}/>
    </div>
  )
}

