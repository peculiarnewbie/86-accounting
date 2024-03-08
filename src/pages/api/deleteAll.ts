import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { transactions } from "../../../db/schema";

export async function POST(context: APIContext) {
    const runtime = context.locals.runtime;

    const db = drizzle(runtime.env.D1);

    const formData = await context.request.formData();

    let response;

    if (formData.get("pass") === "yesdeletethemall") {
        response = await db.delete(transactions);
    }

    return Response.json(response);
}
