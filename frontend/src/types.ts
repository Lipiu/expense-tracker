export interface ExpenseDto {
    id: number;
    expenseName: string;
    amount: number;
    createdAt: string;
}

export interface ExpenseListDto {
    id: number;
    title: string;
    description: string | null;
    expenses?: ExpenseDto[] | null;
}

export interface ApiResult<T = unknown> {
    ok: boolean;
    status: number;
    raw: string;
    json: T | null;
    networkError?: boolean;
}