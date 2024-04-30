import { getLuciaFromD1 } from "../../helpers/auth";

export default async function GET(context: any) {
    const { db, lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
    const sessionId =
        context.cookies.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        return new Response(null, {
            status: 401,
        });
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        return context.redirect("/login/google");
    }

    const authenticatedEmails: string[] = JSON.parse(
        context.locals.runtime.env.AUTHENTICATED_EMAILS,
    );

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
