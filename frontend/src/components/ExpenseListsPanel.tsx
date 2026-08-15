import { useState, useEffect } from "react";
import { apiCall } from "../api";
import type { ExpenseListDto } from "../types";
import RawResponse from "./RawResponse";

interface Props {
    baseUrl: string;
    onSelectList: (id: number) => void;
}

export default function ExpenseListsPanel({ baseUrl, onSelectList }: Props) {
    const [lists, setLists] = useState<ExpenseListDto[]>([]);
    const [raw, setRaw] = useState("—");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [createRaw, setCreateRaw] = useState("—");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadLists = async () => {
        setRaw("Loading…");
        const r = await apiCall<ExpenseListDto[]>(baseUrl, "/expense-lists");
        setRaw(r.raw || (r.networkError ? "Network error — see console" : ""));
        if (r.ok) setLists(r.json ?? []);
    };

    useEffect(() => {
        loadLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl]);

    const createList = async () => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        setCreateRaw("Sending…");
        const body = JSON.stringify({ title: title.trim(), description: description.trim() || null });
        const r = await apiCall<ExpenseListDto>(baseUrl, "/expense-lists", { method: "POST", body });
        setCreateRaw(r.raw || (r.networkError ? "Network error — see console" : ""));
        if (r.ok) {
            setTitle("");
            setDescription("");
            loadLists();
        }
    };

    const deleteList = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // don't trigger onSelectList when clicking delete
        if (!confirm(`Delete expense list #${id}? This can't be undone.`)) return;

        setDeletingId(id);
        const r = await apiCall(baseUrl, `/expense-lists/${id}`, { method: "DELETE" });
        setDeletingId(null);

        if (r.ok) {
            loadLists();
        } else {
            alert(`Failed to delete (status ${r.status})`);
        }
    };

    return (
        <div className="panel">
            <h2>
                <span className="method get">GET/POST</span> /expense-lists
            </h2>

            <button onClick={loadLists}>Fetch expense lists</button>

            <div className="result-label">Result</div>
            {lists.length === 0 ? (
                <div className="empty">No expense lists yet</div>
            ) : (
                lists.map((l) => (
                    <div key={l.id} className="list-item" onClick={() => onSelectList(l.id)}>
                        <div>
                            <div className="item-title">{l.title}</div>
                            <div className="item-desc">{l.description}</div>
                        </div>
                        <div className="list-item-actions">
                            <span className="id-badge">id: {l.id}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => deleteList(l.id, e)}
                                disabled={deletingId === l.id}
                            >
                                {deletingId === l.id ? "…" : "Delete"}
                            </button>
                        </div>
                    </div>
                ))
            )}
            <RawResponse value={raw} />

            <hr />

            <div className="row">
                <input placeholder="Title (required)" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="row">
                <input
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={createList}>Create expense list</button>
            <RawResponse value={createRaw} />
        </div>
    );
}