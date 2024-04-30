import type { AstroCookies } from "astro";
import { getLuciaFromD1 } from "./auth";

export const checkIsAuthenticated = async (
    locals: App.Locals,
    cookies: AstroCookies,
) => {
    const { db, lucia } = getLuciaFromD1(locals.runtime.env.D1);
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return null;
    }
    const { session, user } = await lucia.validateSession(sessionId);

    const authenticatedEmails: string[] = JSON.parse(
        Astro.locals.runtime.env.AUTHENTICATED_EMAILS,
    );

    if (
        !user ||
        authenticatedEmails.findIndex((email) => email === user.email) === -1
    ) {
        return null;
    }
    return user;
};
