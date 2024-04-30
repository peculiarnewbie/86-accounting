import { navigate } from "astro:transitions/client";
import dayjs from "dayjs";

export default function DateInput() {
    const changeMonth = (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        const date = dayjs(value, "YYYY-MM");

        navigate(
            `/view/transactions?month=${date.month() + 1}&year=${date.year()}`,
        );
    };
    return <input type="month" name="date" onchange={changeMonth} />;
}
