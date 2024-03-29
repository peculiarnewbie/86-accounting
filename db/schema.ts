import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export interface Env {
    D1: D1Database;
}
// export default {
//   async fetch(request: Request, env: Env) {
//     const db = drizzle(env.D1);
//     const result = await db.select().from(users).all()
//     return Response.json(result);
//   },
// };

export type DataType = {
    id: string;
    arah: ArahType;
    bank: BankType;
    kategori: KategoriType;
    date: number;
    money: number;
    note: string;
};

export const Banks = {
    BNI: "bni",
    Mandiri: "mandiri",
} as const;

export type BankType = (typeof Banks)[keyof typeof Banks];

export const Arah = {
    Masuk: "masuk",
    Keluar: "keluar",
} as const;

export type ArahType = (typeof Arah)[keyof typeof Arah];

export const Kategori = {
    Sosial: "sosial",
    Pendidikan: "pendidikan",
} as const;

export type KategoriType = (typeof Kategori)[keyof typeof Kategori];

export const transactions = sqliteTable("transactions", {
    id: text("id").primaryKey(),
    arah: text("arah"),
    bank: text("bank"),
    kategori: text("kategori"),
    date: integer("date"),
    money: integer("money"),
    note: text("note"),
});

export type Transaction = typeof transactions.$inferSelect; // return type when queried
export type NewTransaction = typeof transactions.$inferInsert;
