interface Props {
    label?: string;
    value: string;
}

export default function RawResponse({ label = "Raw response", value }: Props) {
    return (
        <>
            <div className="result-label">{label}</div>
            <pre>{value}</pre>
        </>
    );
}