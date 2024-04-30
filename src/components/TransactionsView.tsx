import { For, createEffect, createSignal, type Setter } from "solid-js";
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
import DateInput from "./DateInput";
import TransactionItem from "./TransactionItem";
import { navigate } from "astro:transitions/client";

type Filter = {
    arah?: ArahType;
    bank?: BankType;
    kategori?: KategoriType;
};

type Total = {
    masuk?: number;
    keluar?: number;
    total: number;
};

export default function TransactionsView(props: {
    data: DataType[];
    date: number;
    canEdit?: boolean;
}) {
    const [store, setStore] = createStore<{
        transactions: DataType[];
        filteredAndSorted: DataType[];
    }>({
        transactions: props.data,
        filteredAndSorted: [],
    });

    const [editing, setEditing] = createSignal(false);
    const [filter, setFilter] = createSignal<Filter>({});
    const [total, setTotal] = createSignal<Total>({ total: 0 });

    let totalContainer!: HTMLDivElement;

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

        let newTotal: Total = { total: 0 };
        filtered.forEach((transaction) => {
            if (transaction.arah === "masuk") {
                newTotal.masuk = newTotal.masuk
                    ? newTotal.masuk + transaction.money
                    : transaction.money;
                newTotal.total += transaction.money;
            } else {
                newTotal.keluar = newTotal.keluar
                    ? newTotal.keluar + transaction.money
                    : transaction.money;
                newTotal.total -= transaction.money;
            }
        });
        setTotal(newTotal);
    });

    return (
        <div
            class="container mx-auto items-center divide-y-[1px]"
            style={{ "padding-bottom": "100px" }}
        >
            {" "}
            <div>
                <Filters
                    updateFilter={updateFilter}
                    filter={filter()}
                    date={props.date}
                    editing={editing()}
                    canEdit={props.canEdit}
                    setEditing={setEditing}
                />
            </div>
            <For
                each={store.filteredAndSorted}
                fallback={
                    <div class="py-8 text-center text-xl">
                        no transactions matches the filter
                    </div>
                }
            >
                {(transaction, i) => (
                    <TransactionItem
                        transaction={transaction}
                        editing={editing()}
                    />
                )}
            </For>
            <div
                class="fixed bottom-0 left-0 w-full bg-slate-100 p-2"
                style={{ "box-shadow": "0px -4px 15px rgba(0, 0, 0, 0.1)" }}
                ref={totalContainer}
            >
                <div class="container mx-auto flex justify-between">
                    <div>
                        <div class="flex gap-1">
                            <p>Masuk:</p>
                            <div class="flex items-center justify-center">
                                {parseCurrency(total().masuk ?? 0)}
                            </div>
                        </div>

                        <div class="flex gap-1 text-red-700">
                            <p>Keluar:</p>
                            <div class="flex items-center justify-center">
                                {parseCurrency(total().keluar ?? 0)}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-end">
                        <p>Total</p>
                        <div class="flex items-center justify-center font-semibold">
                            {total().total < 0
                                ? `-${parseCurrency(Math.abs(total().total))}`
                                : parseCurrency(total().total)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Filters(props: {
    updateFilter: (update: Filter) => void;
    filter: Filter;
    date: number;
    editing: boolean | undefined;
    canEdit?: boolean;
    setEditing: Setter<boolean>;
}) {
    const [show, setShow] = createSignal(false);

    return (
        <div class="flex flex-col items-center p-4">
            <div class="flex w-full justify-between">
                <div class="flex gap-2">
                    <Button onClick={() => setShow(!show())} active={show()}>
                        Filters
                    </Button>

                    {props.canEdit ? (
                        !props.editing ? (
                            <Button onClick={() => props.setEditing(true)}>
                                Edit
                            </Button>
                        ) : (
                            <Button onClick={() => props.setEditing(false)}>
                                Back
                            </Button>
                        )
                    ) : (
                        <></>
                    )}
                </div>
                <DateInput date={props.date} />
            </div>
            <div
                class={`flex justify-center gap-4 overflow-y-hidden pt-2 transition-all duration-300 ${show() ? "h-32 sm:h-20" : "h-0"}`}
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
