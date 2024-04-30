import dayjs from "dayjs";
import type { DataType } from "../../db/schema";
import { parseCurrency } from "./InputForm";
import { createSignal } from "solid-js";
import { navigate } from "astro:transitions/client";

export default function TransactionItem(props: {
    transaction: DataType;
    editing?: boolean;
}) {
    const [showDeleteModal, setShowDeleteModal] = createSignal(false);
    return (
        <div
            class={`flex justify-between p-2 ${props.transaction.arah === "masuk" ? "" : "text-red-700"} `}
        >
            {showDeleteModal() && (
                <ConfirmDeleteModal
                    id={props.transaction.id}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
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
            <div class="flex items-end justify-center gap-4">
                <div class="flex flex-col items-end justify-center ">
                    <div class="text-lg font-bold">
                        {props.transaction.arah === "masuk" ? "" : "-"}
                        {parseCurrency(props.transaction.money)}
                    </div>
                    <div class="opacity-50">{props.transaction.bank}</div>
                </div>
                {props.editing && (
                    <div class=" flex h-full flex-col items-center justify-center gap-2 text-sm text-black  ">
                        <button
                            class="w-full rounded-md bg-sky-200 p-1 "
                            onclick={() =>
                                navigate(`/edit?id=${props.transaction.id}`)
                            }
                        >
                            Edit
                        </button>
                        <button
                            class="w-full rounded-md bg-red-200 p-1"
                            onclick={() => {
                                setShowDeleteModal(true);
                            }}
                        >
                            Delete
                        </button>
                        {/* <button>Delete</button> */}
                    </div>
                )}
            </div>
        </div>
    );
}

function ConfirmDeleteModal(props: { id: string; onCancel: () => void }) {
    const onConfirm = () => {};
    return (
        <div class="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div class=" rounded-md bg-white text-black">
                <div class="flex items-center justify-between p-4">
                    <div class="text-xcenter text-old text-center">
                        Are you sure you want to delete this transaction?
                    </div>
                </div>
                <div class="flex items-center gap-2 p-4">
                    <button
                        class="w-full rounded-md bg-red-200 p-1 "
                        onclick={() => onConfirm()}
                    >
                        Delete
                    </button>
                    <button
                        class="w-full rounded-md bg-sky-200 p-1"
                        onclick={props.onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
