import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { transactions, type DataType } from "../../../db/schema";
import { and, between, eq, not } from "drizzle-orm";
import { parseParams } from "../../helpers/dateHelpers";
import { dummyData } from "../../../db/dummyData";

export async function GET(context: APIContext) {
    const runtime = context.locals.runtime;

    if (runtime.env.DEV) {
        return Response.json(dummyData);
    }
    const url = new URL(context.request.url);
    const searchParams = new URLSearchParams(url.search);

    const date = parseParams(searchParams);
    const nextMonth = date.add(1, "month");

    const db = drizzle(runtime.env.D1);

    let data: DataType[] = (await db
        .select()
        .from(transactions)
        .where(
            and(
                between(transactions.date, date.valueOf(), nextMonth.valueOf()),
                not(eq(transactions.date, nextMonth.valueOf())),
            ),
        )) as DataType[];

    return Response.json(data);
}
