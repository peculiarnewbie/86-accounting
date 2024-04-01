import dayjs from "dayjs";

export function parseParams(searchParams: URLSearchParams) {
    const month = searchParams.get("month") ?? dayjs().month() + 1;
    const year = searchParams.get("year") ?? dayjs().year();
    const date = dayjs(`${year}-${month}`, "YYYY-MM");

    return date;
}
