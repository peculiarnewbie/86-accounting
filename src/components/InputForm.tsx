import {
    Arah,
    Banks,
    type ArahType,
    type BankType,
    type KategoriType,
    Kategori,
    type DataType,
    transactions,
} from "../../db/schema";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { drizzle } from "drizzle-orm/d1";
import { Suspense, createResource, createSignal } from "solid-js";

// const inputData = async (formData: FormData) => {
//     "use server";

//     const pairs = [];

//     for (const pair of formData.entries()) {
//         pairs.push([pair[0], pair[1]]);
//     }

//     const data: DataType = {
//         id: nanoid(),
//         arah: pairs[0][1] as ArahType,
//         bank: pairs[1][1] as BankType,
//         kategori: pairs[2][1] as KategoriType,
//         date: dayjs(pairs[3][1] as string, "YYYY-MM-DD").valueOf(),
//         money: parseInt(pairs[4][1] as string),
//         note: pairs[5][1] as string,
//     };

//     console.log(import.meta.env.D1);

//     const db = drizzle(import.meta.env.D1);
//     console.log("db", db);
//     const res = await db.insert(transactions).values(data);

//     console.log("result", res);
// };

async function postFormData(formData: FormData) {
    const response = await fetch("/api/test", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data;
}

export default function InputForm() {
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);

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
            console.log("part", part);
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

    function submit(e: SubmitEvent) {
        e.preventDefault();
        setFormData(new FormData(e.target as HTMLFormElement));
    }

    return (
        <div class="mx-auto p-4 text-center text-gray-700">
            <form
                onsubmit={submit}
                class="mx-auto flex max-w-80 flex-col gap-2 rounded-md bg-slate-200 p-4"
            >
                <div class="flex flex-col items-start ">
                    <p>{"Arah"}</p>
                    <input hidden value={arah()} name="arah" />
                    <div class="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setArah(Arah.Masuk)}
                            class={`min-w-24 cursor-pointer rounded-md p-2 ${arah() === Arah.Masuk ? "bg-blue-400" : "bg-slate-100"}`}
                        >
                            Masuk
                        </button>
                        <button
                            type="button"
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
                            type="button"
                            onclick={() => setBank(Banks.BNI)}
                            class={`min-w-24 cursor-pointer rounded-md p-2 ${bank() === Banks.BNI ? "bg-blue-400" : "bg-slate-100"}`}
                        >
                            BNI
                        </button>
                        <button
                            type="button"
                            onclick={() => setBank(Banks.Mandiri)}
                            class={`min-w-24 cursor-pointer rounded-md p-2 ${bank() === Banks.Mandiri ? "bg-blue-400" : "bg-slate-100"}`}
                        >
                            Mandiri
                        </button>
                    </div>
                </div>
                <div class="flex flex-col items-start ">
                    <p>kategori</p>
                    <input hidden value={kategori()} name="kategori" />
                    <div class="flex gap-2">
                        <button
                            type="button"
                            onclick={() => setKategori(Kategori.Sosial)}
                            class={`min-w-24 cursor-pointer rounded-md p-2 ${kategori() === Kategori.Sosial ? "bg-blue-400" : "bg-slate-100"}`}
                        >
                            Sosial
                        </button>
                        <button
                            type="button"
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
            <div>
                <Suspense>{response() && <p>{response().message}</p>}</Suspense>
            </div>
        </div>
    );
}
