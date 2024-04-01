import dayjs from "dayjs";

export default function parseParams(searchParams: URLSearchParams) {
    const month = searchParams.get("month") ?? dayjs().month();
    const year = searchParams.get("year") ?? dayjs().year();
    const date = dayjs(`${year}-${month}`, "YYYY-MM");

    return date;
}
