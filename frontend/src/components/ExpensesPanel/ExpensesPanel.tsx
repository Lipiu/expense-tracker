import { useState, useEffect } from "react";
import { apiCall, formatRon } from "../../api";
import type { ExpenseDto } from "../../types";
import "./ExpensesPanel.css";

interface Props {
    baseUrl: string;
    expenseListId: number | null;
}

/*
 * <input type="date"> gives us:
 *      2026-08-31
 *
 * Backend LocalDateTime expects:
 *      2026-08-31T00:00:00
 */
function toLocalDateTime(date: string): string | null {
    if (!date) return null;
    return `${date}T00:00:00`;
}

/*
 * Backend gives us:
 *      2026-08-31T00:00:00
 *
 * <input type="date"> needs:
 *      2026-08-31
 */
function toDateInputValue(date: string | null): string {
    if (!date) return "";
    return date.substring(0, 10);
}

export default function ExpensesPanel({
                                          baseUrl,
                                          expenseListId,
                                      }: Props) {
    const [expenses, setExpenses] = useState<ExpenseDto[]>([]);

    // Add form
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    // Loading states
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // Edit form
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDueDate, setEditDueDate] = useState("");

    const loadExpenses = async () => {
        if (expenseListId == null) return;

        const r = await apiCall<ExpenseDto[]>(
            baseUrl,
            `/expense-lists/${expenseListId}/expenses`
        );

        if (r.ok) {
            setExpenses(r.json ?? []);
        }
    };

    useEffect(() => {
        if (expenseListId != null) {
            loadExpenses();
        } else {
            setExpenses([]);
        }

        setEditingId(null);

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

        const body = JSON.stringify({
            expenseName: name.trim(),
            amount: parsedAmount,
            dueDate: toLocalDateTime(dueDate),
            isPaid: false,
        });

        const r = await apiCall<ExpenseDto>(
            baseUrl,
            `/expense-lists/${expenseListId}/expenses`,
            {
                method: "POST",
                body,
            }
        );

        if (r.ok) {
            setName("");
            setAmount("");
            setDueDate("");

            loadExpenses();
        } else {
            alert(`Failed to add expense (status ${r.status})`);
        }
    };

    const deleteExpense = async (
        id: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        if (expenseListId == null) return;

        if (
            !confirm(
                `Delete expense #${id}? This can't be undone.`
            )
        ) {
            return;
        }

        setDeletingId(id);

        const r = await apiCall(
            baseUrl,
            `/expense-lists/${expenseListId}/expenses/${id}`,
            {
                method: "DELETE",
            }
        );

        setDeletingId(null);

        if (r.ok) {
            loadExpenses();
        } else {
            alert(`Failed to delete (status ${r.status})`);
        }
    };

    const startEdit = (
        exp: ExpenseDto,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        setEditingId(exp.id);
        setEditName(exp.expenseName);
        setEditAmount(String(exp.amount));

        // Important:
        // Convert backend LocalDateTime to <input type="date"> format.
        setEditDueDate(
            toDateInputValue(exp.dueDate)
        );
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditAmount("");
        setEditDueDate("");
    };

    const saveEdit = async (exp: ExpenseDto) => {
        if (
            expenseListId == null ||
            editingId == null
        ) {
            return;
        }

        if (!editName.trim()) {
            alert("Expense name is required");
            return;
        }

        const parsedAmount = parseFloat(editAmount);

        if (Number.isNaN(parsedAmount)) {
            alert("Amount must be a number");
            return;
        }

        const body = JSON.stringify({
            id: exp.id,
            expenseName: editName.trim(),
            amount: parsedAmount,

            // Important:
            // Convert 2026-08-31 -> 2026-08-31T00:00:00
            dueDate: toLocalDateTime(editDueDate),

            createdAt: exp.createdAt,
            isPaid: exp.isPaid,
        });

        const r = await apiCall<ExpenseDto>(
            baseUrl,
            `/expense-lists/${expenseListId}/expenses/${exp.id}`,
            {
                method: "PUT",
                body,
            }
        );

        if (r.ok) {
            cancelEdit();
            loadExpenses();
        } else {
            alert(`Failed to save changes (status ${r.status})`);
        }
    };

    const togglePaid = async (exp: ExpenseDto) => {
        if (expenseListId == null) return;

        setTogglingId(exp.id);

        const r = await apiCall(
            baseUrl,
            `/expense-lists/${expenseListId}/expenses/${exp.id}/paid`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    paid: !exp.isPaid,
                }),
            }
        );

        setTogglingId(null);

        if (r.ok) {
            loadExpenses();
        } else {
            alert(`Failed to update status (status ${r.status})`);
        }
    };

    const isOverdue = (expense: ExpenseDto) => {
        if (!expense.dueDate || expense.isPaid) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(
            `${expense.dueDate.substring(0, 10)}T00:00:00`
        );

        return due < today;
    };

    const formatDueDate = (
        date: string | null
    ) => {
        if (!date) return null;

        const dateOnly = date.substring(0, 10);

        return new Intl.DateTimeFormat("ro-RO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(
            new Date(`${dateOnly}T00:00:00`)
        );
    };

    /*
     * Group expenses by month.
     */
    const groupedExpenses = expenses.reduce(
        (groups, expense) => {
            const date = expense.dueDate
                ? expense.dueDate
                : expense.createdAt;

            const month = date.substring(0, 7);

            if (!groups[month]) {
                groups[month] = [];
            }

            groups[month].push(expense);

            return groups;
        },
        {} as Record<string, ExpenseDto[]>
    );

    const sortedMonths = Object.keys(
        groupedExpenses
    ).sort((a, b) => b.localeCompare(a));

    const formatMonth = (month: string) => {
        const date = new Date(
            `${month}-01T00:00:00`
        );

        return new Intl.DateTimeFormat("ro-RO", {
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const total = expenses.reduce(
        (sum, expense) =>
            sum + expense.amount,
        0
    );

    const paidTotal = expenses
        .filter((expense) => expense.isPaid)
        .reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );

    const unpaidTotal = expenses
        .filter((expense) => !expense.isPaid)
        .reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );

    const overdueExpenses =
        expenses.filter(isOverdue);

    return (
        <div className="panel expenses-panel">

            {/* Header */}
            <div className="expenses-header">
                <div className="expenses-header-top">
                    <div>
                        <div className="expenses-title">
                            <h2>Expenses</h2>

                            {expenseListId != null && (
                                <span className="muted">
                                    List #{expenseListId}
                                </span>
                            )}
                        </div>

                        {expenses.length > 0 && (
                            <div className="expenses-summary">
                                <span>
                                    Total{" "}
                                    <strong>
                                        {formatRon(total)}
                                    </strong>
                                </span>

                                <span className="summary-paid">
                                    Paid{" "}
                                    <strong>
                                        {formatRon(
                                            paidTotal
                                        )}
                                    </strong>
                                </span>

                                <span className="summary-unpaid">
                                    Unpaid{" "}
                                    <strong>
                                        {formatRon(
                                            unpaidTotal
                                        )}
                                    </strong>
                                </span>

                                {overdueExpenses.length >
                                    0 && (
                                        <span className="summary-overdue">
                                        Overdue{" "}
                                            <strong>
                                            {
                                                overdueExpenses.length
                                            }
                                        </strong>
                                    </span>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* No list selected */}
            {expenseListId == null ? (
                <div className="empty empty-large">
                    <div className="empty-icon">
                        $
                    </div>

                    <strong>
                        Select an expense list
                    </strong>

                    <span>
                        Choose a list from the left
                        to view its expenses.
                    </span>
                </div>

            ) : expenses.length === 0 ? (
                <div className="empty empty-large">
                    <div className="empty-icon">
                        +
                    </div>

                    <strong>
                        No expenses yet
                    </strong>

                    <span>
                        Add your first expense below.
                    </span>
                </div>

            ) : (
                <div className="expenses-groups">

                    {sortedMonths.map((month) => {
                        const monthExpenses =
                            groupedExpenses[month];

                        const monthTotal =
                            monthExpenses.reduce(
                                (sum, expense) =>
                                    sum +
                                    expense.amount,
                                0
                            );

                        return (
                            <div
                                key={month}
                                className="expense-month"
                            >
                                <div className="month-header">
                                    <div>
                                        <div className="month-name">
                                            {formatMonth(
                                                month
                                            )}
                                        </div>

                                        <div className="month-count">
                                            {
                                                monthExpenses.length
                                            }{" "}
                                            expense
                                            {monthExpenses.length !==
                                            1
                                                ? "s"
                                                : ""}
                                        </div>
                                    </div>

                                    <div className="month-total">
                                        {formatRon(
                                            monthTotal
                                        )}
                                    </div>
                                </div>

                                <div className="month-expenses">

                                    {monthExpenses.map(
                                        (exp) =>
                                            editingId ===
                                            exp.id ? (

                                                <div
                                                    key={
                                                        exp.id
                                                    }
                                                    className="expense-card edit-mode"
                                                >
                                                    <div className="edit-fields">

                                                        <input
                                                            value={
                                                                editName
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setEditName(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Expense name"
                                                        />

                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                editAmount
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setEditAmount(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Amount"
                                                        />

                                                        <input
                                                            type="date"
                                                            value={
                                                                editDueDate
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setEditDueDate(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <button className="save-btn"
                                                            onClick={() =>
                                                                saveEdit(
                                                                    exp
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            className="cancel-btn"
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>

                                            ) : (

                                                <div
                                                    key={
                                                        exp.id
                                                    }
                                                    className={`expense-card ${
                                                        exp.isPaid
                                                            ? "paid"
                                                            : ""
                                                    } ${
                                                        isOverdue(
                                                            exp
                                                        )
                                                            ? "overdue"
                                                            : ""
                                                    }`}
                                                >
                                                    <label
                                                        className="paid-checkbox"
                                                        onClick={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                exp.isPaid
                                                            }
                                                            disabled={
                                                                togglingId ===
                                                                exp.id
                                                            }
                                                            onChange={() =>
                                                                togglePaid(
                                                                    exp
                                                                )
                                                            }
                                                        />
                                                    </label>

                                                    <div className="expense-info">
                                                        <div className="expense-title-row">

                                                            <div className="expense-name">
                                                                {
                                                                    exp.expenseName
                                                                }
                                                            </div>

                                                            {isOverdue(
                                                                exp
                                                            ) && (
                                                                <span className="overdue-badge">
                                                                    Overdue
                                                                </span>
                                                            )}

                                                            {exp.isPaid && (
                                                                <span className="paid-badge">
                                                                    Paid
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="expense-meta">
                                                            {exp.dueDate
                                                                ? `Due ${formatDueDate(
                                                                    exp.dueDate
                                                                )}`
                                                                : "No due date"}
                                                        </div>
                                                    </div>

                                                    <div className="expense-amount">
                                                        {formatRon(
                                                            exp.amount
                                                        )}
                                                    </div>

                                                    <div>
                                                        <button
                                                            className="edit-btn"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                startEdit(
                                                                    exp,
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                deleteExpense(
                                                                    exp.id,
                                                                    e
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                exp.id
                                                            }
                                                        >
                                                            {deletingId ===
                                                            exp.id
                                                                ? "…"
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add expense */}
            {expenseListId != null && (
                <div className="add-expense">

                    <div className="add-expense-header">
                        <div className="add-expense-title">
                            Add expense
                        </div>
                    </div>

                    <div className="expense-form">

                        <div className="form-field expense-name-field">
                            <label>
                                Expense
                            </label>

                            <input
                                placeholder="e.g. Electricity"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Amount
                            </label>

                            <div className="amount-input">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="amount-currency">
                                    RON
                                </span>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>
                                Due date (optional)
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <button
                            className="add-expense-btn"
                            onClick={
                                createExpense
                            }
                        >
                            + Add expense
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}