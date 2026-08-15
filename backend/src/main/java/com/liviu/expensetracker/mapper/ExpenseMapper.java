package com.liviu.expensetracker.mapper;

import com.liviu.expensetracker.dto.ExpenseDto;
import com.liviu.expensetracker.model.Expense;

public interface ExpenseMapper {
    Expense fromDto(ExpenseDto expenseDto);
    ExpenseDto toDto(Expense expense);
}
