import { Lucia } from "lucia";
import { Google } from "arctic";
import { sessionsTable, usersTable } from "../../db/schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1/driver";
import { drizzle } from "drizzle-orm/d1";

export const initAdapter = (db: DrizzleD1Database) => {
    return new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);
};

export const getLucia = (adapter: DrizzleSQLiteAdapter) => {
    return new Lucia(adapter, {
        sessionCookie: {
            attributes: {
                secure: import.meta.env.PROD,
            },
        },
        getUserAttributes: (attributes) => {
            return {
                // attributes has the type of DatabaseUserAttributes
                email: attributes.email,
            };
        },
    });
};
declare module "lucia" {
    interface Register {
        Lucia: ReturnType<typeof getLucia>;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

export const getLuciaFromD1 = (d1: D1Database) => {
    const db = drizzle(d1);
    const adapter = initAdapter(db);
    return {
        db: db,
        adapter: adapter,
        lucia: getLucia(adapter),
    };
};

interface DatabaseUserAttributes {
    email: string;
}

export const getGoogle = (id: string, secret: string, uri: string) =>
    new Google(id, secret, uri);
