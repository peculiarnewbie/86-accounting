import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import Counter from "~/components/Counter";

export default function Home() {
	const [money, setMoney] = createSignal(0);
	const moneyString = () => parseCurrency(money());

	const parseCurrency = (money: number) => {
		let string = money.toString();
		let parts = [] as string[];
		for (let i = string.length; i > 3; i -= 3) {
			console.log("part", i);
			parts.push(string.slice(i - 3, i));
		}
		const leftOver = ((string.length + 2) % 3) + 1;
		string = "Rp" + string.slice(0, leftOver);
		console.log("string", string);
		parts.forEach((part) => {
			console.log("oart", part);
			string += "." + part;
		});
		console.log(parts);
		return string;
	};

	const updateMoney = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setMoney(parseInt(val));
	};

	let moneyRef: HTMLInputElement | undefined;

	return (
		<main class="mx-auto p-4 text-center text-gray-700">
			<form class="mx-auto flex max-w-80 flex-col items-start gap-2 rounded-md bg-slate-200 p-4">
				<div class="flex flex-col items-start ">
					<p>bank</p>
					<select class="rounded-md p-2" name="bank">
						<option value="BNI">BNI</option>
						<option value="Mandiri">Mandiri</option>
					</select>
				</div>
				<div class="flex flex-col items-start ">
					<p>kategori</p>
					<select class="rounded-md p-2" name="bank">
						<option value="Sosial">Sosial</option>
						<option value="Pendidikan">Pendidikan</option>
					</select>
				</div>
				<div class="flex flex-col items-start ">
					<p>Jumlah</p>
					<input
						ref={moneyRef}
						name="money"
						type="number"
						value={money()}
						oninput={updateMoney}
						onfocus={() => {
							if (!moneyRef) return;
							moneyRef.select();
						}}
					/>
					<p>{moneyString()}</p>
				</div>
				<button type="submit">input</button>
			</form>
		</main>
	);
}
