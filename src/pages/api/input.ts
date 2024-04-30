import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import {
    banks,
    transactions,
    type ArahType,
    type BankType,
    type DataType,
    type KategoriType,
} from "../../../db/schema";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

export async function POST(context: APIContext) {
    const runtime = context.locals.runtime;

    const db = drizzle(runtime.env.D1);

    const formData = await context.request.formData();

    const pairs = [];

    for (const pair of formData.entries()) {
        pairs.push([pair[0], pair[1]]);
    }

    const data: DataType = {
        id: pairs[6][1] as string,
        arah: pairs[0][1] as ArahType,
        bank: pairs[1][1] as BankType,
        kategori: pairs[2][1] as KategoriType,
        date: dayjs(pairs[3][1] as string, "YYYY-MM-DD").valueOf(),
        money: parseInt(pairs[4][1] as string),
        note: pairs[5][1] as string,
    };

    console.log("going", data);

    const { id, ...rest } = data;

    let moneyUpdate = data.money;

    const transaction = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, id));

    let response;

    // updating transaction
    if (transaction.length > 0) {
        if (transaction[0].arah === data.arah) {
            moneyUpdate = data.money - (transaction[0].money ?? 0);
        } else {
            moneyUpdate = data.money + (transaction[0].money ?? 0);
        }

        if (data.arah === "keluar") {
            moneyUpdate = -moneyUpdate;
        }

        response = await db.transaction(async (tx) => {
            const bank = await tx
                .select()
                .from(banks)
                .where(eq(banks.name, data.bank));
            const currentMoney = bank[0].money;
            await tx
                .update(transactions)
                .set({ ...rest })
                .where(eq(transactions.id, id));
            await tx
                .update(banks)
                .set({ money: currentMoney + moneyUpdate })
                .where(eq(banks.name, data.bank));
        });
    } else {
        if (data.arah === "keluar") {
            moneyUpdate = -moneyUpdate;
        }

        response = await db.transaction(async (tx) => {
            const bank = await tx
                .select()
                .from(banks)
                .where(eq(banks.name, data.bank));
            const currentMoney = bank[0].money;
            await tx.insert(transactions).values({ ...data });
            await tx
                .update(banks)
                .set({ money: currentMoney + moneyUpdate })
                .where(eq(banks.name, data.bank));
        });
    }

    return Response.json(response);
}
