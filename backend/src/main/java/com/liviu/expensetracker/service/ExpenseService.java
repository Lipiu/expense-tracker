package com.liviu.expensetracker.service;

import com.liviu.expensetracker.model.Expense;

import java.util.List;

public interface ExpenseService {
    List<Expense> getExpenses(Long expenseListId);
}
