import { action, redirect } from "@solidjs/router";
import dayjs from "dayjs";
import { createSignal } from "solid-js";

export type DataType = {
	arah: ArahType;
	bank: BankType;
	kategori: KategoriType;
	date: number;
	money: number;
	note: string;
};

const inputData = action(async (formData: FormData) => {
	"use server";

	const pairs = [];

	for (const pair of formData.entries()) {
		pairs.push([pair[0], pair[1]]);
	}

	const data: DataType = {
		arah: pairs[0][1] as ArahType,
		bank: pairs[1][1] as BankType,
		kategori: pairs[2][1] as KategoriType,
		date: dayjs(pairs[3][1] as string, "YYYY-MM-DD").valueOf(),
		money: parseInt(pairs[4][1] as string),
		note: pairs[5][1] as string,
	};

	console.log(data);
});

const Banks = {
	BNI: "bni",
	Mandiri: "mandiri",
} as const;

type BankType = (typeof Banks)[keyof typeof Banks];

const Arah = {
	Masuk: "masuk",
	Keluar: "keluar",
} as const;

type ArahType = (typeof Arah)[keyof typeof Arah];

const Kategori = {
	Sosial: "sosial",
	Pendidikan: "pendidikan",
} as const;

type KategoriType = (typeof Kategori)[keyof typeof Kategori];

export default function Home() {
	const [money, setMoney] = createSignal(0);
	const moneyString = () => parseCurrency(money());

	const [arah, setArah] = createSignal<ArahType>(Arah.Masuk);
	const [bank, setBank] = createSignal<BankType>(Banks.BNI);
	const [kategori, setKategori] = createSignal<KategoriType>(Kategori.Sosial);

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
			<form
				action={inputData}
				method="post"
				class="mx-auto flex max-w-80 flex-col gap-2 rounded-md bg-slate-200 p-4"
			>
				<div class="flex flex-col items-start ">
					<p>{"Arah"}</p>
					<input hidden value={arah()} name="arah" />
					<div class="flex gap-2">
						<button
							onclick={() => setArah(Arah.Masuk)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${arah() === Arah.Masuk ? "bg-blue-400" : "bg-slate-100"}`}
						>
							Masuk
						</button>
						<button
							onclick={() => setArah(Arah.Keluar)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${arah() === Arah.Keluar ? "bg-blue-400" : "bg-slate-100"}`}
						>
							Keluar
						</button>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>bank</p>
					<input hidden value={bank()} name="bank" />
					<div class="flex gap-2">
						<button
							onclick={() => setBank(Banks.BNI)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${bank() === Banks.BNI ? "bg-blue-400" : "bg-slate-100"}`}
						>
							BNI
						</button>
						<div
							onclick={() => setBank(Banks.Mandiri)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${bank() === Banks.Mandiri ? "bg-blue-400" : "bg-slate-100"}`}
						>
							Mandiri
						</div>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>kategori</p>
					<input hidden value={kategori()} name="kategori" />
					<div class="flex gap-2">
						<button
							onclick={() => setKategori(Kategori.Sosial)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${kategori() === Kategori.Sosial ? "bg-blue-400" : "bg-slate-100"}`}
						>
							Sosial
						</button>
						<button
							onclick={() => setKategori(Kategori.Pendidikan)}
							class={`min-w-24 cursor-pointer rounded-md p-2 ${kategori() === Kategori.Pendidikan ? "bg-blue-400" : "bg-slate-100"}`}
						>
							Pendidikan
						</button>
					</div>
				</div>
				<div class="flex flex-col items-start ">
					<p>tanggal</p>
					<input class="rounded-md p-2" type="date" name="date" />
				</div>
				<div class="flex flex-col items-start ">
					<p>Jumlah</p>
					<input
						class="w-full rounded-md p-2"
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
					<input
						class=" w-full rounded-md p-2"
						type="text"
						name="note"
					/>
				</div>
				<button
					class={`min-w-24 cursor-pointer rounded-md bg-slate-100 p-2`}
					type="submit"
				>
					input
				</button>
			</form>
		</main>
	);
}
