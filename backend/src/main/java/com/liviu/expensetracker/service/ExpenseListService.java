package com.liviu.expensetracker.service;

import com.liviu.expensetracker.model.ExpenseList;

import java.util.List;
import java.util.Optional;

public interface ExpenseListService {
    List<ExpenseList> getExpenseLists();
    ExpenseList createExpenseList(ExpenseList expenseList);
    Optional<ExpenseList> getExpenseListById(Long expenseListId);
    void deleteExpenseList(Long expenseListId);
}
