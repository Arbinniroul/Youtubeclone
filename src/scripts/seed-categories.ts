import { db } from "@/db";
import { categories } from "@/db/schema";

//TODO:CReate a script to seed categories
const categoriesName=[
    "Cars and vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Business",
    "Sports",
    "Music",
    "Health",
    "Family",
    "Science",
    "Technology",
    "Travel",
    "Pets",
    "Movies",
    "Hobbies",
    "Art",
    "Religion",
    "Lifestyle",
    "Relationships",
    "Politics",

]

async function main(){
    console.log("Seeding categories")
    try {
        const values=categoriesName.map((name)=>({
            name,
            description:`Videos related to ${name.toLowerCase()}`
        }))
        await db.insert(categories).values(values);
        console.log("Categories seeded successfully ")
    } catch (error) {
        console.log("Error seeding categories",error);
        process.exit(1);
    }
}
 
main()