import { useState, useEffect } from "react";
import { apiCall } from "../../api"
import type { ExpenseListDto } from "../../types";
import "./ExpenseListsPanel.css";

interface Props {
    baseUrl: string;
    onSelectList: (id: number) => void;
}

export default function ExpenseListsPanel({
                                              baseUrl,
                                              onSelectList,
                                          }: Props) {
    const [lists, setLists] = useState<ExpenseListDto[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const loadLists = async () => {
        const r = await apiCall<ExpenseListDto[]>(
            baseUrl,
            "/expense-lists"
        );

        if (r.ok) {
            setLists(r.json ?? []);
        }
    };

    useEffect(() => {
        loadLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl]);

    const selectList = (id: number) => {
        setSelectedId(id);
        onSelectList(id);
    };

    const createList = async () => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        const body = JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
        });

        const r = await apiCall<ExpenseListDto>(
            baseUrl,
            "/expense-lists",
            {
                method: "POST",
                body,
            }
        );

        if (r.ok) {
            setTitle("");
            setDescription("");
            loadLists();
        } else {
            alert(`Failed to create list (status ${r.status})`);
        }
    };

    const deleteList = async (
        id: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        if (
            !confirm(
                `Delete expense list #${id}? This can't be undone.`
            )
        ) {
            return;
        }

        setDeletingId(id);

        const r = await apiCall(
            baseUrl,
            `/expense-lists/${id}`,
            {
                method: "DELETE",
            }
        );

        setDeletingId(null);

        if (r.ok) {
            if (selectedId === id) {
                setSelectedId(null);
                onSelectList(null as unknown as number);
            }

            loadLists();
        } else {
            alert(`Failed to delete (status ${r.status})`);
        }
    };

    return (
        <div className="panel expense-lists-panel">
            <div className="expense-lists-header">
                <h2>Expense Lists</h2>

                {lists.length > 0 && (
                    <span className="expense-lists-count">
                        {lists.length}
                    </span>
                )}
            </div>

            {lists.length === 0 ? (
                <div className="empty">
                    No expense lists yet.
                    <br />
                    Create one below.
                </div>
            ) : (
                <div className="expense-lists">
                    {lists.map((list) => (
                        <div
                            key={list.id}
                            className={`expense-list-item ${
                                selectedId === list.id
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() =>
                                selectList(list.id)
                            }
                        >
                            <div className="expense-list-content">
                                <div className="expense-list-title">
                                    {list.title}
                                </div>

                                {list.description && (
                                    <div className="expense-list-description">
                                        {list.description}
                                    </div>
                                )}
                            </div>

                            <div className="expense-list-actions">
                                <button
                                    className="delete-btn"
                                    onClick={(e) =>
                                        deleteList(list.id, e)
                                    }
                                    disabled={
                                        deletingId === list.id
                                    }
                                >
                                    {deletingId === list.id
                                        ? "…"
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="create-list">
                <div className="create-list-header">
                    <div className="create-list-title">
                        New expense list
                    </div>

                    <div className="create-list-subtitle">
                        Create a list to organize your expenses
                    </div>
                </div>

                <div className="create-list-form">
                    <input
                        placeholder="List title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <input
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />

                    <button className="create-list-btn" onClick={createList}>
                        + Create list
                    </button>
                </div>
            </div>
        </div>
    );
}