import type { APIEvent } from "@solidjs/start/server";

export async function GET(event) {
	console.log(event.context);
}
