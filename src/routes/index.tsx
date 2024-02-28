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
					<p>Arah</p>
					<div class="flex gap-2">
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							Masuk
						</div>
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							Keluar
						</div>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>bank</p>
					<div class="flex gap-2">
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							BNI
						</div>
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							Mandiri
						</div>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>kategori</p>
					<div class="flex gap-2">
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							Sosial
						</div>
						<div class="min-w-24 cursor-pointer rounded-md bg-slate-100 p-2">
							Pendidikan
						</div>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>tanggal</p>
					<input class="rounded-md p-2" type="date" name="date" />
				</div>
				<div class="flex flex-col items-start ">
					<p>Jumlah</p>
					<input
						class="rounded-md p-2"
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
				<div class="flex flex-col items-start ">
					<p>catatan</p>
					<input class="rounded-md p-2" type="text" name="note" />
				</div>
				<button type="submit">input</button>
			</form>
		</main>
	);
}
