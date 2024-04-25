import {
    Arah,
    Banks,
    type ArahType,
    type BankType,
    type KategoriType,
    Kategori,
    type DataType,
} from "../../db/schema";
import { createEffect, createSignal } from "solid-js";
import Button from "./Button";
import { nanoid } from "nanoid";

export const parseCurrency = (money: number) => {
    let string = money.toString();
    let parts = [] as string[];
    for (let i = string.length; i > 3; i -= 3) {
        parts.push(string.slice(i - 3, i));
    }
    const leftOver = ((string.length + 2) % 3) + 1;
    string = "Rp" + string.slice(0, leftOver);
    parts.forEach((part) => {
        string += "." + part;
    });
    return string;
};

export default function InputForm(props: { prevData?: DataType }) {
    const [response, setResponse] = createSignal("");

    const [money, setMoney] = createSignal(0);
    const moneyString = () => parseCurrency(money());

    const [arah, setArah] = createSignal<ArahType>(Arah.Masuk);
    const [bank, setBank] = createSignal<BankType>(Banks.BNI);
    const [kategori, setKategori] = createSignal<KategoriType>(Kategori.Sosial);

    const updateMoney = (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        setMoney(parseInt(val));
    };

    let moneyRef: HTMLInputElement | undefined;

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        if (props.prevData) formData.append("id", props.prevData.id);
        else formData.append("id", nanoid());

        const response = await fetch("/api/input", {
            method: "POST",
            body: formData,
        });

        console.log("response", response);
        const data: string = await response.json();
        console.log("json response", data);
        setResponse(JSON.stringify(data));

        return "ok";
    }

    createEffect(() => {
        if (props.prevData) {
            setMoney(props.prevData.money);
            setArah(props.prevData.arah);
            setBank(props.prevData.bank);
            setKategori(props.prevData.kategori);
        }
    });

    return (
        <div class="container mx-auto p-4 text-center text-gray-700">
            <form
                onsubmit={submit}
                class="mx-auto flex  max-w-80 flex-col gap-2 rounded-md bg-slate-200 p-4"
            >
                <div class="flex flex-col items-start ">
                    <p>{"Arah"}</p>
                    <input hidden value={arah()} name="arah" />
                    <div class="flex gap-2">
                        <Button
                            active={arah() === Arah.Masuk}
                            onClick={() => setArah(Arah.Masuk)}
                        >
                            Masuk
                        </Button>
                        <Button
                            active={arah() === Arah.Keluar}
                            onClick={() => setArah(Arah.Keluar)}
                        >
                            Keluar
                        </Button>
                    </div>
                </div>
                <div class="flex flex-col items-start ">
                    <p>bank</p>
                    <input hidden value={bank()} name="bank" />
                    <div class="flex gap-2">
                        <Button
                            active={bank() === Banks.BNI}
                            onClick={() => setBank(Banks.BNI)}
                        >
                            BNI
                        </Button>
                        <Button
                            active={bank() === Banks.Mandiri}
                            onClick={() => setBank(Banks.Mandiri)}
                        >
                            Mandiri
                        </Button>
                    </div>
                </div>
                <div class="flex flex-col items-start ">
                    <p>kategori</p>
                    <input hidden value={kategori()} name="kategori" />
                    <div class="flex gap-2">
                        <Button
                            active={kategori() === Kategori.Sosial}
                            onClick={() => setKategori(Kategori.Sosial)}
                        >
                            Sosial
                        </Button>
                        <Button
                            active={kategori() === Kategori.Pendidikan}
                            onClick={() => setKategori(Kategori.Pendidikan)}
                        >
                            Pendidikan
                        </Button>
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
            <div>{response()}</div>
        </div>
    );
}
