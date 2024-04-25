import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import { banks, type Bank, type BankType } from "../../../db/schema";

export async function POST(context: APIContext) {
    const runtime = context.locals.runtime;

    console.log(runtime.env.D1);

    const db = drizzle(runtime.env.D1);

    const formData = await context.request.formData();

    const pairs = [];

    for (const pair of formData.entries()) {
        pairs.push([pair[0], pair[1]]);
    }

    const bank: Bank = {
        id: nanoid(),
        name: pairs[0][1] as BankType,
        money: parseInt(pairs[1][1] as string),
    };

    const response = await db
        .insert(banks)
        .values({ ...bank })
        .returning();

    return Response.json(response);
}
