import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { banks, transactions } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { checkIsAuthenticated } from "../../helpers/checkIsAuthenticated";

export async function POST(context: APIContext) {
    const user = checkIsAuthenticated(
        context.locals.runtime.env,
        context.cookies,
    );

    if (!user) return new Response("unauthorized", { status: 401 });

    const json: { id: string } = await context.request.json();
    const id = json.id;
    if (!id) return new Response("id is required", { status: 400 });

    const db = drizzle(context.locals.runtime.env.D1);

    const transaction = await db
        .delete(transactions)
        .where(eq(transactions.id, id))
        .returning();

    if (transaction.length === 0)
        return new Response("transaction not found", { status: 404 });

    const bank = await db
        .select()
        .from(banks)
        .where(eq(banks.name, transaction[0].bank));
    let currentMoney = bank[0].money;

    if (transaction[0].arah === "keluar") {
        currentMoney += transaction[0].money;
    } else currentMoney -= transaction[0].money;

    await db
        .update(banks)
        .set({ money: currentMoney })
        .where(eq(banks.name, transaction[0].bank));

    return Response.json({ message: "success" });
}
