import { eq } from "drizzle-orm";
import { dummyData } from "../../db/dummyData";
import { transactions, type DataType } from "../../db/schema";
import { getLuciaFromD1 } from "./auth";

export const getTransaction = async (locals: App.Locals) => {
    const { db } = getLuciaFromD1(locals.runtime.env.D1);
    let data: DataType;

    if (Astro.locals.runtime.env.DEV) data = dummyData[3];

    const url = new URL(Astro.request.url);
    const searchParams = new URLSearchParams(url.search);

    const id = searchParams.get("id");

    if (!id) data = {} as DataType;
    else {
        data = (
            (await db
                .select()
                .from(transactions)
                .where(eq(transactions.id, id))) as DataType[]
        )[0];
    }
    return data;
};
