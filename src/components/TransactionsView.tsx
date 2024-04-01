import { For, createEffect, createSignal } from "solid-js";
import {
    Kategori,
    type DataType,
    type KategoriType,
    type ArahType,
    type BankType,
    Banks,
    Arah,
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
    const [date, setDate] = createSignal<Date>(new Date());

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

        const searchParams = new URLSearchParams(location.search);
        const month = searchParams.get("month") ?? dayjs().month();
        const year = searchParams.get("year") ?? dayjs().year();
        const date = dayjs(`${year}-${month}`, "YYYY-MM").valueOf();
        setDate(new Date(date));
    });

    return (
        <div class="container mx-auto items-center">
            {" "}
            <Filters
                updateFilter={updateFilter}
                filter={filter()}
                date={date()}
            />
            <For
                each={store.filteredAndSorted}
                fallback={
                    <div class="py-8 text-center text-xl">
                        no transactions matches the filter
                    </div>
                }
            >
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
    date: Date;
}) {
    const [show, setShow] = createSignal(false);

    const changeMonth = (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        const date = dayjs(value, "YYYY-MM");

        window.location.search = `?month=${date.month()}&year=${date.year()}`;
    };

    return (
        <div class="flex flex-col items-center p-4">
            <div class="flex w-full justify-between">
                <Button onClick={() => setShow(!show())} active={show()}>
                    Filter
                </Button>
                <input
                    type="month"
                    name="date"
                    value={dayjs(props.date).format("YYYY-MM")}
                    onchange={changeMonth}
                />
            </div>
            <div
                class={`flex justify-center gap-4 overflow-y-hidden pt-2 transition-all duration-700 ${show() ? "h-32 sm:h-20" : "h-0"}`}
            >
                <div class="flex flex-col items-center gap-1">
                    <p>Bank:</p>
                    <div class="flex flex-col gap-1 sm:flex-row">
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
                </div>
                <div class="flex flex-col items-center gap-1">
                    <p>Arah:</p>
                    <div class="flex flex-col gap-1 sm:flex-row">
                        <Button
                            onClick={() =>
                                props.updateFilter(
                                    props.filter.arah === Arah.Masuk
                                        ? { arah: undefined }
                                        : { arah: Arah.Masuk },
                                )
                            }
                            active={props.filter.arah === Arah.Masuk}
                        >
                            Masuk
                        </Button>
                        <Button
                            onClick={() =>
                                props.updateFilter(
                                    props.filter.arah === Arah.Keluar
                                        ? { arah: undefined }
                                        : { arah: Arah.Keluar },
                                )
                            }
                            active={props.filter.arah === Arah.Keluar}
                        >
                            Keluar
                        </Button>
                    </div>
                </div>
                <div class="flex flex-col items-center gap-1">
                    <p>Kategori:</p>
                    <div class="flex flex-col gap-1 sm:flex-row">
                        <Button
                            onClick={() =>
                                props.updateFilter(
                                    props.filter.kategori === Kategori.Sosial
                                        ? { kategori: undefined }
                                        : { kategori: Kategori.Sosial },
                                )
                            }
                            active={props.filter.kategori === Kategori.Sosial}
                        >
                            Sosial
                        </Button>
                        <Button
                            onClick={() =>
                                props.updateFilter(
                                    props.filter.kategori ===
                                        Kategori.Pendidikan
                                        ? { kategori: undefined }
                                        : { kategori: Kategori.Pendidikan },
                                )
                            }
                            active={
                                props.filter.kategori === Kategori.Pendidikan
                            }
                        >
                            Pendidikan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
