import { useState, useEffect } from "react";
import { apiCall } from "../api";
import type { ExpenseDto } from "../types";
import RawResponse from "./RawResponse";

interface Props {
    baseUrl: string;
    expenseListId: number | null;
}

export default function ExpensesPanel({ baseUrl, expenseListId }: Props) {
    const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
    const [raw, setRaw] = useState("—");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [createRaw, setCreateRaw] = useState("—");

    const loadExpenses = async () => {
        if (expenseListId == null) return;
        setRaw("Loading…");
        const r = await apiCall<ExpenseDto[]>(baseUrl, `/expense-lists/${expenseListId}/expenses`);
        setRaw(r.raw || (r.networkError ? "Network error — see console" : ""));
        if (r.ok) setExpenses(r.json ?? []);
    };

    useEffect(() => {
        if (expenseListId != null) loadExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expenseListId, baseUrl]);

    const createExpense = async () => {
        if (expenseListId == null) {
            alert("Select an expense list first");
            return;
        }
        if (!name.trim()) {
            alert("Expense name is required");
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (Number.isNaN(parsedAmount)) {
            alert("Amount must be a number");
            return;
        }
        setCreateRaw("Sending…");
        const body = JSON.stringify({ expenseName: name.trim(), amount: parsedAmount });
        const r = await apiCall<ExpenseDto>(baseUrl, `/expense-lists/${expenseListId}/expenses`, {
            method: "POST",
            body,
        });
        setCreateRaw(r.raw || (r.networkError ? "Network error — see console" : ""));
        if (r.ok) {
            setName("");
            setAmount("");
            loadExpenses();
        }
    };

    return (
        <div className="panel">
            <h2>
                Expenses{" "}
                <span className="muted">
          {expenseListId != null ? `for list #${expenseListId}` : "(select a list)"}
        </span>
            </h2>

            {expenseListId == null ? (
                <div className="empty">Click an expense list on the left to view its expenses</div>
            ) : (
                <>
                    <button onClick={loadExpenses}>Fetch expenses</button>

                    <div className="result-label">Result</div>
                    {expenses.length === 0 ? (
                        <div className="empty">No expenses in this list</div>
                    ) : (
                        expenses.map((e) => (
                            <div key={e.id} className="list-item">
                                <div>
                                    <div className="item-title">{e.expenseName}</div>
                                    <div className="item-desc">{e.createdAt}</div>
                                </div>
                                <div className="id-badge">
                                    id: {e.id} · ${e.amount}
                                </div>
                            </div>
                        ))
                    )}
                    <RawResponse value={raw} />

                    <hr />

                    <div className="row">
                        <input placeholder="Expense name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input
                            placeholder="Amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <button onClick={createExpense}>Add expense</button>
                    <RawResponse value={createRaw} />
                </>
            )}
        </div>
    );
}