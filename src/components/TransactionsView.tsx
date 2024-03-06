import { For } from "solid-js";
import type { DataType } from "../../db/schema";
import dayjs from "dayjs";
import { parseCurrency } from "./InputForm";

export default function TransactionsView(props: { transactions: DataType[] }) {
    console.log(props.transactions);
    return (
        <div class="overflow-x-auto">
            <div class=" mx-auto min-w-[768px] border border-b-0 border-blue-300">
                <div class="flex divide-x divide-blue-400 border-b border-blue-300 bg-blue-200">
                    <p class="w-10  p-1">no.</p>
                    <p class="min-w-24 grow  p-1">catatan</p>
                    <p class=" min-w-36  p-1 md:order-last">jumlah</p>
                    <p class="w-20  p-1 ">bank</p>
                    <p class="w-20  p-1">arah</p>
                    <p class="w-24  p-1">kategori</p>
                    <p class="w-36  p-1">tanggal</p>
                </div>
                <For each={props.transactions}>
                    {(transaction, i) => (
                        <div
                            class={`flex divide-x divide-blue-400 border-b border-blue-300 ${transaction.arah === "masuk" ? "odd:bg-white even:bg-blue-50" : "odd:bg-red-100 even:bg-red-200"}`}
                        >
                            <p class="w-10 p-1">{i() + 1}.</p>
                            <p class="min-w-24 grow p-1">{transaction.note}</p>
                            <p class="min-w-36 p-1 md:order-last">
                                {parseCurrency(transaction.money)}
                            </p>
                            <p class="w-20 p-1">{transaction.bank}</p>
                            <p class="w-20 p-1">{transaction.arah}</p>
                            <p class="w-24 p-1">{transaction.kategori}</p>
                            <p class="w-36 p-1">
                                {dayjs(transaction.date).format("DD MMMM YYYY")}
                            </p>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}
