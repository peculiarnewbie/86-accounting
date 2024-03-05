import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import {
    transactions,
    type ArahType,
    type BankType,
    type DataType,
    type KategoriType,
} from "../../../db/schema";
import dayjs from "dayjs";

export async function POST(context: APIContext) {
    console.log("sup");

    const runtime = context.locals.runtime;

    console.log(runtime.env.D1);

    const db = drizzle(runtime.env.D1);

    const formData = await context.request.formData();

    const pairs = [];

    for (const pair of formData.entries()) {
        pairs.push([pair[0], pair[1]]);
    }

    const data: DataType = {
        id: nanoid(),
        arah: pairs[0][1] as ArahType,
        bank: pairs[1][1] as BankType,
        kategori: pairs[2][1] as KategoriType,
        date: dayjs(pairs[3][1] as string, "YYYY-MM-DD").valueOf(),
        money: parseInt(pairs[4][1] as string),
        note: pairs[5][1] as string,
    };

    console.log("going", data);

    const response = await db.insert(transactions).values({ ...data });

    return Response.json(response);
}
