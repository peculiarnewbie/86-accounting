import { drizzle } from "drizzle-orm/d1";
import { For, createResource } from "solid-js";
import { transactions } from "~/db/schema";

export default function About() {
	const [entries] = createResource(async () => {
		const db = drizzle(import.meta.env.D1);
		const res = await db.select().from(transactions);
		console.log(res);
		return await res.json();
	});

	return (
		<ul>
			{entries() &&
				entries()!.map((transaction) => <li>{transaction.note}</li>)}
		</ul>
	);
}
