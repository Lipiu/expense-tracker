interface Props {
    baseUrl: string;
    onBaseUrlChange: (value: string) => void;
    connected: boolean | null;
    onTest: () => void;
}

export default function ConnectionBar({ baseUrl, onBaseUrlChange, connected, onTest }: Props) {
    const dotClass = connected === true ? "ok" : connected === false ? "err" : "";
    return (
        <div className="panel connection-bar">
            <span className={`status-dot ${dotClass}`} />
            <label>Base URL</label>
            <input value={baseUrl} onChange={(e) => onBaseUrlChange(e.target.value)} />
            <button className="secondary" onClick={onTest}>
                Test connection
            </button>
        </div>
    );
}