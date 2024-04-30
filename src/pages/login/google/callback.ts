import { getGoogle, getLuciaFromD1 } from "../../../helpers/auth";
import {
    OAuth2RequestError,
    generateCodeVerifier,
    type GoogleRefreshedTokens,
    type GoogleTokens,
} from "arctic";
import { generateId } from "lucia";

import type { APIContext } from "astro";
import { usersTable } from "../../../../db/schema";

import { eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
    const { db, lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
    const google = getGoogle(
        context.locals.runtime.env.GOOGLE_CLIENT_ID,
        context.locals.runtime.env.GOOGLE_CLIENT_SECRET,
        context.locals.runtime.env.GOOGLE_REDIRECT_URI,
    );
    const code = context.url.searchParams.get("code");
    const state = context.url.searchParams.get("state");
    const storedState =
        context.cookies.get("google_oauth_state")?.value ?? null;
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400,
        });
    }

    try {
        const codeVerifier = context.locals.runtime.env.GOOGLE_VERIFIER;
        console.log("codeVerifier", codeVerifier);
        let tokens: GoogleTokens;
        try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
        } catch (e) {
            console.log("erroring", e);
            if (
                e instanceof OAuth2RequestError &&
                e.message === "bad_verification_code"
            ) {
                // invalid code
                return new Response(null, {
                    status: 400,
                });
            }
            return new Response("mehh", {
                status: 500,

                //@ts-expect-error
                error: e,
            });
        }
        console.log("tokens", tokens);
        const googleUserResponse = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            },
        );
        console.log("response", googleUserResponse);
        const userText = await googleUserResponse.text();
        console.log("text", userText);
        const json = JSON.parse(userText);
        console.log("json", json);
        const user: GoogleUser = { id: json.id, email: json.email };
        console.log("user", user);
        const googleUser: GoogleUser = { id: user.id, email: user.email };
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, googleUser.email));

        if (existingUser.length > 0) {
            const session = await lucia.createSession(existingUser[0].id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            context.cookies.set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
            return context.redirect("/");
        }

        const userId = generateId(15);
        await db.insert(usersTable).values({
            id: userId,
            email: googleUser.email,
        });
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        return context.redirect("/");
    } catch (e) {
        if (
            e instanceof OAuth2RequestError &&
            e.message === "bad_verification_code"
        ) {
            // invalid code
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
            //@ts-expect-error
            error: e,
        });
    }
}

interface GoogleUser {
    id: string;
    email: string;
}
