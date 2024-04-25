import dayjs from "dayjs";
import type { DataType } from "../../db/schema";
import { parseCurrency } from "./InputForm";

export default function TransactionItem(props: {
    transaction: DataType;
    editing?: boolean;
}) {
    return (
        <div
            class={`flex justify-between p-2 ${props.transaction.arah === "masuk" ? "" : "text-red-700"} `}
        >
            <div class="flex flex-col">
                <div class="">
                    {dayjs(props.transaction.date).format("DD MMM")}
                </div>

                <div class=" text-lg font-semibold">
                    {props.transaction.note}
                </div>
                <div class="-mt-1 text-sm opacity-50">
                    {props.transaction.kategori}
                </div>
            </div>
            <div class="flex items-end justify-center gap-2">
                <div class="flex flex-col items-end justify-center ">
                    <div class="text-lg font-bold">
                        {props.transaction.arah === "masuk" ? "" : "-"}
                        {parseCurrency(props.transaction.money)}
                    </div>
                    <div class="opacity-50">{props.transaction.bank}</div>
                </div>
                {props.editing && (
                    <div class="flex flex-col items-center justify-center ">
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}
