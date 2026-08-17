package com.liviu.expensetracker.service;

import com.liviu.expensetracker.model.Expense;

import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    List<Expense> listExpenses(Long expenseListId);
    Expense createExpense(Long expenseListId, Expense expense);
    Optional<Expense> getExpense(Long expenseListId, Long expenseId);
    Expense updateExpense(Long expenseListId, Long expenseId, Expense expense);
    Expense setPaidStatus(Long expenseListId, Long expenseId, boolean isPaid);
    void deleteExpense(Long expenseListId, Long expenseId);
}
