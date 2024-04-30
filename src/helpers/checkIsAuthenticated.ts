import type { AstroCookies } from "astro";
import { getLuciaFromD1 } from "./auth";
import type { User } from "lucia";

export const checkIsAuthenticated = async (
    locals: App.Locals,
    cookies: AstroCookies,
): Promise<{ user: User | null; status: number }> => {
    const { db, lucia } = getLuciaFromD1(locals.runtime.env.D1);
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return { user: null, status: 401 };
    }
    const { session, user } = await lucia.validateSession(sessionId);

    const authenticatedEmails: string[] = JSON.parse(
        Astro.locals.runtime.env.AUTHENTICATED_EMAILS,
    );

    if (
        !user ||
        authenticatedEmails.findIndex((email) => email === user.email) === -1
    ) {
        return { user: null, status: 403 };
    }
    return { user, status: 200 };

    // TODO should also check for 403
};
