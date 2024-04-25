import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { transactions, type DataType } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { dummyData } from "../../../db/dummyData";

export async function GET(context: APIContext) {
    console.log("getTransaction");
    const runtime = context.locals.runtime;

    if (runtime.env.DEV) return Response.json(dummyData[3]);

    const url = new URL(context.request.url);
    const searchParams = new URLSearchParams(url.search);

    const id = searchParams.get("id");

    const db = drizzle(runtime.env.D1);

    let data: DataType;

    if (!id) return Response.json({});
    data = (
        (await db
            .select()
            .from(transactions)
            .where(eq(transactions.id, id))) as DataType[]
    )[0];

    return Response.json(data);
}
