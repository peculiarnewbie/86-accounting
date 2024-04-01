import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { transactions, type DataType } from "../../../db/schema";
import { between } from "drizzle-orm";
import { parseParams } from "../../helpers/dateHelpers";
import { dummyData } from "../../../db/dummyData";

export async function GET(context: APIContext) {
    const runtime = context.locals.runtime;

    const url = new URL(context.request.url);
    const searchParams = new URLSearchParams(url.search);

    const date = parseParams(searchParams);
    const nextMonth = date.add(1, "month");

    const db = drizzle(runtime.env.D1);

    const data = (await db
        .select()
        .from(transactions)
        .where(
            between(transactions.date, date.valueOf(), nextMonth.valueOf()),
        )) as DataType[];

    // const data = dummyData;

    return Response.json(data);
}
