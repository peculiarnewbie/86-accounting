import { For, createEffect, createSignal } from "solid-js";
import {
    Kategori,
    type DataType,
    type KategoriType,
    type ArahType,
    type BankType,
    Banks,
} from "../../db/schema";
import dayjs from "dayjs";
import { parseCurrency } from "./InputForm";
import { createStore } from "solid-js/store";
import Button from "./Button";

type Filter = {
    arah?: ArahType;
    bank?: BankType;
    kategori?: KategoriType;
};

export default function TransactionsView() {
    const [store, setStore] = createStore<{
        transactions: DataType[];
        filteredAndSorted: DataType[];
    }>({
        transactions: [],
        filteredAndSorted: [],
    });

    const [filter, setFilter] = createSignal<Filter>({});

    const updateFilter = (update: Filter) => {
        setFilter({ ...filter(), ...update });
    };

    createEffect(() => {
        const filtered = store.transactions.filter((transaction) => {
            if (filter().arah && transaction.arah !== filter().arah)
                return false;
            if (filter().bank && transaction.bank !== filter().bank)
                return false;
            if (filter().kategori && transaction.kategori !== filter().kategori)
                return false;
            return true;
        });
        setStore({
            transactions: store.transactions,
            filteredAndSorted: filtered,
        });
        console.log(filtered);
    });

    createEffect(() => {
        const data: DataType[] = [
            {
                id: "123",
                arah: "masuk",
                bank: "bni",
                kategori: "sosial",
                date: 170000000,
                money: 100000,
                note: "nope",
            },
            {
                id: "LGmLWy8GmizbRXtkllF7r",
                arah: "masuk",
                bank: "mandiri",
                kategori: "sosial",
                date: 1710979200000,
                money: 100000,
                note: "hey",
            },
            {
                id: "h0UYuAQdZTS34rbJaoZQm",
                arah: "masuk",
                bank: "bni",
                kategori: "pendidikan",
                date: 1709424000000,
                money: 1000,
                note: "hecc",
            },
            {
                id: "w0OmBmrdwRRyUo7OZXiHh",
                arah: "masuk",
                bank: "bni",
                kategori: "pendidikan",
                date: 1709424000000,
                money: 1000,
                note: "heccee",
            },
            {
                id: "QeWwpWlPDluIb6lk1ilfA",
                arah: "keluar",
                bank: "mandiri",
                kategori: "pendidikan",
                date: 1709424000000,
                money: 100,
                note: "yeah",
            },
        ];
        setStore({ transactions: data });
        console.log("hey");
    });

    return (
        <div class="container mx-auto items-center">
            {" "}
            <Filters updateFilter={updateFilter} filter={filter()} />
            <For each={store.filteredAndSorted}>
                {(transaction, i) => (
                    <div
                        class={`flex justify-between p-2 odd:bg-slate-100 ${transaction.arah === "masuk" ? "" : "text-red-700"} `}
                    >
                        <div class="flex flex-col">
                            <div class="opacity-50">{transaction.kategori}</div>
                            <div class="text-lg font-bold">
                                {transaction.note}
                            </div>

                            <div class="pt-1 opacity-80">
                                {dayjs(transaction.date).format("DD MMMM YYYY")}
                            </div>
                        </div>
                        <div class="flex flex-col items-end justify-center ">
                            <div class="opacity-50">{transaction.bank}</div>
                            <div class="text-lg font-semibold">
                                {transaction.arah === "masuk" ? "" : "-"}
                                {parseCurrency(transaction.money)}
                            </div>
                        </div>
                    </div>
                )}
            </For>
            <p>{JSON.stringify(filter())}</p>
        </div>
    );
}

function Filters(props: {
    updateFilter: (update: Filter) => void;
    filter: Filter;
}) {
    return (
        <div class="flex p-4">
            <Button
                onClick={() =>
                    props.updateFilter(
                        props.filter.bank === Banks.BNI
                            ? { bank: undefined }
                            : { bank: Banks.BNI },
                    )
                }
                active={props.filter.bank === Banks.BNI}
            >
                BNI
            </Button>
            <Button
                onClick={() =>
                    props.updateFilter(
                        props.filter.bank === Banks.Mandiri
                            ? { bank: undefined }
                            : { bank: Banks.Mandiri },
                    )
                }
                active={props.filter.bank === Banks.Mandiri}
            >
                Mandiri
            </Button>
        </div>
    );
}
