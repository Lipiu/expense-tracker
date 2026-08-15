import { useState } from "react";
import { apiCall } from "./api";
import ConnectionBar from "./components/ConnectionBar";
import ExpenseListsPanel from "./components/ExpenseListsPanel";
import ExpensesPanel from "./components/ExpensesPanel";
import "./App.css";

const DEFAULT_BASE_URL = "http://localhost:8080";

export default function App() {
    const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
    const [connected, setConnected] = useState<boolean | null>(null);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    const testConnection = async () => {
        setConnected(null);
        const r = await apiCall(baseUrl, "/expense-lists");
        setConnected(r.ok);
        if (!r.ok) {
            alert(r.networkError ? "Could not reach the server. Is it running? Check CORS too." : `Status ${r.status}`);
        }
    };

    return (
        <div className="page">
            <h1>Expense Tracker — API Tester</h1>
            <div className="sub">React + TypeScript test client for your Spring Boot backend.</div>

            <ConnectionBar
                baseUrl={baseUrl}
                onBaseUrlChange={setBaseUrl}
                connected={connected}
                onTest={testConnection}
            />

            <div className="layout">
                <ExpenseListsPanel baseUrl={baseUrl} onSelectList={setSelectedListId} />
                <ExpensesPanel baseUrl={baseUrl} expenseListId={selectedListId} />
            </div>
        </div>
    );
}