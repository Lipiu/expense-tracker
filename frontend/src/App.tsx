import { useEffect, useState } from "react";
import ExpenseListsPanel from "./components/ExpenseListPanel/ExpenseListsPanel";
import ExpensesPanel from "./components/ExpensesPanel/ExpensesPanel";
import "./App.css";

const BASE_URL = "http://localhost:8080";

type Theme = "light" | "dark";

export default function App() {
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme");

        if (saved === "dark" || saved === "light") {
            return saved;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) =>
            current === "light" ? "dark" : "light"
        );
    };

    return (
        <div className="page">
            <header className="page-header">
                <div className="page-title">
                    <h1>Expense Tracker</h1>

                    <div className="sub">
                        Manage your expense lists and track what's paid.
                    </div>
                </div>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    type="button"
                    aria-label={`Switch to ${
                        theme === "light" ? "dark" : "light"
                    } mode`}
                >
                    {theme === "light" ? "☾ Dark" : "☀ Light"}
                </button>
            </header>

            <div className="layout">
                <ExpenseListsPanel
                    baseUrl={BASE_URL}
                    onSelectList={setSelectedListId}
                />

                <ExpensesPanel
                    baseUrl={BASE_URL}
                    expenseListId={selectedListId}
                />
            </div>
        </div>
    );
}