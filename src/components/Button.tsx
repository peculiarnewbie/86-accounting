import { children } from "solid-js";

export default function Button(props: {
    onClick: () => void;
    active?: boolean;
    children?: any;
}) {
    const c = children(() => props.children);
    return (
        <button
            onclick={props.onClick}
            type="button"
            class={`min-w-24 cursor-pointer rounded-md p-2 ${props.active ? "bg-blue-400" : "bg-slate-100"}`}
        >
            {c()}
        </button>
    );
}
