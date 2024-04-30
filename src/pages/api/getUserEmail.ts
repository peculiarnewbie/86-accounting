import type { APIContext } from "astro";
import { getLuciaFromD1 } from "../../helpers/auth";

export async function GET(context: APIContext) {
    console.log("in getUserEmail");
    const { db, lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
    const sessionId =
        context.cookies.get(lucia.sessionCookieName)?.value ?? null;
    console.log(sessionId);
    if (!sessionId) {
        return new Response(null, {
            status: 401,
        });
    }
    const { session, user } = await lucia.validateSession(sessionId);

    console.log(session, user);

    const authenticatedEmails: string[] = JSON.parse(
        context.locals.runtime.env.AUTHENTICATED_EMAILS,
    );

    console.log(authenticatedEmails);

    if (
        !user ||
        authenticatedEmails.findIndex((email) => email === user.email) === -1
    ) {
        return new Response(null, {
            status: 403,
        });
    }
    return new Response(user.email);
}
