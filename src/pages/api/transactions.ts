import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { transactions, type DataType } from "../../../db/schema";

export async function GET(context: APIContext) {
    const runtime = context.locals.runtime;

    const db = drizzle(runtime.env.D1);

    const data = (await db.select().from(transactions).limit(5)) as DataType[];

    return Response.json(data);
}
