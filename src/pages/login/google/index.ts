import { generateState } from "arctic";
import { getGoogle } from "../../../helpers/auth";
import { generateCodeVerifier } from "arctic";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const google = getGoogle(
        context.locals.runtime.env.GOOGLE_CLIENT_ID,
        context.locals.runtime.env.GOOGLE_CLIENT_SECRET,
        context.locals.runtime.env.GOOGLE_REDIRECT_URI,
    );
    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
    });

    context.cookies.set("google_oauth_state", state, {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return context.redirect(url.toString());
}
