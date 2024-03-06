import { For } from "solid-js";
import type { DataType } from "../../db/schema";

export default function TransactionsView(props: { transactions: DataType[] }) {
    console.log(props.transactions);
    return (
        <div class="mx-auto">
            <div>
                <For each={props.transactions}>
                    {(transaction, i) => (
                        <div>
                            {i()}.<span>{transaction.id}</span>
                            <span>Rp.{transaction.money}</span>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}
