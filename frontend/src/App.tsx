import { useState } from "react";
import ExpenseListsPanel from "./components/ExpenseListPanel/ExpenseListsPanel.tsx";
import ExpensesPanel from "./components/ExpensesPanel/ExpensesPanel.tsx";
import "./App.css";

const BASE_URL = "http://localhost:8080";

export default function App() {
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    return (
        <div className="page">
            <h1>Expense Tracker</h1>
            <div className="sub">Manage your expense lists and track what's paid.</div>

            <div className="layout">
                <ExpenseListsPanel baseUrl={BASE_URL} onSelectList={setSelectedListId} />
                <ExpensesPanel baseUrl={BASE_URL} expenseListId={selectedListId} />
            </div>
        </div>
    );
}