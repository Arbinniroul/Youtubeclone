"use client"
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { SearchIcon, XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [value, setValue] = useState(query);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQuery = value.trim();
    if (!newQuery) return;


    const params = new URLSearchParams();
    

    if (categoryId) {
      params.set("categoryId", categoryId);
    }
    

    params.set("query", newQuery);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-10 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
        />
        {value && (
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500"/>
          </Button>
        )}
      </div>
      <Button
        type="submit"
        variant="secondary"
        className="px-5 py-2.5 rounded-r-full border-l-0"
        disabled={!value.trim()}
      >
        <SearchIcon className="size-5"/>
      </Button>
    </form>
  );
};