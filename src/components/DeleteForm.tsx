import { createSignal } from "solid-js";

export default function DeleteForm() {
    const [response, setResponse] = createSignal("");

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch("/api/deleteAll", {
            method: "POST",
            body: formData,
        });
        console.log("response", response);
        const data: string = await response.json();
        console.log("json response", data);
        setResponse(data);

        return "ok";
    }

    return (
        <form onsubmit={submit}>
            <p>pass</p>
            <input type="text" name="pass" />
        </form>
    );
}
