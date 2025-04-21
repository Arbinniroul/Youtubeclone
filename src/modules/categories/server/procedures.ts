import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";


export const CategoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {

        try {
            const data = await db.select().from(categories);
            return data;
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            throw new Error("Failed to fetch categories");
        }
    }),
});